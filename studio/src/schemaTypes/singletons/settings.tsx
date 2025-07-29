import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import * as demo from '../../lib/initialValues'

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'general',
      title: 'General',
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO & Metadata',
    },
    {
      name: 'social',
      title: 'Social Media',
    },
    {
      name: 'contact',
      title: 'Contact Information',
    },
  ],
  fields: [
    // General Settings
    defineField({
      name: 'title',
      description: 'Your website name',
      title: 'Site Title',
      type: 'object',
      group: 'general',
      fields: [
        {
          name: 'fr',
          type: 'string',
          title: 'French',
          validation: (rule) => rule.required(),
        },
        {
          name: 'ar',
          type: 'string',
          title: 'Arabic',
          validation: (rule) => rule.required(),
        },
      ],
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'object',
      description: 'A short phrase that appears under the site title',
      group: 'general',
      fields: [
        {
          name: 'fr',
          type: 'string',
          title: 'French',
        },
        {
          name: 'ar',
          type: 'string',
          title: 'Arabic',
        },
      ],
    }),
    defineField({
      name: 'url',
      title: 'Site URL',
      type: 'url',
      description: 'The main URL of your website',
      validation: (rule) => rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'A brief description of the logo for accessibility purposes',
        },
      ],
      group: 'general',
    }),

    // SEO Fields
    defineField({
      name: 'description',
      description: 'The main description for your website (important for SEO)',
      title: 'Meta Description',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'fr',
          type: 'text',
          title: 'French',
          validation: (rule) => rule.max(160).warning('Should be under 160 characters'),
        },
        {
          name: 'ar',
          type: 'text',
          title: 'Arabic',
          validation: (rule) => rule.max(160).warning('Should be under 160 characters'),
        },
      ],
    }),
    defineField({
      name: 'keywords',
      title: 'Meta Keywords',
      type: 'object',
      description: 'Main keywords describing your site (used for SEO)',
      group: 'seo',
      fields: [
        {
          name: 'fr',
          type: 'array',
          title: 'French',
          of: [{type: 'string'}],
        },
        {
          name: 'ar',
          type: 'array',
          title: 'Arabic',
          of: [{type: 'string'}],
        },
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Social Share Image',
      type: 'image',
      description: 'Default image used when sharing on social media (Facebook, Twitter, etc)',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'object',
          fields: [
            {
              name: 'fr',
              type: 'string',
              title: 'French',
              validation: (rule) => rule.required(),
            },
            {
              name: 'ar',
              type: 'string',
              title: 'Arabic',
              validation: (rule) => rule.required(),
            },
          ],
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && (!alt?.fr || !alt?.ar)) {
                return 'Both French and Arabic alternative text are required when an image is uploaded'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: 'The base URL for Open Graph meta tags',
        }),
      ],
      group: 'seo',
    }),
    defineField({
      name: 'robotsTxt',
      title: 'Robots.txt Content',
      type: 'text',
      description: 'Custom rules for search engine crawlers',
      group: 'seo',
    }),

    // Social Media
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Twitter', value: 'twitter'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'YouTube', value: 'youtube'},
                ],
              },
            },
            {name: 'url', title: 'URL', type: 'url'},
          ],
        },
      ],
      group: 'social',
    }),

    // Contact Information
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      group: 'contact',
      fields: [
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
        },
        {
          name: 'address',
          title: 'Address',
          type: 'object',
          fields: [
            {
              name: 'fr',
              type: 'text',
              title: 'French',
            },
            {
              name: 'ar',
              type: 'text',
              title: 'Arabic',
            },
          ],
        },
        {
          name: 'whatsapp',
          title: 'WhatsApp',
          type: 'string',
        },
        {
          name: 'businessHours',
          title: 'Business Hours',
          type: 'object',
          fields: [
            {
              name: 'fr',
              type: 'text',
              title: 'French',
            },
            {
              name: 'ar',
              type: 'text',
              title: 'Arabic',
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})

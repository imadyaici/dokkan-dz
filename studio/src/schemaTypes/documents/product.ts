import { BasketIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'object',
      description: 'The name of the product',
      fields: [
        {
          name: 'fr',
          type: 'string',
          title: 'French',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'ar',
          type: 'string',
          title: 'Arabic',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A unique identifier for the product, used in URLs',
      options: {
        source: 'name.fr',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        {
          name: 'fr',
          type: 'text',
          title: 'French',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'ar',
          type: 'text',
          title: 'Arabic',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      validation: (Rule) => Rule.required(),
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: 'alt',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      titleFr: 'name.fr',
      titleAr: 'name.ar',
    },
    prepare({ titleFr, titleAr }) {
      return {
        title: `${titleFr} - ${titleAr}`,
      };
    },
  },
});

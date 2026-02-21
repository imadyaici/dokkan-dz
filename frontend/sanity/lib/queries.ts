import { defineQuery } from 'next-sanity';

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0] {
    title,
    tagline,
    url,
    "logo": logo.asset->url,
    "logoAlt": logo.alt,
    description,
    keywords,
    ogImage {
      asset->,
      alt,
      metadataBase
    },
    robotsTxt,
    socialLinks[] {
      platform,
      url
    },
    contactInfo
  }
`);

export const productQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    images[]{
      asset->{
        _id,
        url,
      }
    },
    _updatedAt,
  }
`);

export const allProductsQuery = defineQuery(`
  *[_type == "product" && defined(slug.current)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    images[]{
      asset->{
        _id,
        url,
      }
    },
    _updatedAt
  }
`);

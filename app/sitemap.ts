import type {MetadataRoute} from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://vancouverkdd.com',
      //   lastModified: new Date(),
      changeFrequency: 'monthly',
      //   priority: 1,
    },
    {
      url: 'https://vancouverkdd.com/about',
      changeFrequency: 'yearly',
    },
    {
      url: 'https://vancouverkdd.com/contact',
      changeFrequency: 'yearly',
    },
    {
      url: 'https://vancouverkdd.com/events',
      changeFrequency: 'monthly',
    },
  ]
}

import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SplitSimple',
    short_name: 'SplitSimple',
    description:
      'Split expenses with friends and family—simply, fairly, and without daily limits.',
    start_url: '/groups',
    id: '/groups',
    display: 'standalone',
    background_color: '#fbf9f4',
    theme_color: '#4d7d6b',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}

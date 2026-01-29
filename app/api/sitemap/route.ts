import { NextResponse } from 'next/server';

// Major SCC cases for sitemap
const majorCases = [
  'r-v-oakes-1986',
  'r-v-morgentaler-1988',
  'reference-re-secession-of-quebec-1998',
  'r-v-sparrow-1990',
  'roncarelli-v-duplessis-1959',
  'r-v-stinchcombe-1991',
  'carter-v-canada-2015',
  'r-v-collins-1987',
  'r-v-golden-2001',
  'r-v-fearon-2014',
  'r-v-askov-1990',
  'r-v-jordan-2016',
  'andrews-v-law-society-of-bc-1989',
  'law-v-canada-1999',
  'dunsmuir-v-new-brunswick-2008',
  'vavilov-2019',
  'r-v-grant-2009',
  'r-v-gladue-1999',
  'r-v-lavallee-1990',
];

export async function GET() {
  const baseUrl = 'https://law-search-tawny.vercel.app';

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/home', changefreq: 'weekly', priority: 0.9 },
    { url: '/features', changefreq: 'weekly', priority: 0.9 },
    { url: '/chat', changefreq: 'daily', priority: 0.8 },
  ];

  const casePages = majorCases.map(slug => ({
    url: `/cases/${slug}`,
    changefreq: 'monthly',
    priority: 0.8
  }));

  const allPages = [...staticPages, ...casePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

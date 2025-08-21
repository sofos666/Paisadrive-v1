const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// IMPORTANT: Make sure you have a .env.local file with these variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Supabase URL or Anon Key is not defined.");
  console.error("Please create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const a = 1;
const PUBLIC_URL = 'https://www.paisadrive.com'; // TODO: Replace with your actual domain

async function generateSitemap() {
  console.log('Generating sitemap...');

  try {
    // Fetch all available cars
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('id, updated_at')
      .eq('status', 'available');

    if (carsError) throw carsError;

    // Define static pages
    const staticPages = [
      { path: '/', priority: '1.0', lastmod: new Date().toISOString() },
      { path: '/vender', priority: '0.8', lastmod: new Date().toISOString() },
      { path: '/seguros', priority: '0.7', lastmod: new Date().toISOString() },
      { path: '/creditos', priority: '0.7', lastmod: new Date().toISOString() },
    ];

    const sitemapUrls = staticPages.map(page => `
  <url>
    <loc>${PUBLIC_URL}${page.path}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>`);

    const carUrls = cars.map(car => `
  <url>
    <loc>${PUBLIC_URL}/car/${car.id}</loc>
    <lastmod>${new Date(car.updated_at).toISOString()}</lastmod>
    <priority>0.9</priority>
  </url>`);

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapUrls.join('')}
  ${carUrls.join('')}
</urlset>`;

    fs.writeFileSync('public/sitemap.xml', sitemapContent);

    console.log('Sitemap generated successfully at public/sitemap.xml');
    console.log(`Included ${staticPages.length} static pages and ${cars.length} car pages.`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();

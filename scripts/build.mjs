import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const dist = path.join(root, 'dist');
const categories = ['smartphones', 'tablets', 'notebooks'];
const excluded = new Set(['.git', 'node_modules', 'dist', '.wrangler']);

async function copyTree(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const entry of await fs.readdir(from, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.name === 'package.json' || entry.name === 'package-lock.json' || entry.name === 'worker.js' || entry.name === 'scripts') continue;
    if (entry.isDirectory()) await copyTree(source, target);
    else await fs.copyFile(source, target);
  }
}
function safeText(v) { return typeof v === 'string' ? v : (v == null ? '' : String(v)); }
async function main() {
  await fs.rm(dist, { recursive: true, force: true });
  await copyTree(root, dist);
  const contentDir = path.join(dist, 'content');
  await fs.mkdir(contentDir, { recursive: true });
  const siteConfigPath = path.join(root, 'config/site.json');
  let siteConfig = { logoTexto: 'Guia Rápido Tech', logoImagem: '', seoDescription: '' };
  try { siteConfig = { ...siteConfig, ...JSON.parse(await fs.readFile(siteConfigPath, 'utf8')) }; } catch {}
  await fs.writeFile(path.join(contentDir, 'config.json'), JSON.stringify(siteConfig, null, 2));

  for (const category of categories) {
    const sourceDir = path.join(root, category);
    const entries = [];
    for (const name of await fs.readdir(sourceDir)) {
      if (!name.endsWith('.md')) continue;
      const fullPath = path.join(sourceDir, name);
      const raw = await fs.readFile(fullPath, 'utf8');
      let parsed;
      try { parsed = matter(raw); } catch (err) { console.warn(`Frontmatter inválido ignorado: ${category}/${name}`, err.message); continue; }
      const d = parsed.data || {};
      if (d.published === false) continue;
      const slug = name.slice(0, -3);
      const offers = {
        amazon: d.amazon || d.oferta_amazon || {},
        mercadolivre: d.mercadolivre || d.oferta_mercadolivre || {},
        shopee: d.shopee || d.oferta_shopee || {}
      };
      entries.push({
        slug, category, categoria: category === 'smartphones' ? 'Smartphones' : category === 'tablets' ? 'Tablets' : 'Notebooks', title: safeText(d.title || d.modelo || slug), marca: safeText(d.marca || 'Outras'), modelo: safeText(d.modelo || ''),
        description: safeText(d.description || d.seo_description || ''), seo_title: safeText(d.seo_title || d.title || ''),
        seo_description: safeText(d.seo_description || d.description || ''), image: safeText(d.image || ''), image_alt: safeText(d.image_alt || d.title || slug),
        badge: safeText(d.badge || 'ANÁLISE'), preco: safeText(d.preco_estimado || offers.amazon.preco || offers.mercadolivre.preco || offers.shopee.preco || 'Consulte'),
        tela: safeText(d.tela || ''), processador: safeText(d.processador || ''), bateria: safeText(d.bateria || ''),
        url: `/produtos/template.html?cat=${category}&slug=${encodeURIComponent(slug)}`,
        file: `/${category}/${name}`, date: safeText(d.date || ''), keywords: Array.isArray(d.keywords) ? d.keywords : safeText(d.keywords).split(',').map(x=>x.trim()).filter(Boolean),
        comparativos: Array.isArray(d.comparativos) ? d.comparativos : [d.concorrente_1, d.concorrente_2].filter(Boolean), offers
      });
    }
    entries.sort((a,b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0) || a.title.localeCompare(b.title, 'pt-BR'));
    const categoryOut = path.join(contentDir, category);
    await fs.mkdir(categoryOut, { recursive: true });
    await fs.writeFile(path.join(categoryOut, 'index.json'), JSON.stringify(entries, null, 2));
  }
  // Compatibilidade com o endereço antigo usado pela página de smartphones.
  await fs.copyFile(path.join(contentDir, 'smartphones/index.json'), path.join(contentDir, 'smartphones-index.json'));
  for (const category of categories) {
    const cfgPath = path.join(root, category, 'hub_config.json');
    try {
      const cfg = JSON.parse(await fs.readFile(cfgPath, 'utf8'));
      await fs.writeFile(path.join(contentDir, `${category}_hub.json`), JSON.stringify(cfg, null, 2));
    } catch { await fs.writeFile(path.join(contentDir, `${category}_hub.json`), '{}'); }
  }
  console.log('Build concluído: dist/ contém o site e os índices dinâmicos de artigos.');
}
main().catch(err => { console.error(err); process.exit(1); });

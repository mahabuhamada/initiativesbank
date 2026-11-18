/**
 * بناء موقع بنك المبادرات لمحركات البحث
 * ----------------------------------------
 * يولّد كل صفحة مسبقًا إلى HTML كامل (العناوين، الأوصاف، الروابط القانونية، وسوم المشاركة،
 * البيانات المنظمة JSON-LD، والمحتوى نفسه) داخل مجلد dist/، مع صفحة مستقلة لكل مبادرة ولكل خبر،
 * وخريطة الموقع sitemap.xml وملف robots.txt.
 * الصفحات تبقى تفاعلية: يعيد JavaScript بناءها من البيانات عند فتحها في المتصفح.
 *
 * الاستخدام: npm install && npm run build
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist');
const SKIP = new Set(['node_modules', 'dist', '.git', '.github', 'tools', 'package.json', 'package-lock.json']);
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

// البيانات
const ctx = { window: {} }; vm.runInNewContext(read('data/site-data.js'), ctx);
const DATA = ctx.window.IB_DATA;
const S = DATA.site;
const BASE = ((S.seo && S.seo.baseUrl) || 'https://initiativesbank.ps/').replace(/\/?$/, '/');
const live = (a) => (a || []).filter((x) => (x.status || 'published') === 'published');

// 1) نسخ الملفات الثابتة
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const name of fs.readdirSync(ROOT)) {
  if (SKIP.has(name) || name.startsWith('.') && name !== '.nojekyll') continue;
  fs.cpSync(path.join(ROOT, name), path.join(OUT, name), { recursive: true });
}

// 2) توليد الصفحات
const SCRIPTS = ['data/site-data.js', 'assets/js/core.js', 'assets/js/pages.js'].map((f) => [f, read(f)]);
const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
const jobs = pages.map((f) => [f, f]);
live(DATA.initiatives).forEach((i) => jobs.push([`initiative-${i.id}.html`, 'initiative.html', i.id, i.date]));
live(DATA.posts).forEach((p) => jobs.push([`post-${p.id}.html`, 'post.html', p.id, p.date]));

const quiet = new VirtualConsole();
const errors = [];
quiet.on('jsdomError', (e) => errors.push(e.message));
quiet.on('error', (e) => errors.push(String(e)));

function render(outFile, shell, id) {
  let html = read(shell);
  const dom = new JSDOM(html, { url: BASE + (outFile === 'index.html' ? '' : outFile), runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: quiet });
  const { window } = dom; const { document } = window;
  const m = document.createElement('meta'); m.name = 'ib-built'; m.content = new Date().toISOString().slice(0, 10); document.head.appendChild(m);
  if (id != null) document.body.dataset.id = id;
  window.Element.prototype.scrollIntoView = () => {};
  window.scrollTo = () => {};
  for (const [f, code] of SCRIPTS) {
    try { window.eval(code); } catch (e) { errors.push(`${outFile} (${f}): ${e.message}`); }
  }
  // المحتوى ظاهر دون JavaScript (لمحركات البحث والقارئات)
  document.head.insertAdjacentHTML('beforeend', '<noscript><style>.reveal,.tl-item,.petal{opacity:1!important;transform:none!important}</style></noscript>');
  if (S.seo && S.seo.keywords && !document.querySelector('meta[name="keywords"]')) {
    const k = document.createElement('meta'); k.name = 'keywords'; k.content = S.seo.keywords; document.head.appendChild(k);
  }
  // إزالة ما تضيفه السكربتات وقت التشغيل فقط
  document.querySelectorAll('.preview-bar').forEach((x) => x.remove());
  // السكربتات في آخر الصفحة: حين تعمل يكون كل المحتوى المولّد قد قُرئ، فتستبدله دون تكرار
  document.querySelectorAll('body > script[src]').forEach((s) => document.body.appendChild(s));
  const out = '<!doctype html>\n' + document.documentElement.outerHTML;
  window.close();
  return out;
}

let n = 0;
for (const [outFile, shell, id] of jobs) {
  fs.writeFileSync(path.join(OUT, outFile), render(outFile, shell, id));
  n++;
}

// 3) خريطة الموقع و robots
const today = new Date().toISOString().slice(0, 10);
const main = ['index.html', 'initiatives.html', 'news.html', 'ideas.html', 'about.html', 'partners.html', 'support.html', 'contact.html', 'submit.html', 'privacy.html', 'terms.html'];
const urls = main.filter((f) => fs.existsSync(path.join(OUT, f))).map((f) => [f === 'index.html' ? '' : f, today, f === 'index.html' ? '1.0' : '0.8'])
  .concat(jobs.filter((j) => j[2] != null).map(([f, , , d]) => [f, (d || today).slice(0, 10), '0.7']));
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d, p]) => `  <url><loc>${BASE}${u}</loc><lastmod>${d}</lastmod><priority>${p}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);
if (S.seo && S.seo.cname) fs.writeFileSync(path.join(OUT, 'CNAME'), S.seo.cname + '\n');

console.log(`تم توليد ${n} صفحة في dist/ مع sitemap.xml (${urls.length} رابطًا)`);
if (errors.length) { console.error('تحذيرات:\n' + [...new Set(errors)].slice(0, 20).join('\n')); }

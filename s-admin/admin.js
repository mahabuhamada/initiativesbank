/* لوحة تحكم بنك المبادرات — على نظام لوحة تحكم المنتدى
 * - كل التعديلات تُحفظ مسودة في المتصفح، وتُعاين، ثم تُنشر إلى GitHub أو تُصدَّر كملف.
 * - طلبات «قدّم فكرتك» فيها بيانات شخصية: تبقى على هذا الجهاز ولا تُنشر مع بيانات الموقع.
 */
(function () {
  'use strict';
  const { esc, fmtDate } = IB;
  const SUBS_KEY = 'ib_admin_submissions', GH_KEY = 'ib_gh', LOG_KEY = 'ib_admin_log', THEME_KEY = 'ib-admin-theme';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const src = (p) => (!p ? '' : /^(https?:|data:|blob:)/.test(p) ? p : '../' + p);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const uid = () => Date.now() + Math.floor(Math.random() * 1000);
  const fmt = (n) => Number(n || 0).toLocaleString('en-US');

  /* ---------- الأيقونات ---------- */
  const I = {
    home: '<path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    spark: '<path d="M12 3l2.2 5.3L20 9l-4.4 3.8L17 19l-5-3-5 3 1.4-6.2L4 9l5.8-.7z"/>',
    news: '<path d="M4 5h13v14H5a1 1 0 0 1-1-1z"/><path d="M17 9h3v9a1 1 0 0 1-2 0V9M8 9h5M8 13h5M8 16h3"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>',
    hand: '<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 9a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-2.5-4a1.5 1.5 0 0 1 2.5-1.6L7 14"/>',
    quote: '<path d="M10 7H6a2 2 0 0 0-2 2v4h5v5H4M20 7h-4a2 2 0 0 0-2 2v4h5v5h-5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    chev: '<path d="m15 18-6-6 6-6"/>',
    up: '<path d="m18 15-6-6-6 6"/>', down: '<path d="m6 9 6 6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>', left: '<path d="m15 18-6-6 6-6"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/>',
    alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  };
  const svg = (n, s = '') => `<svg ${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || I.spark}</svg>`;

  /* ---------- الأقسام ---------- */
  const GROUPS = [
    { id: 'main', label: 'لوحة التحكم', c: 'var(--orange)', items: ['home'] },
    { id: 'content', label: 'المحتوى', c: 'var(--orange)', items: ['initiatives', 'posts', 'ideas'] },
    { id: 'structure', label: 'بنية الموقع', c: 'var(--teal)', items: ['projects', 'taxonomies', 'partners', 'stories', 'media'] },
    { id: 'site', label: 'إعدادات الموقع', c: 'var(--yellow)', items: ['homepage', 'general', 'forms'] },
    { id: 'requests', label: 'الطلبات', c: 'var(--blue)', items: ['submissions'] },
    { id: 'admin', label: 'الإدارة', c: 'var(--violet)', items: ['publish', 'log'] },
  ];
  const S = {
    home: { t: 'الرئيسية', i: 'home' },
    initiatives: { t: 'المبادرات', i: 'spark', d: 'مكتبة المبادرات: النصوص والصور والفرق والتصنيف.' },
    posts: { t: 'الإعلانات والأخبار', i: 'news', d: 'الدعوات المفتوحة وقصص المبادرات المنشورة في صفحة الإعلانات.' },
    ideas: { t: 'بنك الأفكار', i: 'bulb', d: 'أفكار ملهمة تظهر في صفحة «بنك الأفكار» العامة، بلا بيانات شخصية.' },
    projects: { t: 'المسارات والمشاريع', i: 'layers', d: 'الأطر التي نُفذت ضمنها المبادرات، مثل «الوصول للجميع» و«SDF Youth Hub».' },
    taxonomies: { t: 'التصنيفات', i: 'tag', d: 'المجالات والفئات المستهدفة والمحافظات التي تعتمد عليها فلاتر المكتبة.' },
    partners: { t: 'الشركاء', i: 'hand', d: 'شعارات الشركاء وروابطهم كما تظهر في الموقع.' },
    stories: { t: 'قصص الميدان', i: 'quote', d: 'شهادات «ماذا يقول المبادرون» في الصفحة الرئيسية.' },
    media: { t: 'الوسائط', i: 'image', d: 'كل الصور المستخدمة في الموقع في مكان واحد.' },
    homepage: { t: 'الصفحة الرئيسية للموقع', i: 'layout', d: 'الأرقام والقيم والصورة الرئيسية والمبادرات المميزة.' },
    general: { t: 'الإعدادات العامة', i: 'gear', d: 'الهوية، من نحن، التواصل، والصفحات القانونية.' },
    forms: { t: 'نموذج «قدّم فكرتك»', i: 'form', d: 'حقول النموذج، والموافقة المستنيرة، ورابط استقبال الطلبات.' },
    submissions: { t: 'طلبات المبادرات', i: 'inbox', d: 'ما يصل من نموذج «قدّم فكرتك»، مرتبًا حسب مرحلة الدراسة.' },
    publish: { t: 'النشر والنسخ الاحتياطي', i: 'send', d: 'انشر المسودة إلى الموقع، أو صدّرها واستوردها.' },
    log: { t: 'سجل التعديلات', i: 'clock', d: 'ما تغيّر في اللوحة على هذا الجهاز ومتى.' },
  };
  GROUPS.forEach((g) => g.items.forEach((k) => { S[k].g = g; S[k].c = g.c; }));

  const GOVS = ['شمال غزة', 'غزة', 'الوسطى', 'خان يونس', 'رفح', 'الضفة الغربية'];
  const ST = { published: ['منشورة', 'st-pub'], draft: ['مسودة', 'st-draft'], archived: ['مؤرشفة', 'st-closed'] };
  const SUB = { new: ['جديدة', 'var(--blue)'], review: ['قيد الدراسة', 'var(--yellow)'], accepted: ['مقبولة', 'var(--teal)'], rejected: ['معتذر عنها', 'var(--red)'] };
  const BLOCK = { section: ['قسم نصي', 'var(--blue)'], quote: ['اقتباس', 'var(--violet)'], info: ['بطاقات معلومات', 'var(--teal)'], gallery: ['معرض صور', 'var(--orange)'], team: ['فريق المبادرة', 'var(--yellow)'], closing: ['خاتمة', 'var(--ink-3)'] };
  const PALETTE = ['var(--orange)', 'var(--blue)', 'var(--teal)', 'var(--yellow)', 'var(--violet)', 'var(--red)'];

  /* ---------- الحالة ---------- */
  const PUB = IB.published();
  PUB.ideas = PUB.ideas || [];
  let D = IB.draft() || clone(PUB);
  D.ideas = D.ideas || []; D.site.forms = D.site.forms || { endpoint: '' }; delete D.submissions;
  let SUBS = loadSubs();
  let LOG = []; try { LOG = JSON.parse(IB.safeGet(LOG_KEY) || '[]'); } catch (e) { LOG = []; }

  function loadSubs() {
    let list = []; try { list = JSON.parse(IB.safeGet(SUBS_KEY) || '[]'); } catch (e) { list = []; }
    let inc = []; try { inc = JSON.parse(IB.safeGet('ib_submissions') || '[]'); } catch (e) { inc = []; }
    const ids = new Set(list.map((s) => s.id));
    inc.forEach((s) => { if (!ids.has(s.id)) list.unshift(s); });
    return list.map(normSub);
  }
  function txt(v) { return Array.isArray(v) ? v.map((x) => (x && typeof x === 'object' ? Object.values(x).filter(Boolean).join(' — ') : x)).join('\n') : v == null ? '' : typeof v === 'object' ? Object.values(v).filter(Boolean).join(' ') : String(v); }
  function normSub(s) {
    const d = s.data; if (!d) return s;
    if (s.problem == null) s.problem = txt(d.problem);
    if (s.goals == null) s.goals = txt(d.goals || [d.goal, txt(d.objectives)].filter(Boolean).join('\n'));
    if (s.activities == null) s.activities = txt(d.activities);
    if (s.domains == null) s.domains = [].concat(d.domain || []).map((x) => (x === 'أخرى' && d.domainOther ? d.domainOther : x));
    if (s.audiences == null) s.audiences = [].concat(d.audiences || d.ages || []);
    if (s.location == null) s.location = d.location || [d.gov, d.area].filter(Boolean).join('، ');
    if (s.members == null) s.members = d.team || [];
    return s;
  }
  const saveSubs = () => { IB.safeSet(SUBS_KEY, JSON.stringify(SUBS)); renderNav(current); };
  const strip = (o) => { const c = clone(o); delete c.generatedAt; delete c.submissions; c.ideas = c.ideas || []; return c; };
  const dirty = () => JSON.stringify(strip(D)) !== JSON.stringify(strip(PUB));
  let saveT;
  function save(msg) {
    clearTimeout(saveT);
    const s = $('#saved'); if (s) { s.classList.add('dirty'); s.lastElementChild.textContent = 'يحفظ…'; }
    saveT = setTimeout(() => {
      if (!IB.safeSet(IB.DRAFT_KEY, JSON.stringify(D))) toast('تعذّر حفظ المسودة: مساحة المتصفح ممتلئة. انشر أو صدّر البيانات.', null, true);
      const s2 = $('#saved'); if (s2) { s2.classList.remove('dirty'); s2.lastElementChild.textContent = 'حُفظت المسودة'; }
      syncBadge(); if (msg) toast(msg);
    }, 300);
  }
  function log(text) { LOG.unshift({ t: text, at: new Date().toISOString() }); LOG = LOG.slice(0, 200); IB.safeSet(LOG_KEY, JSON.stringify(LOG)); }
  function syncBadge() { const s = $('#sync'); if (!s) return; const d = dirty(); s.className = 'sync' + (d ? ' dirty' : ''); s.innerHTML = `<i></i><span>${d ? 'تغييرات غير منشورة' : 'متزامن مع الموقع'}</span>`; }

  let toastTimer;
  function toast(msg, undo, err) {
    const t = $('#toast');
    t.innerHTML = esc(msg) + (undo ? ' <button>تراجع</button>' : '');
    t.className = 'toast show' + (err ? ' err' : '');
    if (undo) t.querySelector('button').onclick = () => { undo(); t.classList.remove('show'); };
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3600);
  }

  /* ---------- ربط الحقول ---------- */
  const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const setPath = (o, p, v) => { const ks = p.split('.'); const last = ks.pop(); ks.reduce((a, k) => a[k], o)[last] = v; };
  function readVal(el) {
    const t = el.dataset.t;
    if (el.type === 'checkbox') return el.checked;
    if (t === 'num') return el.value === '' ? null : Number(el.value);
    if (t === 'lines') return el.value.split('\n').map((x) => x.trim()).filter(Boolean);
    if (t === 'tags') return el.value.split(/[,،]/).map((x) => x.trim()).filter(Boolean);
    return el.value;
  }
  const fmtVal = (v, t) => (t === 'lines' ? (v || []).join('\n') : t === 'tags' ? (v || []).join('، ') : v == null ? '' : v);
  function bind(root, base, after) {
    const h = (e) => { const el = e.target.closest('[data-p]'); if (!el || !root.contains(el)) return; setPath(base, el.dataset.p, readVal(el)); save(); if (after) after(el); };
    root.addEventListener('input', h); root.addEventListener('change', h);
  }
  const fld = (p, label, v, o = {}) => `<label class="f ${o.cls || ''}"><span>${label}</span><input class="in" data-p="${p}" ${o.t ? `data-t="${o.t}"` : ''} type="${o.type || 'text'}" value="${esc(fmtVal(v, o.t))}" ${o.ph ? `placeholder="${esc(o.ph)}"` : ''} ${o.list ? `list="${o.list}"` : ''} ${o.dir ? `dir="${o.dir}"` : ''}>${o.h ? `<span class="h">${o.h}</span>` : ''}</label>`;
  const area = (p, label, v, o = {}) => `<label class="f ${o.cls || ''}"><span>${label}${o.count ? ` <small data-count="${p}" data-max="${o.count}">${(v || '').length} / ${o.count}</small>` : ''}</span><textarea class="in ${o.code ? 'code' : ''}" data-p="${p}" ${o.t ? `data-t="${o.t}"` : ''} rows="${o.rows || 3}">${esc(fmtVal(v, o.t))}</textarea>${o.h ? `<span class="h">${o.h}</span>` : ''}</label>`;
  const sel = (p, label, v, opts, o = {}) => `<label class="f ${o.cls || ''}"><span>${label}</span><select class="in" data-p="${p}">${opts.map((x) => { const [val, t] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(val)}"${val === v ? ' selected' : ''}>${esc(t)}</option>`; }).join('')}</select></label>`;
  const sw = (p, on, label) => `<button type="button" class="switch" role="switch" aria-checked="${!!on}" aria-label="${esc(label)}" data-sw="${p}"></button>`;
  const imgPick = (p, label, v) => `<div class="f"><span>${label}</span><div class="trans">${v ? `<img src="${esc(src(v))}" alt="" style="inline-size:74px;block-size:52px;object-fit:cover;border-radius:7px">` : svg('image', 'width="22" height="22"')}<input class="in" data-p="${p}" dir="ltr" value="${esc(v || '')}" placeholder="assets/uploads/…" style="flex:1;min-inline-size:0"><button type="button" class="btn sm" data-upload="${p}">${svg('upload')}رفع</button><button type="button" class="btn sm" data-pick="${p}">المكتبة</button></div></div>`;
  const updCounts = (base) => $$('[data-count]').forEach((s) => { const v = getPath(base, s.dataset.count) || ''; const mx = +s.dataset.max; s.textContent = `${v.length} / ${mx}`; s.classList.toggle('over', v.length > mx); });

  /* ---------- رفع الصور ---------- */
  function gh() { try { return JSON.parse(IB.safeGet(GH_KEY) || sessionStorage.getItem(GH_KEY) || 'null'); } catch (e) { return null; } }
  function resize(file, max = 1600) {
    return new Promise((res, rej) => {
      const img = new Image(); const u = URL.createObjectURL(file);
      img.onload = () => { const k = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u); res(c.toDataURL('image/jpeg', 0.82)); };
      img.onerror = rej; img.src = u;
    });
  }
  async function uploadImage(file) {
    const dataUrl = await resize(file); const cfg = gh();
    if (!cfg || !cfg.token) { toast('حُفظت الصورة داخل المسودة. اربط GitHub من «النشر» لرفعها كملف.'); return dataUrl; }
    const name = file.name.replace(/\.[^.]+$/, '').replace(/[^\w؀-ۿ-]+/g, '-').slice(0, 40) || 'image';
    const path = `assets/uploads/dashboard/${new Date().toISOString().slice(0, 7)}/${Date.now().toString(36)}-${name}.jpg`;
    await ghPut(cfg, path, dataUrl.split(',')[1], 'رفع صورة من لوحة التحكم: ' + name);
    log('رفع صورة ' + name); return path;
  }
  const pickFile = (multi) => new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = !!multi; i.onchange = () => res([...i.files]); i.click(); });
  function wireImages(root, base, rerender) {
    root.addEventListener('click', async (e) => {
      const up = e.target.closest('[data-upload]'); const pk = e.target.closest('[data-pick]');
      if (up) { const [f] = await pickFile(); if (!f) return; try { setPath(base, up.dataset.upload, await uploadImage(f)); save('حُدّثت الصورة'); rerender(); } catch (err) { toast('فشل رفع الصورة: ' + err.message, null, true); } }
      if (pk) { const v = await mediaPicker(); if (v) { setPath(base, pk.dataset.pick, v); save('حُدّثت الصورة'); rerender(); } }
    });
  }
  function wireSwitches(root, base) {
    root.addEventListener('click', (e) => { const s = e.target.closest('[data-sw]'); if (!s) return; const on = s.getAttribute('aria-checked') !== 'true'; s.setAttribute('aria-checked', on); setPath(base, s.dataset.sw, on); save(on ? 'فُعّل الإعداد' : 'أُوقف الإعداد'); });
  }

  /* ---------- مكونات ---------- */
  function hero(key, actions = '', stats = []) {
    const s = S[key];
    return `<section class="hero" style="--gc:${s.c}"><div class="hero-top"><span class="tile">${svg(s.i)}</span><div><h1>${s.t}</h1><p>${s.d}</p></div><div class="actions">${actions}</div></div>
      ${stats.length ? `<div class="hstats">${stats.map(([v, l]) => `<div class="hstat"><strong>${v}</strong><span>${l}</span></div>`).join('')}</div>` : ''}</section>`;
  }
  const tally = (arr, f) => arr.reduce((m, x) => { [].concat(f(x) || []).forEach((k) => { if (k) m[k] = (m[k] || 0) + 1; }); return m; }, {});
  const sortKeys = (m) => Object.keys(m).sort((a, b) => m[b] - m[a]);
  function hbars(m, cls) {
    const ks = sortKeys(m); const max = Math.max(1, ...ks.map((k) => m[k]));
    return ks.length ? `<div class="hbars">${ks.map((k) => `<div class="hbar ${cls || ''}"><span title="${esc(k)}">${esc(k)}</span><span class="track"><i style="inline-size:${(m[k] / max) * 100}%"></i></span><b>${m[k]}</b></div>`).join('')}</div>` : '<div class="empty">لا توجد بيانات</div>';
  }
  const ISSUES = [
    ['nogov', 'بلا محافظة', (i) => !i.governorate],
    ['nocover', 'بلا صورة غلاف', (i) => !i.cover],
    ['nogallery', 'بلا معرض صور', (i) => !(i.gallery || []).length],
    ['noteam', 'بلا أعضاء فريق', (i) => !(i.team || []).length],
    ['nobenef', 'بلا عدد مستفيدين', (i) => !i.beneficiaries],
    ['shortsum', 'ملخص أقصر من 80 حرفًا', (i) => (i.summary || '').length < 80],
  ];
  function syncDerived(i) {
    const g = (i.blocks || []).find((b) => b.kind === 'gallery'); i.gallery = g ? g.images.slice() : [];
    const t = (i.blocks || []).find((b) => b.kind === 'team'); i.team = t ? clone(t.members) : [];
  }
  function ago(iso) {
    const s = (Date.now() - new Date(iso)) / 1000;
    if (s < 60) return 'الآن'; if (s < 3600) return `منذ ${Math.round(s / 60)} دقيقة`; if (s < 86400) return `منذ ${Math.round(s / 3600)} ساعة`;
    return new Date(iso).toLocaleDateString('ar-u-nu-latn', { day: 'numeric', month: 'short' });
  }

  /* ====================== الرئيسية ====================== */
  function vHome() {
    const I_ = D.initiatives, live = I_.filter((i) => i.status === 'published');
    const h = new Date().getHours();
    const today = new Date().toLocaleDateString('ar-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const newSubs = SUBS.filter((s) => s.status === 'new');
    const drafts = I_.filter((i) => i.status === 'draft');
    const noGal = I_.filter(ISSUES[2][2]);
    const todo = [];
    if (newSubs.length) todo.push(['var(--blue)', 'inbox', `${newSubs.length} طلب مبادرة جديد`, `آخرها «${newSubs[0].title}»`, '#submissions', 'افرز']);
    if (drafts.length) todo.push(['var(--orange)', 'edit', `${drafts.length} مبادرة مسودة`, `«${drafts[0].title || 'بلا عنوان'}» لم تُنشر بعد`, '#initiatives/draft', 'راجِع']);
    if (dirty()) todo.push(['var(--yellow)', 'send', 'تغييرات غير منشورة', 'المسودة تختلف عن الموقع المنشور', '#publish', 'انشر']);
    if (noGal.length) todo.push(['var(--teal)', 'image', `${noGal.length} مبادرات بلا معرض صور`, 'الصور تزيد ثقة الزوار والشركاء', '#initiatives/nogallery', 'أكمِل']);
    const nb = I_.filter(ISSUES[4][2]).length; if (nb) todo.push(['var(--violet)', 'users', `${nb} مبادرة بلا عدد مستفيدين`, 'رقم واحد لكل مبادرة يكفي لبناء مؤشر الأثر', '#initiatives/nobenef', 'أضِف']);

    const months = {}; const add = (d, k) => { const m = d.slice(0, 7); months[m] = months[m] || [0, 0]; months[m][k]++; };
    live.forEach((i) => add(i.date, 0)); D.posts.filter((p) => p.status === 'published').forEach((p) => add(p.date, 1));
    const keys = Object.keys(months).sort(); const series = [];
    if (keys.length) for (let d = new Date(keys[0] + '-15'); d <= new Date(keys[keys.length - 1] + '-15'); d.setMonth(d.getMonth() + 1)) { const k = d.toISOString().slice(0, 7); series.push([k, ...(months[k] || [0, 0])]); }
    const last = series.slice(-12);
    const max = Math.max(4, ...last.map((x) => Math.max(x[1], x[2]))); const step = Math.ceil(max / 4);
    const W = 640, H = 250, pT = 24, pB = 38, pL = 18, pR = 34, top = step * 4;
    const pw = W - pL - pR, ph = H - pT - pB, slot = pw / Math.max(1, last.length), bw = Math.min(18, slot / 3);
    const y = (v) => pT + ph - (v / top) * ph; const xs = (i) => W - pR - slot * (i + 0.5);
    const grid = [0, 1, 2, 3, 4].map((k) => `<line x1="${pL}" x2="${W - pR}" y1="${y(k * step)}" y2="${y(k * step)}" class="gl${k ? '' : ' base'}"/><text x="${W - pR + 8}" y="${y(k * step) + 4}" class="ax">${k * step}</text>`).join('');
    const bar = (v, x, c, i, lbl, m) => `<rect x="${x}" y="${v ? y(v) : y(0) - 2}" width="${bw}" height="${v ? y(0) - y(v) : 2}" rx="4" fill="${c}" style="animation-delay:${i * 50}ms"><title>${m}: ${v} ${lbl}</title></rect>${v ? `<text x="${x + bw / 2}" y="${y(v) - 6}" class="val" text-anchor="middle">${v}</text>` : ''}`;
    const mName = (k) => new Date(k + '-15').toLocaleDateString('ar-u-nu-latn', { month: 'short' });
    const bars = last.map(([k, a, b], i) => { const cx = xs(i); const m = IB.fmtMonth(k + '-15'); const lbl = (i === 0 || k.endsWith('-01')) ? `${mName(k)} ${k.slice(2, 4)}` : mName(k); return bar(a, cx + 2, 'var(--orange)', i, 'مبادرة', m) + bar(b, cx - bw - 2, 'var(--blue)', i, 'خبر', m) + (last.length > 8 && i % 2 && !k.endsWith('-01') ? '' : `<text x="${cx}" y="${H - 14}" class="ax mon" text-anchor="middle">${lbl}</text>`); }).join('');
    const tot = last.reduce((t, x) => [t[0] + x[1], t[1] + x[2]], [0, 0]);
    const projs = tally(live, (i) => i.project); const pk = sortKeys(projs); const ptot = pk.reduce((s, k) => s + projs[k], 0) || 1;
    const photos = I_.reduce((n, i) => n + (i.gallery || []).length, 0), team = I_.reduce((n, i) => n + (i.team || []).length, 0);
    const govs = new Set(live.map((i) => i.governorate).filter(Boolean));
    return `
    <header class="greet"><div><h1>${h < 12 ? 'صباح الخير' : 'مساء الخير'}</h1><p>${today} · ${todo.length ? `${todo.length} أمور تنتظرك` : 'لا شيء ينتظرك الآن'}</p></div>
      <div class="actions"><a class="btn" href="../index.html" target="_blank" rel="noopener">${svg('ext')}فتح الموقع</a><a class="btn primary" href="#initiative/new">${svg('plus')}مبادرة جديدة</a></div></header>
    <div class="dash">
      <section class="card"><div class="card-h"><h3>ابدأ من هنا</h3><span class="end"><span class="tag">${todo.length} مهام</span></span></div>
        ${todo.length ? `<ol class="todo">${todo.map(([c, i, t, s, href, a]) => `<li style="--c:${c}"><span class="dot">${svg(i)}</span><div><p>${esc(t)}</p><small>${esc(s)}</small></div><a class="btn sm" href="${href}">${a}</a></li>`).join('')}</ol>` : '<div class="empty">كل شيء مكتمل ومنشور ✓</div>'}</section>
      <section class="card"><div class="card-h"><h3>آخر التعديلات</h3><a class="end" href="#log">السجل الكامل</a></div>
        ${LOG.length ? `<ul class="recent">${LOG.slice(0, 5).map((l) => `<li><span class="avatar">ب</span><span>${esc(l.t)}</span><time>${ago(l.at)}</time></li>`).join('')}</ul>` : '<div class="empty">لم تُجرَ تعديلات على هذا الجهاز بعد.</div>'}</section>
    </div>
    <div class="kpis">${[
      ['spark', 'مبادرات منشورة', live.length, `في ${govs.size} محافظات`, 'var(--orange)', '#initiatives'],
      ['image', 'صور موثّقة', fmt(photos), 'في معارض المبادرات', 'var(--teal)', '#media'],
      ['users', 'مُبادرون موثّقون', fmt(team), 'أعضاء فرق المبادرات', 'var(--violet)', '#initiatives'],
      ['inbox', 'طلبات جديدة', newSubs.length, `${SUBS.length} طلب على هذا الجهاز`, 'var(--blue)', '#submissions'],
    ].map(([i, l, v, d, c, href]) => `<a class="kpi2" href="${href}" style="--c:${c}"><span class="ic">${svg(i)}</span><span class="lbl">${l}</span><strong>${v}</strong><span class="delta">${d}</span></a>`).join('')}</div>
    <div class="dash">
      <section class="card"><div class="card-h"><div><h3>المنشور شهريًا</h3><small class="muted">المبادرات والأخبار المنشورة حسب الشهر</small></div>
        <span class="end legend"><span><i style="background:var(--orange)"></i>مبادرات · ${tot[0]}</span><span><i style="background:var(--blue)"></i>أخبار · ${tot[1]}</span></span></div>
        <div class="card-b"><svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="المبادرات والأخبار المنشورة شهريًا">${grid}${bars}</svg></div></section>
      <section class="card"><div class="card-h"><div><h3>المبادرات حسب المسار</h3><small class="muted">${live.length} مبادرة منشورة</small></div></div>
        <div class="card-b"><div class="stackbar" role="img" aria-label="توزيع المبادرات على المسارات">${pk.map((k, i) => `<i style="flex:${projs[k]};background:${PALETTE[i % PALETTE.length]}" title="${esc(k)}: ${projs[k]}"></i>`).join('')}</div>
        <ul class="prog-list">${pk.map((k, i) => `<li><i style="background:${PALETTE[i % PALETTE.length]}"></i><span>${esc(k)}</span><b>${projs[k]}</b><small>${Math.round((projs[k] / ptot) * 100)}%</small></li>`).join('')}</ul></div></section>
    </div>
    <div class="grid g3">
      <section class="card"><div class="card-h"><h3>حسب المحافظة</h3></div><div class="card-b">${hbars(tally(live, (i) => i.governorate))}</div></section>
      <section class="card"><div class="card-h"><h3>حسب المجال</h3></div><div class="card-b">${hbars(tally(live, (i) => i.themes), 'b')}</div></section>
      <section class="card"><div class="card-h"><h3>حسب الفئة المستهدفة</h3></div><div class="card-b">${hbars(tally(live, (i) => i.audienceGroups))}</div></section>
    </div>`;
  }

  /* ====================== المبادرات ====================== */
  function vInitiatives(sub) {
    const issue = ISSUES.find((x) => x[0] === sub);
    const st = { tab: ST[sub] ? sub : '', q: '', gov: '', proj: '', sort: 'new' };
    const counts = { '': D.initiatives.length }; Object.keys(ST).forEach((k) => { counts[k] = D.initiatives.filter((i) => i.status === k).length; });
    const projects = [...new Set(D.initiatives.map((i) => i.project).filter(Boolean))];
    const html = hero('initiatives', `<a class="btn primary" href="#initiative/new">${svg('plus')}مبادرة جديدة</a>`,
      [[counts.published, 'منشورة'], [counts.draft, 'مسودات'], ...ISSUES.slice(2, 5).map(([, l, f]) => [D.initiatives.filter(f).length, l])]) + `
    ${issue ? `<div class="note warn">${svg('alert', 'width="16" height="16"')}<div>تعرض المبادرات <b>${issue[1]}</b> — <a href="#initiatives">عرض الكل</a></div></div>` : ''}
    <section class="card" style="--gc:var(--orange)">
      <div class="tabs" role="tablist">${[['', 'الكل'], ['published', 'منشورة'], ['draft', 'مسودات'], ['archived', 'مؤرشفة']].map(([k, l]) => `<button role="tab" data-tab="${k}" aria-selected="${k === st.tab}">${l}<span>${counts[k]}</span></button>`).join('')}</div>
      <div class="toolbar">
        <label class="field grow">${svg('search')}<span class="sr">بحث</span><input id="q" placeholder="ابحث بالعنوان أو المكان…"></label>
        <label class="field"><span class="sr">المحافظة</span><select id="fg"><option value="">كل المحافظات</option>${GOVS.map((g) => `<option>${g}</option>`).join('')}</select></label>
        <label class="field"><span class="sr">المسار</span><select id="fp"><option value="">كل المسارات</option>${projects.map((p) => `<option>${esc(p)}</option>`).join('')}</select></label>
        <label class="field"><span class="sr">الترتيب</span><select id="fs"><option value="new">الأحدث أولًا</option><option value="old">الأقدم أولًا</option><option value="az">الأبجدية</option><option value="score">الأقل اكتمالًا</option></select></label>
      </div>
      <div class="bulk" id="bulk"><b id="bulkN"></b><span style="opacity:.6">·</span><button class="btn sm" data-bulk="published">نشر</button><button class="btn sm" data-bulk="draft">تحويل لمسودة</button><button class="btn sm" data-bulk="archived">أرشفة</button><button class="btn sm" data-bulk="feature">تمييز</button><button class="btn sm" data-bulk="delete">حذف</button></div>
      <div style="overflow-x:auto"><table class="table"><thead><tr><th style="inline-size:36px"><input type="checkbox" id="all" aria-label="تحديد الكل"></th><th>المبادرة</th><th>المحافظة</th><th>المسار</th><th>الاكتمال</th><th>الحالة</th><th>التاريخ</th><th>مميزة</th><th></th></tr></thead><tbody id="rows"></tbody></table></div>
    </section>`;
    const after = () => {
      const score = (i) => Math.round((ISSUES.filter(([, , f]) => !f(i)).length / ISSUES.length) * 100);
      const bulkUpd = () => { const n = $$('[data-row]:checked').length; $('#bulk').classList.toggle('on', n > 0); $('#bulkN').textContent = `تحديد ${n}`; };
      const render = () => {
        const q = st.q.toLowerCase();
        const rows = D.initiatives.filter((i) => (!issue || issue[2](i)) && (!st.tab || i.status === st.tab) && (!q || (i.title + ' ' + i.location).toLowerCase().includes(q)) && (!st.gov || i.governorate === st.gov) && (!st.proj || i.project === st.proj))
          .sort({ new: (a, b) => b.date.localeCompare(a.date), old: (a, b) => a.date.localeCompare(b.date), az: (a, b) => a.title.localeCompare(b.title, 'ar'), score: (a, b) => score(a) - score(b) }[st.sort]);
        $('#rows').innerHTML = rows.map((i) => { const sc = score(i); return `<tr data-id="${i.id}">
          <td><input type="checkbox" data-row aria-label="تحديد"></td>
          <td><div class="it">${i.cover ? `<img class="thumb" src="${esc(src(i.cover))}" alt="" loading="lazy">` : `<span class="thumb">${svg('image', 'width="20" height="20"')}</span>`}<div><b><a href="#initiative/${i.id}">${esc(i.title || 'مبادرة بلا عنوان')}</a></b><small>${esc(i.location || '—')}</small><span style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">${(i.themes || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</span></div></div></td>
          <td>${esc(i.governorate || '—')}</td><td><span class="tag">${esc(i.project || '—')}</span></td>
          <td><span class="ring" style="--p:${sc};inline-size:40px;block-size:40px;font-size:10.5px" title="${sc}% مكتملة"><span style="inline-size:31px;block-size:31px">${sc}%</span></span></td>
          <td><span class="pill ${ST[i.status][1]}">${ST[i.status][0]}</span></td>
          <td class="muted" style="white-space:nowrap">${fmtDate(i.date)}</td>
          <td><button class="star ${i.featured ? 'on' : ''}" data-star aria-label="تمييز" aria-pressed="${!!i.featured}">★</button></td>
          <td><div class="row-act"><a class="icon-btn sm" href="#initiative/${i.id}" aria-label="تحرير">${svg('edit')}</a><button class="icon-btn sm" data-prev aria-label="معاينة">${svg('eye')}</button><button class="icon-btn sm" data-dup aria-label="نسخ">${svg('copy')}</button><button class="icon-btn sm danger" data-del aria-label="حذف">${svg('trash')}</button></div></td></tr>`; }).join('') || `<tr><td colspan="9" class="empty">لا توجد مبادرات مطابقة</td></tr>`;
        $('#all').checked = false; bulkUpd();
      };
      const byRow = (el) => D.initiatives.find((x) => String(x.id) === el.closest('tr').dataset.id);
      $('#q').oninput = (e) => { st.q = e.target.value; render(); };
      $('#fg').onchange = (e) => { st.gov = e.target.value; render(); };
      $('#fp').onchange = (e) => { st.proj = e.target.value; render(); };
      $('#fs').onchange = (e) => { st.sort = e.target.value; render(); };
      $$('[data-tab]').forEach((b) => { b.onclick = () => { st.tab = b.dataset.tab; $$('[data-tab]').forEach((x) => x.setAttribute('aria-selected', x === b)); render(); }; });
      $('#all').onchange = (e) => { $$('[data-row]').forEach((x) => { x.checked = e.target.checked; }); bulkUpd(); };
      $('#rows').addEventListener('change', (e) => { if (e.target.matches('[data-row]')) bulkUpd(); });
      $('#rows').addEventListener('click', (e) => {
        const t = e.target.closest('button'); if (!t) return; const i = byRow(t);
        if (t.matches('[data-star]')) { i.featured = !i.featured; save(i.featured ? 'مُيّزت المبادرة' : 'أُلغي التمييز'); log(`${i.featured ? 'ميّز' : 'ألغى تمييز'} «${i.title}»`); render(); }
        if (t.matches('[data-prev]')) preview('initiative.html?id=' + i.id);
        if (t.matches('[data-dup]')) { const c = clone(i); c.id = uid(); c.title += ' (نسخة)'; c.status = 'draft'; c.featured = false; D.initiatives.unshift(c); save(); log(`نسخ «${i.title}»`); location.hash = '#initiative/' + c.id; }
        if (t.matches('[data-del]')) { const k = D.initiatives.indexOf(i); D.initiatives.splice(k, 1); save(); log(`حذف «${i.title}»`); render(); toast('حُذفت المبادرة من المسودة', () => { D.initiatives.splice(k, 0, i); save(); render(); }); }
      });
      $('#bulk').onclick = (e) => {
        const b = e.target.closest('[data-bulk]'); if (!b) return;
        const ids = $$('[data-row]:checked').map((x) => x.closest('tr').dataset.id); const chosen = D.initiatives.filter((i) => ids.includes(String(i.id)));
        const before = clone(D.initiatives); const a = b.dataset.bulk;
        if (a === 'delete') D.initiatives = D.initiatives.filter((i) => !chosen.includes(i)); else if (a === 'feature') chosen.forEach((i) => { i.featured = true; }); else chosen.forEach((i) => { i.status = a; });
        save(); log(`إجراء جماعي (${b.textContent}) على ${chosen.length} مبادرة`); render();
        toast(`طُبّق «${b.textContent}» على ${chosen.length} مبادرة`, () => { D.initiatives = before; save(); render(); });
      };
      render();
    };
    return [html, after];
  }

  function newInitiative() {
    return {
      id: uid(), slug: '', title: '', summary: '', date: new Date().toISOString().slice(0, 10), status: 'draft', featured: false,
      location: '', governorate: '', audience: '', audienceGroups: [], type: '', themes: [], project: 'بنك المبادرات', beneficiaries: null, cover: '', gallery: [], team: [], sourceUrl: '',
      blocks: [
        { kind: 'section', icon: 'ℹ', title: 'ما هي؟', paragraphs: [] },
        { kind: 'section', icon: '❔', title: 'لماذا المُبادرة؟', paragraphs: [] },
        { kind: 'info', icon: '👥', title: 'الفئة المُستهدفة ومكان التنفيذ', cards: [{ label: 'الفئة المُستهدفة', lines: [] }, { label: 'مكان التنفيذ', lines: [] }] },
        { kind: 'section', icon: '🎯', title: 'أهداف المُبادرة', paragraphs: [], items: [] },
        { kind: 'section', icon: '🎲', title: 'أنشطة تفاعليّة.. أجواء مُميّزة', paragraphs: [] },
        { kind: 'section', icon: '📚', title: 'السياق والتفاصيل', paragraphs: [] },
        { kind: 'gallery', icon: '🖼', title: 'صور من المُبادرة', images: [] },
        { kind: 'team', icon: '🧑‍🤝‍🧑', title: 'فريق المُبادرة', paragraphs: [], members: [] },
      ],
    };
  }
  const BLOCK_TPL = { section: { kind: 'section', icon: '•', title: 'عنوان القسم', paragraphs: [] }, quote: { kind: 'quote', text: '', author: '' }, info: { kind: 'info', icon: '👥', title: 'معلومات', cards: [{ label: '', lines: [] }] }, gallery: { kind: 'gallery', icon: '🖼', title: 'صور من المُبادرة', images: [] }, team: { kind: 'team', icon: '🧑‍🤝‍🧑', title: 'فريق المُبادرة', paragraphs: [], members: [] }, closing: { kind: 'closing', paragraphs: [] } };

  function blockEd(b, k, n, folded) {
    const p = `blocks.${k}`; const [label, c] = BLOCK[b.kind];
    const head = `<div class="blk-h" style="--gc:${c}"><span class="e">${esc(b.icon || (b.kind === 'quote' ? '❝' : '¶'))}</span><span class="k">${label}</span><span class="t">${esc(b.title || (b.text || (b.paragraphs || [])[0] || '').slice(0, 70))}</span>
      <button type="button" class="icon-btn sm" data-bup="${k}" ${k ? '' : 'disabled'} aria-label="تحريك لأعلى">${svg('up')}</button><button type="button" class="icon-btn sm" data-bdown="${k}" ${k === n - 1 ? 'disabled' : ''} aria-label="تحريك لأسفل">${svg('down')}</button>
      <button type="button" class="icon-btn sm" data-bfold="${k}" aria-label="طي">${svg(folded ? 'left' : 'down')}</button><button type="button" class="icon-btn sm danger" data-bdel="${k}" aria-label="حذف">${svg('trash')}</button></div>`;
    const tRow = `<div class="title-row">${fld(p + '.icon', 'أيقونة', b.icon)}${fld(p + '.title', 'العنوان', b.title)}</div>`;
    let body = '';
    if (b.kind === 'section') body = `${tRow}${area(p + '.paragraphs', 'الفقرات <small>كل سطر فقرة · السطر القصير بلا نقطة يظهر عنوانًا فرعيًا</small>', b.paragraphs, { t: 'lines', rows: 5 })}${area(p + '.items', 'قائمة نقاط <small>كل سطر نقطة · اختيارية</small>', b.items, { t: 'lines', rows: 3 })}`;
    if (b.kind === 'quote') body = `${area(p + '.text', 'نص الاقتباس', b.text)}${fld(p + '.author', 'القائل/ة', b.author, { ph: 'الاسم، الصفة' })}`;
    if (b.kind === 'closing') body = area(p + '.paragraphs', 'الفقرات (كل سطر فقرة)', b.paragraphs, { t: 'lines' });
    if (b.kind === 'info') body = `${tRow}<div class="sub-list">${(b.cards || []).map((cd, j) => `<div class="sub-item">${fld(`${p}.cards.${j}.label`, 'عنوان البطاقة', cd.label)}${area(`${p}.cards.${j}.lines`, 'الأسطر', cd.lines, { t: 'lines', rows: 2 })}<button type="button" class="icon-btn sm danger" data-rm="${p}.cards.${j}" aria-label="حذف">${svg('trash')}</button></div>`).join('')}</div><button type="button" class="btn sm" style="justify-self:start" data-add="${p}.cards" data-tpl='{"label":"","lines":[]}'>${svg('plus')}بطاقة</button>`;
    if (b.kind === 'gallery') body = `${tRow}<div class="gal">${(b.images || []).map((im, j) => `<figure><img src="${esc(src(im))}" alt="" loading="lazy">${j ? '' : '<span class="pill st-new first" style="background:var(--card)">الأولى</span>'}<div class="tools-ov"><span style="display:flex;gap:4px"><button type="button" data-mv="${p}.images.${j}" data-d="-1" aria-label="تقديم">${svg('right')}</button><button type="button" data-mv="${p}.images.${j}" data-d="1" aria-label="تأخير">${svg('left')}</button></span><button type="button" data-rm="${p}.images.${j}" aria-label="إزالة">${svg('trash')}</button></div></figure>`).join('')}
      <button type="button" class="drop" style="aspect-ratio:4/3" data-gup="${p}.images">${svg('upload', 'width="22" height="22"')}<small>رفع صور</small></button></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="btn sm" data-gpick="${p}.images">${svg('image')}من المكتبة</button><button type="button" class="btn sm" data-gurl="${p}.images">${svg('plus')}رابط صورة</button></div>`;
    if (b.kind === 'team') body = `${tRow}${area(p + '.paragraphs', 'مقدمة <small>اختيارية</small>', b.paragraphs, { t: 'lines', rows: 2 })}<div class="sub-list">${(b.members || []).map((m, j) => `<div class="sub-item person">${m.photo ? `<img src="${esc(src(m.photo))}" alt="">` : `<span class="ph">${svg('users')}</span>`}${fld(`${p}.members.${j}.name`, 'الاسم', m.name)}${fld(`${p}.members.${j}.role`, 'الدور', m.role, { ph: 'منسق/ة، متطوع/ة…' })}<span style="display:flex;gap:4px"><button type="button" class="icon-btn sm" data-upload="${p}.members.${j}.photo" aria-label="صورة">${svg('image')}</button><button type="button" class="icon-btn sm danger" data-rm="${p}.members.${j}" aria-label="حذف">${svg('trash')}</button></span></div>`).join('')}</div><button type="button" class="btn sm" style="justify-self:start" data-add="${p}.members" data-tpl='{"name":"","role":"","photo":""}'>${svg('plus')}عضو</button>`;
    return `<div class="blk${folded ? ' collapsed' : ''}" data-k="${k}">${head}<div class="blk-b form">${body}</div></div>`;
  }

  function vInitiativeEdit(id) {
    let i = id === 'new' ? null : D.initiatives.find((x) => String(x.id) === id);
    if (!i) { if (id !== 'new') return [notFound()]; i = newInitiative(); D.initiatives.unshift(i); save(); log('أنشأ مبادرة جديدة'); history.replaceState(null, '', '#initiative/' + i.id); }
    const projects = [...new Set(D.initiatives.map((x) => x.project).filter(Boolean))];
    const themes = [...new Set(D.initiatives.flatMap((x) => x.themes || []))];
    const groups = [...new Set(D.initiatives.flatMap((x) => x.audienceGroups || []))];
    const folded = new Set();
    const checks = () => {
      syncDerived(i);
      const c = [
        [i.title.length >= 15 && i.title.length <= 90, 'عنوان واضح', 'بين 15 و90 حرفًا'],
        [i.summary.length >= 80 && i.summary.length <= 240, 'ملخص مناسب', i.summary.length > 240 ? 'أطول من 240 حرفًا — اختصره' : 'بين 80 و240 حرفًا'],
        [!!i.cover, 'صورة غلاف', 'تظهر في البطاقات وعند المشاركة'],
        [!!i.governorate && !!i.location, 'المكان والمحافظة', 'تعتمد عليهما فلاتر المكتبة'],
        [(i.themes || []).length > 0, 'مجال واحد على الأقل', 'لتصنيف المبادرة'],
        [i.gallery.length >= 3, 'معرض صور', `${i.gallery.length} صور — يُفضّل 3 أو أكثر`, 'warn'],
        [i.team.length > 0, 'فريق المبادرة', 'أسماء المُبادرين وأدوارهم', 'warn'],
        [!!i.beneficiaries, 'عدد المستفيدين', 'لبناء مؤشر الأثر', 'warn'],
      ];
      $('#check').innerHTML = c.map(([ok, t, s, w]) => `<li class="${ok ? 'ok' : w ? 'warn' : ''}"><i>${ok ? '✓' : w ? '!' : '·'}</i><div>${t}<small>${s}</small></div></li>`).join('');
      const p = Math.round((c.filter((x) => x[0]).length / c.length) * 100); $('#ring').style.setProperty('--p', p); $('#ringN').textContent = p + '%';
      $('#serpT').textContent = (i.title || 'بلا عنوان').slice(0, 60) + ' | بنك المبادرات'; $('#serpD').textContent = i.summary.slice(0, 155) + (i.summary.length > 155 ? '…' : '');
      updCounts(i);
    };
    const html = () => `
      <datalist id="dlp">${projects.map((x) => `<option value="${esc(x)}">`).join('')}</datalist>
      <div class="ed-bar" style="--gc:var(--orange)"><a class="btn ghost" href="#initiatives">→ المبادرات</a><span class="ed-type">${svg('spark')}مبادرة</span>
        <span class="pill ${ST[i.status][1]}">${ST[i.status][0]}</span><span class="saved" id="saved"><i></i><span>محفوظة</span></span>
        <div class="actions"><button class="btn" id="pv">${svg('eye')}معاينة</button>${i.status === 'published' ? `<button class="btn" data-status="draft">إخفاء من الموقع</button>` : `<button class="btn primary" data-status="published">${svg('check')}جاهزة للنشر</button>`}</div></div>
      <div class="flow" aria-label="مراحل المبادرة">${['مسودة', 'جاهزة', 'منشورة على الموقع'].map((l, k) => { const pubNow = PUB.initiatives.some((x) => x.id === i.id && x.status === 'published' && JSON.stringify(x) === JSON.stringify(i)); const at = i.status === 'published' ? (pubNow ? 2 : 1) : 0; return `${k ? '<i>←</i>' : ''}<span class="${k < at ? 'done' : k === at ? 'now' : ''}">${k < at ? '✓ ' : ''}${l}</span>`; }).join('')}</div>
      <div class="grid g-main">
        <div class="stack">
          <div><textarea class="title-in" data-p="title" rows="1" aria-label="عنوان المبادرة" placeholder="عنوان المبادرة">${esc(i.title)}</textarea>
            <div class="slug">${svg('globe', 'width="14" height="14"')}<span>initiative.html?id=</span><code>${i.id}</code>${i.sourceUrl ? `<a href="${esc(i.sourceUrl)}" target="_blank" rel="noopener" class="muted">· المصدر الأصلي ↗</a>` : ''}</div>
            <div class="cover">${i.cover ? `<img src="${esc(src(i.cover))}" alt="">` : `<div class="ph">${svg('image', 'width="28" height="28"')} أضف صورة غلاف</div>`}<div class="over"><button class="btn sm" data-upload="cover">${svg('upload')}رفع</button><button class="btn sm" data-pick="cover">${svg('image')}${i.cover ? 'تغيير' : 'اختيار'}</button></div></div></div>
          <section class="card card-b panel"><h4>تفاصيل المبادرة</h4><div class="form cols">
            ${area('summary', 'الملخص', i.summary, { cls: 'full', count: 240, h: 'يظهر في بطاقة المبادرة وأعلى صفحتها وفي Google' })}
            ${fld('location', 'مكان التنفيذ (مختصر)', i.location, { ph: 'مخيم…، المحافظة' })}
            ${sel('governorate', 'المحافظة', i.governorate, [['', '— اختر —'], ...GOVS])}
            ${fld('audience', 'الفئة المستهدفة', i.audience)}
            ${fld('type', 'نوع المبادرة', i.type, { ph: 'شبابية توعوية مجتمعية' })}
            ${fld('beneficiaries', 'عدد المستفيدين', i.beneficiaries, { t: 'num', type: 'number' })}
            ${fld('project', 'المسار / المشروع', i.project, { list: 'dlp' })}
          </div></section>
          <section class="card"><div class="card-h"><div><h3>محتوى الصفحة</h3><small class="muted">${i.blocks.length} كتلة تُعرض بالترتيب في صفحة المبادرة</small></div>
            <span class="end"><select class="in" id="addKind" style="inline-size:auto;padding:6px 10px" aria-label="نوع الكتلة">${Object.entries(BLOCK).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select><button type="button" class="btn sm primary" id="addBlock">${svg('plus')}كتلة</button></span></div>
            <div class="card-b blocks">${i.blocks.map((b, k, a) => blockEd(b, k, a.length, folded.has(k))).join('')}</div></section>
        </div>
        <aside class="stack">
          <section class="card card-b panel"><h4>جاهزية النشر <small><span class="ring" id="ring"><span id="ringN">0%</span></span></small></h4><ul class="check" id="check"></ul></section>
          <section class="card card-b panel"><h4>النشر</h4><div class="form">
            ${fld('date', 'تاريخ النشر', i.date, { type: 'date' })}
            <div class="trans"><div style="flex:1"><b style="font-weight:500">مبادرة مميزة</b><br><small class="muted">تظهر أولًا في الصفحة الرئيسية</small></div>${sw('featured', i.featured, 'مبادرة مميزة')}</div>
          </div></section>
          <section class="card card-b panel"><h4>التصنيف</h4><div class="form">
            ${fld('themes', 'المجالات <small>افصل بفاصلة</small>', i.themes, { t: 'tags' })}<div class="chips">${themes.filter((t) => !(i.themes || []).includes(t)).map((t) => `<button type="button" class="chip" data-addtag="themes" data-v="${esc(t)}">+ ${esc(t)}</button>`).join('')}</div>
            ${fld('audienceGroups', 'الفئات <small>افصل بفاصلة</small>', i.audienceGroups, { t: 'tags' })}<div class="chips">${groups.filter((t) => !(i.audienceGroups || []).includes(t)).map((t) => `<button type="button" class="chip" data-addtag="audienceGroups" data-v="${esc(t)}">+ ${esc(t)}</button>`).join('')}</div>
          </div></section>
          <section class="card card-b panel"><h4>كيف تظهر في Google</h4><div class="serp"><span>initiativesbank.ps › initiatives</span><b id="serpT"></b><p id="serpD"></p></div></section>
          <button class="btn danger" id="del">${svg('trash')}حذف المبادرة</button>
        </aside>
      </div>`;
    const after = () => {
      const page = $('#page');
      const rer = () => { const y = scrollY; page.innerHTML = `<div class="view">${html()}</div>`; checks(); scrollTo(0, y); };
      bind(page, i, (el) => { if (el.dataset.p === 'title') $('#crumbT').textContent = i.title || 'مبادرة جديدة'; checks(); });
      wireImages(page, i, rer); wireSwitches(page, i);
      page.addEventListener('click', async (e) => {
        const t = e.target.closest('button'); if (!t || t.matches('[data-upload],[data-pick],[data-sw]')) return; const d = t.dataset; const B = i.blocks;
        if (t.id === 'pv') { syncDerived(i); return preview('initiative.html?id=' + i.id); }
        if (d.status) { i.status = d.status; save(d.status === 'published' ? 'عُلّمت جاهزة — انشرها من «النشر»' : 'أُخفيت من الموقع'); log(`${d.status === 'published' ? 'جهّز للنشر' : 'أخفى'} «${i.title}»`); return rer(); }
        if (t.id === 'del') { const k = D.initiatives.indexOf(i); D.initiatives.splice(k, 1); save(); log(`حذف «${i.title}»`); location.hash = '#initiatives'; return toast('حُذفت المبادرة', () => { D.initiatives.splice(k, 0, i); save(); location.hash = '#initiative/' + i.id; }); }
        if (d.addtag) { i[d.addtag] = [...(i[d.addtag] || []), d.v]; save(); return rer(); }
        if (t.id === 'addBlock') { B.push(clone(BLOCK_TPL[$('#addKind').value])); toast('أُضيفت كتلة في آخر الصفحة'); }
        else if (d.bup) { const k = +d.bup; [B[k - 1], B[k]] = [B[k], B[k - 1]]; }
        else if (d.bdown) { const k = +d.bdown; [B[k + 1], B[k]] = [B[k], B[k + 1]]; }
        else if (d.bfold) { const k = +d.bfold; folded.has(k) ? folded.delete(k) : folded.add(k); t.closest('.blk').classList.toggle('collapsed'); return; }
        else if (d.bdel) { const k = +d.bdel; const [old] = B.splice(k, 1); save(); rer(); return toast('حُذفت الكتلة', () => { B.splice(k, 0, old); save(); rer(); }); }
        else if (d.rm) { const ks = d.rm.split('.'); const j = +ks.pop(); getPath(i, ks.join('.')).splice(j, 1); }
        else if (d.mv) { const ks = d.mv.split('.'); const j = +ks.pop(); const a = getPath(i, ks.join('.')); const to = j + +d.d; if (to < 0 || to >= a.length) return; [a[j], a[to]] = [a[to], a[j]]; }
        else if (d.add) getPath(i, d.add).push(JSON.parse(d.tpl));
        else if (d.gup) { const fs = await pickFile(true); if (!fs.length) return; toast('جارٍ رفع الصور…'); try { for (const f of fs) getPath(i, d.gup).push(await uploadImage(f)); } catch (err) { toast('فشل الرفع: ' + err.message, null, true); } }
        else if (d.gpick) { const v = await mediaPicker(); if (!v) return; getPath(i, d.gpick).push(v); }
        else if (d.gurl) { const v = prompt('رابط الصورة أو مسارها داخل الموقع:'); if (!v) return; getPath(i, d.gurl).push(v.trim()); }
        else return;
        save(); rer();
      });
      checks();
    };
    return [html(), after, i.title || 'مبادرة جديدة'];
  }

  /* ====================== الأخبار ====================== */
  function vPosts() {
    const st = { tab: '', q: '' };
    const html = hero('posts', `<a class="btn primary" href="#post/new">${svg('plus')}خبر جديد</a>`, [[D.posts.filter((p) => p.kind === 'call').length, 'دعوة مفتوحة'], [D.posts.filter((p) => p.kind !== 'call').length, 'قصة مبادرة'], [D.posts.filter((p) => p.status !== 'published').length, 'مسودة']]) + `
    <section class="card" style="--gc:var(--orange)">
      <div class="tabs">${[['', 'الكل', D.posts.length], ['call', 'دعوات مفتوحة', D.posts.filter((p) => p.kind === 'call').length], ['story', 'قصص المبادرات', D.posts.filter((p) => p.kind !== 'call').length]].map(([k, l, n]) => `<button data-tab="${k}" aria-selected="${!k}">${l}<span>${n}</span></button>`).join('')}</div>
      <div class="toolbar"><label class="field grow">${svg('search')}<span class="sr">بحث</span><input id="q" placeholder="ابحث في العناوين…"></label></div>
      <div style="overflow-x:auto"><table class="table"><thead><tr><th>الخبر</th><th>النوع</th><th>الحالة</th><th>التاريخ</th><th></th></tr></thead><tbody id="rows"></tbody></table></div></section>`;
    const after = () => {
      const render = () => {
        $('#rows').innerHTML = D.posts.filter((p) => (!st.tab || (st.tab === 'call' ? p.kind === 'call' : p.kind !== 'call')) && (!st.q || p.title.includes(st.q))).sort((a, b) => b.date.localeCompare(a.date)).map((p) => `<tr data-id="${p.id}">
          <td><div class="it">${p.cover ? `<img class="thumb" src="${esc(src(p.cover))}" alt="" loading="lazy">` : `<span class="thumb">${svg('news', 'width="20" height="20"')}</span>`}<div><b><a href="#post/${p.id}">${esc(p.title || 'خبر بلا عنوان')}</a></b><small>${esc((p.excerpt || '').slice(0, 90))}…</small></div></div></td>
          <td><span class="pill ${p.kind === 'call' ? 'st-review' : 'st-new'}">${p.kind === 'call' ? 'دعوة مفتوحة' : 'قصة مبادرة'}</span></td><td><span class="pill ${ST[p.status][1]}">${ST[p.status][0]}</span></td>
          <td class="muted" style="white-space:nowrap">${fmtDate(p.date)}</td>
          <td><div class="row-act"><a class="icon-btn sm" href="#post/${p.id}" aria-label="تحرير">${svg('edit')}</a><button class="icon-btn sm" data-prev aria-label="معاينة">${svg('eye')}</button><button class="icon-btn sm danger" data-del aria-label="حذف">${svg('trash')}</button></div></td></tr>`).join('') || '<tr><td colspan="5" class="empty">لا توجد أخبار</td></tr>';
      };
      $$('[data-tab]').forEach((b) => { b.onclick = () => { st.tab = b.dataset.tab; $$('[data-tab]').forEach((x) => x.setAttribute('aria-selected', x === b)); render(); }; });
      $('#q').oninput = (e) => { st.q = e.target.value; render(); };
      $('#rows').onclick = (e) => {
        const t = e.target.closest('button'); if (!t) return; const p = D.posts.find((x) => String(x.id) === t.closest('tr').dataset.id);
        if (t.matches('[data-prev]')) preview('post.html?id=' + p.id);
        if (t.matches('[data-del]')) { const k = D.posts.indexOf(p); D.posts.splice(k, 1); save(); log(`حذف خبر «${p.title}»`); render(); toast('حُذف الخبر', () => { D.posts.splice(k, 0, p); save(); render(); }); }
      };
      render();
    };
    return [html, after];
  }

  function vPostEdit(id) {
    let p = id === 'new' ? null : D.posts.find((x) => String(x.id) === id);
    if (!p) { if (id !== 'new') return [notFound()]; p = { id: uid(), title: '', date: new Date().toISOString().slice(0, 10), category: 'إعلانات', kind: 'story', status: 'draft', cover: '', excerpt: '', content: '<p></p>', sourceUrl: '' }; D.posts.unshift(p); save(); log('أنشأ خبرًا جديدًا'); history.replaceState(null, '', '#post/' + p.id); }
    const html = () => `
      <div class="ed-bar" style="--gc:var(--orange)"><a class="btn ghost" href="#posts">→ الإعلانات والأخبار</a><span class="ed-type">${svg('news')}${p.kind === 'call' ? 'دعوة مفتوحة' : 'قصة مبادرة'}</span>
        <span class="pill ${ST[p.status][1]}">${ST[p.status][0]}</span><span class="saved" id="saved"><i></i><span>محفوظ</span></span>
        <div class="actions"><button class="btn" id="pv">${svg('eye')}معاينة</button>${p.status === 'published' ? '<button class="btn" data-status="draft">إخفاء من الموقع</button>' : `<button class="btn primary" data-status="published">${svg('check')}جاهز للنشر</button>`}</div></div>
      <div class="grid g-main"><div class="stack">
        <div><textarea class="title-in" data-p="title" rows="1" placeholder="العنوان" aria-label="العنوان">${esc(p.title)}</textarea>
          <div class="cover" style="margin-top:10px">${p.cover ? `<img src="${esc(src(p.cover))}" alt="">` : `<div class="ph">${svg('image', 'width="28" height="28"')} أضف صورة غلاف</div>`}<div class="over"><button class="btn sm" data-upload="cover">${svg('upload')}رفع</button><button class="btn sm" data-pick="cover">${svg('image')}المكتبة</button></div></div></div>
        ${area('excerpt', 'المقتطف', p.excerpt, { count: 300 })}
        <div class="grid g2"><div class="f"><span>النص <small>HTML بسيط</small></span><div><div class="ed-tools">${[['h3', 'عنوان'], ['p', 'فقرة'], ['strong', '<b>B</b>'], ['blockquote', '❝ اقتباس'], ['ul', '• قائمة'], ['img', 'صورة']].map(([t, l]) => `<button type="button" data-wrap="${t}">${l}</button>`).join('')}</div><textarea class="in code" data-p="content" rows="18" aria-label="النص">${esc(p.content)}</textarea></div></div>
          <div class="f"><span>معاينة</span><div class="pv" id="pvb"></div></div></div>
      </div><aside class="stack">
        <section class="card card-b panel"><h4>النشر</h4><div class="form">${fld('date', 'التاريخ', p.date, { type: 'date' })}<div class="f"><span>النوع</span><div class="seg">${[['story', 'قصة مبادرة'], ['call', 'دعوة / إعلان']].map(([k, l]) => `<button type="button" data-k="${k}" aria-pressed="${p.kind === k}">${l}</button>`).join('')}</div></div>${fld('category', 'التصنيف', p.category)}</div></section>
        <section class="card card-b panel"><h4>كيف تظهر في Google</h4><div class="serp"><span>initiativesbank.ps › news</span><b id="serpT"></b><p id="serpD"></p></div></section>
        <button class="btn danger" id="del">${svg('trash')}حذف الخبر</button>
      </aside></div>`;
    const after = () => {
      const page = $('#page');
      const upd = () => { $('#pvb').innerHTML = p.content.replace(/src="(?!https?:|data:)([^"]+)"/g, 'src="../$1"'); $('#serpT').textContent = (p.title || 'بلا عنوان').slice(0, 60); $('#serpD').textContent = (p.excerpt || '').slice(0, 155); updCounts(p); };
      const rer = () => { page.innerHTML = `<div class="view">${html()}</div>`; upd(); };
      bind(page, p, (el) => { if (el.dataset.p === 'title') $('#crumbT').textContent = p.title || 'خبر جديد'; upd(); });
      wireImages(page, p, rer);
      page.addEventListener('click', async (e) => {
        const t = e.target.closest('button'); if (!t) return;
        if (t.id === 'pv') return preview('post.html?id=' + p.id);
        if (t.dataset.status) { p.status = t.dataset.status; save(p.status === 'published' ? 'عُلّم جاهزًا — انشره من «النشر»' : 'أُخفي من الموقع'); log(`غيّر حالة خبر «${p.title}»`); return rer(); }
        if (t.dataset.k) { p.kind = t.dataset.k; save(); return rer(); }
        if (t.id === 'del') { const k = D.posts.indexOf(p); D.posts.splice(k, 1); save(); location.hash = '#posts'; return toast('حُذف الخبر', () => { D.posts.splice(k, 0, p); save(); location.hash = '#post/' + p.id; }); }
        if (t.dataset.wrap) {
          const ta = $('[data-p="content"]'); const [s0, s1] = [ta.selectionStart, ta.selectionEnd]; const s = ta.value.slice(s0, s1) || 'نص'; const w = t.dataset.wrap; let ins;
          if (w === 'img') { const v = await mediaPicker(); if (!v) return; ins = `<figure><img src="${v}" alt=""></figure>`; }
          else if (w === 'ul') ins = `<ul>\n${s.split('\n').map((l) => `<li>${l}</li>`).join('\n')}\n</ul>`;
          else if (w === 'blockquote') ins = `<blockquote><p>${s}</p><p><em>القائل</em></p></blockquote>`;
          else ins = `<${w}>${s}</${w}>`;
          ta.setRangeText(ins, s0, s1, 'end'); ta.dispatchEvent(new Event('input', { bubbles: true })); ta.focus();
        }
      });
      upd();
    };
    return [html(), after, p.title || 'خبر جديد'];
  }

  /* ====================== بنك الأفكار ====================== */
  function vIdeas() {
    const html = () => hero('ideas', `<button class="btn primary" id="add">${svg('plus')}فكرة جديدة</button>`, [[D.ideas.filter((x) => x.status === 'published').length, 'منشورة'], [D.ideas.filter((x) => x.status !== 'published').length, 'مسودة']]) +
      (D.ideas.length ? `<div class="grid g2">${D.ideas.map((x, k) => `<section class="card card-b panel"><h4>${svg('bulb', 'width="16" height="16"')}${esc(x.title || 'فكرة بلا عنوان')} <small><span class="pill ${(ST[x.status] || ST.draft)[1]}">${(ST[x.status] || ST.draft)[0]}</span></small></h4><div class="form">
        ${fld(`${k}.title`, 'عنوان الفكرة', x.title)}${area(`${k}.summary`, 'وصف مختصر', x.summary)}<div class="form cols">${fld(`${k}.domains`, 'المجالات', x.domains, { t: 'tags' })}${fld(`${k}.location`, 'المنطقة', x.location)}</div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><div class="seg">${[['draft', 'مسودة'], ['published', 'منشورة']].map(([s, l]) => `<button type="button" data-st="${k}" data-v="${s}" aria-pressed="${x.status === s}">${l}</button>`).join('')}</div>${x.fromSubmission ? `<span class="tag">من الطلب ${esc(x.fromSubmission)}</span>` : ''}<button class="btn sm danger" style="margin-inline-start:auto" data-rm="${k}">${svg('trash')}حذف</button></div></div></section>`).join('')}</div>`
        : `<section class="card empty">${svg('bulb', 'width="34" height="34"')}<h3>لا توجد أفكار بعد</h3><p>أضف فكرة، أو حوّل طلبًا من «طلبات المبادرات» إلى فكرة بلا بيانات شخصية.</p></section>`);
    const after = () => {
      const page = $('#page'); const rer = () => { page.innerHTML = `<div class="view">${html()}</div>`; };
      bind(page, D.ideas);
      page.addEventListener('click', (e) => {
        const t = e.target.closest('button'); if (!t) return;
        if (t.id === 'add') { D.ideas.unshift({ id: uid(), title: '', summary: '', domains: [], location: '', status: 'draft' }); save(); log('أضاف فكرة'); rer(); }
        if (t.dataset.st) { D.ideas[+t.dataset.st].status = t.dataset.v; save(); rer(); }
        if (t.dataset.rm) { const k = +t.dataset.rm; const [old] = D.ideas.splice(k, 1); save(); rer(); toast('حُذفت الفكرة', () => { D.ideas.splice(k, 0, old); save(); rer(); }); }
      });
    };
    return [html(), after];
  }

  /* ====================== المسارات ====================== */
  function vProjects() {
    const m = tally(D.initiatives, (i) => i.project); const ks = sortKeys(m);
    const html = hero('projects', '', [[ks.length, 'مسارات'], [D.initiatives.length, 'مبادرة']]) + `
    <div class="grid g3">${ks.map((k, n) => { const its = D.initiatives.filter((i) => i.project === k); const photos = its.reduce((s, i) => s + (i.gallery || []).length, 0); const govs = new Set(its.map((i) => i.governorate).filter(Boolean)).size;
      return `<article class="prog" style="--c:${PALETTE[n % PALETTE.length]}"><span class="tag" style="background:rgba(255,255,255,.18);color:#fff">مسار</span><h3>${esc(k)}</h3><p>${its.filter((i) => i.status === 'published').length} منشورة · آخرها ${fmtDate(its.map((i) => i.date).sort().pop())}</p><div class="n"><span><b>${m[k]}</b>مبادرة</span><span><b>${photos}</b>صورة</span><span><b>${govs}</b>محافظات</span></div></article>`; }).join('')}</div>
    <section class="card" style="margin-top:18px"><div class="card-h"><h3>إعادة تسمية مسار</h3><span class="end muted">يُطبّق على كل مبادراته</span></div><div class="card-b form cols">
      <label class="f"><span>المسار</span><select class="in" id="from">${ks.map((k) => `<option>${esc(k)}</option>`).join('')}</select></label>
      <label class="f"><span>الاسم الجديد</span><input class="in" id="to" placeholder="مثال: الوصول للجميع (A4A)"></label>
      <button class="btn primary" id="go" style="justify-self:start">تطبيق</button></div></section>
    <section class="card" style="margin-top:18px"><div class="card-h"><h3>أحدث مبادرات كل مسار</h3></div>${ks.map((k) => D.initiatives.filter((i) => i.project === k).slice(0, 3).map((i) => `<div class="proj">${i.cover ? `<img src="${esc(src(i.cover))}" alt="">` : ''}<div style="flex:1;min-inline-size:0"><b style="font-weight:500">${esc(i.title)}</b><br><small class="muted">${esc(k)} · ${fmtDate(i.date)}</small></div><a class="btn sm" href="#initiative/${i.id}">تحرير</a></div>`).join('')).join('')}</section>`;
    const after = () => { $('#go').onclick = () => { const f = $('#from').value, t = $('#to').value.trim(); if (!t) return toast('اكتب الاسم الجديد'); let n = 0; D.initiatives.forEach((i) => { if (i.project === f) { i.project = t; n++; } }); save(`أُعيدت تسمية المسار في ${n} مبادرة`); log(`أعاد تسمية المسار «${f}» إلى «${t}»`); route(); }; };
    return [html, after];
  }

  /* ====================== التصنيفات ====================== */
  function vTaxonomies() {
    const groups = [['themes', 'المجالات', (i) => i.themes], ['audienceGroups', 'الفئات المستهدفة', (i) => i.audienceGroups], ['governorate', 'المحافظات', (i) => i.governorate]];
    const html = hero('taxonomies', '', groups.map(([, l, f]) => [Object.keys(tally(D.initiatives, f)).length, l])) + `
    <div class="grid g3">${groups.map(([k, l, f]) => { const m = tally(D.initiatives, f); return `<section class="card"><div class="card-h"><h3>${l}</h3><span class="end muted">${Object.keys(m).length}</span></div>
      <div class="card-b"><div class="chips">${sortKeys(m).map((t) => `<span class="chip">${esc(t)} <b class="muted">${m[t]}</b><button type="button" data-ren="${k}" data-v="${esc(t)}" aria-label="إعادة تسمية ${esc(t)}">${svg('edit', 'width="12" height="12"')}</button></span>`).join('')}</div>
      <p class="muted" style="font-size:13px;margin:12px 0 0">إعادة التسمية تُطبّق على كل المبادرات. اكتب اسمًا موجودًا لدمج تصنيفين.</p></div></section>`; }).join('')}</div>`;
    const after = () => { $('#page').addEventListener('click', (e) => {
      const b = e.target.closest('[data-ren]'); if (!b) return; const k = b.dataset.ren, v = b.dataset.v;
      const to = prompt(`الاسم الجديد لـ «${v}» (اتركه فارغًا لإزالته):`, v); if (to === null || to === v) return;
      let n = 0; D.initiatives.forEach((i) => { if (k === 'governorate') { if (i.governorate === v) { i.governorate = to.trim(); n++; } } else if ((i[k] || []).includes(v)) { i[k] = [...new Set(i[k].map((x) => (x === v ? to.trim() : x)).filter(Boolean))]; n++; } });
      save(`طُبّق على ${n} مبادرة`); log(to ? `أعاد تسمية «${v}» إلى «${to}»` : `أزال التصنيف «${v}»`); route();
    }); };
    return [html, after];
  }

  /* ====================== قوائم المحتوى العامة ====================== */
  function listCard(path, arr, fields, tpl, title, opts = {}) {
    return `<section class="card"><div class="card-h"><h3>${title}</h3><span class="end"><span class="muted">${arr.length}</span><button type="button" class="btn sm" data-ladd="${path}" data-tpl='${esc(JSON.stringify(tpl))}'>${svg('plus')}إضافة</button></span></div>
      <div class="card-b sub-list">${arr.map((x, j) => `<div class="sub-item" style="grid-template-columns:${opts.cols || `repeat(${fields.length},minmax(0,1fr))`} auto">${fields.map(([k, l, o = {}]) => (o.img ? imgPick(`${path}.${j}.${k}`, l, x[k]) : o.ta ? area(`${path}.${j}.${k}`, l, x[k], o) : fld(`${path}.${j}.${k}`, l, x[k], o))).join('')}
        <span style="display:flex;flex-direction:column;gap:4px"><button type="button" class="icon-btn sm" data-lmv="${path}.${j}" aria-label="تقديم">${svg('up')}</button><button type="button" class="icon-btn sm danger" data-lrm="${path}.${j}" aria-label="حذف">${svg('trash')}</button></span></div>`).join('') || '<div class="empty">لا عناصر</div>'}</div></section>`;
  }
  function wireLists(page, base, rer) {
    page.addEventListener('click', (e) => {
      const t = e.target.closest('button'); if (!t) return; const d = t.dataset;
      if (d.ladd) { getPath(base, d.ladd).push(JSON.parse(d.tpl)); save('أُضيف عنصر'); rer(); }
      else if (d.lmv) { const ks = d.lmv.split('.'); const j = +ks.pop(); const a = getPath(base, ks.join('.')); if (j > 0) { [a[j - 1], a[j]] = [a[j], a[j - 1]]; save(); rer(); } }
      else if (d.lrm) { const ks = d.lrm.split('.'); const j = +ks.pop(); const a = getPath(base, ks.join('.')); const [old] = a.splice(j, 1); save(); rer(); toast('حُذف العنصر', () => { a.splice(j, 0, old); save(); rer(); }); }
    });
  }
  function siteView(key, body, stats, onAfter) {
    const html = () => hero(key, '', stats ? stats() : []) + body();
    const after = () => { const page = $('#page'); const rer = () => { page.innerHTML = `<div class="view">${html()}</div>`; if (onAfter) onAfter(rer); }; bind(page, D.site); wireImages(page, D.site, rer); wireLists(page, D.site, rer); wireSwitches(page, D.site); if (onAfter) onAfter(rer); };
    return [html(), after];
  }
  function vPartners() {
    return siteView('partners', () => `<div class="grid g4">${D.site.partners.map((p) => `<article class="card partner"><div class="logo"><img src="${esc(src(p.logo))}" alt=""></div><b>${esc(p.name)}</b><small class="muted">${esc(p.role)}</small></article>`).join('')}</div><div style="margin-top:18px">${listCard('partners', D.site.partners, [['name', 'الاسم'], ['nameEn', 'بالإنجليزية'], ['role', 'الدور'], ['url', 'الرابط', { dir: 'ltr' }], ['logo', 'الشعار', { img: 1 }]], { name: '', nameEn: '', role: 'شريك', url: '', logo: '' }, 'تحرير الشركاء', { cols: 'repeat(2,minmax(0,1fr))' })}</div>`,
      () => [[D.site.partners.length, 'شركاء ظاهرون في الموقع']]);
  }
  function vStories() {
    return siteView('stories', () => listCard('testimonials', D.site.testimonials, [['quote', 'الشهادة', { ta: 1 }], ['name', 'الاسم'], ['role', 'المكان / المبادرة']], { quote: '', name: '', role: '' }, 'ماذا يقول المبادرون', { cols: '2fr 1fr 1fr' }),
      () => [[D.site.testimonials.length, 'شهادة في الرئيسية']]);
  }
  const HOME_SECS = {
    now: ['الآن في البنك', 'أحدث ما نُشر من الميدان: مبادرات منفّذة، ودعوات مفتوحة للتقديم.'],
    themes: ['لكل تحدٍّ مبادرة', 'مجالات يعمل فيها المبادرون، من الدعم النفسي إلى الصحة والتوعية والفنون.'],
    impact: ['أثر المبادرات بالأرقام', 'أربعة مؤشرات بعدد بتلات شعارنا، تُحسب تلقائيًا من المبادرات الموثّقة.'],
    stories: ['قصص تصنع الفرق', 'شباب وشابات حوّلوا التحدي إلى مساحة أمل في الخيام ومراكز الإيواء.'],
    values: ['نعمل مع الجميع من أجل', ''],
    join: ['شارك في صناعة التغيير', ''],
  };
  function homeSecs() {
    const H = D.site.home = D.site.home || {};
    H.order = (H.order || []).filter((k) => HOME_SECS[k]); Object.keys(HOME_SECS).forEach((k) => { if (!H.order.includes(k)) H.order.push(k); });
    H.order.forEach((k) => { H[k] = Object.assign({ title: HOME_SECS[k][0], sub: HOME_SECS[k][1], show: true }, H[k] || {}); });
    return `<section class="card"><div class="card-h"><h3>أقسام الصفحة الرئيسية</h3><span class="end muted">رتّبها وأظهرها أو أخفها</span></div><div class="card-b sec-list">${H.order.map((k, j) => `<div class="sec-it${H[k].show === false ? ' off' : ''}">
      <span class="sn">${j + 1}</span><div class="form cols" style="flex:1">${fld(`home.${k}.title`, 'العنوان', H[k].title)}${k === 'join' ? '<span></span>' : fld(`home.${k}.sub`, 'الوصف', H[k].sub || '')}</div>
      <span class="sec-a">${sw(`home.${k}.show`, H[k].show !== false, 'إظهار')}<button type="button" class="icon-btn sm" data-hmv="${j}" data-d="-1" aria-label="أعلى">${svg('up')}</button><button type="button" class="icon-btn sm" data-hmv="${j}" data-d="1" aria-label="أسفل">${svg('down')}</button></span></div>`).join('')}</div></section>`;
  }
  function vHomepage() {
    const S_ = D.site;
    return siteView('homepage', () => `<div class="grid g-main"><div class="stack">
      ${homeSecs()}
      <section class="card"><div class="card-h"><h3>الواجهة الرئيسية</h3></div><div class="card-b form">${fld('brand.tagline', 'الشعار', S_.brand.tagline)}${area('brand.intro', 'النص التعريفي', S_.brand.intro)}${imgPick('heroImages.0', 'الصورة الرئيسية', S_.heroImages[0])}</div></section>
      ${listCard('stats', S_.stats, [['value', 'الرقم', { t: 'num', type: 'number' }], ['label', 'الوصف'], ['icon', 'الأيقونة', { h: 'spark · bulb · people · hands' }]], { value: 0, label: '', icon: 'spark' }, 'أرقام الإنجازات')}
      ${listCard('values', S_.values, [['title', 'القيمة'], ['text', 'الوصف', { ta: 1 }], ['icon', 'الأيقونة']], { title: '', text: '', icon: 'spark' }, 'نعمل مع الجميع من أجل (القيم)', { cols: '1fr 2fr 1fr' })}
    </div><aside class="stack">
      <section class="card"><div class="card-h"><h3>المبادرات المميزة</h3><span class="end muted">تظهر أولًا</span></div>${D.initiatives.filter((i) => i.featured).map((i) => `<div class="proj">${i.cover ? `<img src="${esc(src(i.cover))}" alt="" style="inline-size:64px;block-size:46px">` : ''}<div style="flex:1;min-inline-size:0;font-size:13.5px">${esc(i.title)}</div><button class="icon-btn sm" data-unfeat="${i.id}" aria-label="إلغاء التمييز">${svg('x')}</button></div>`).join('') || '<div class="empty">لا مبادرات مميزة — ميّزها من قائمة المبادرات ★</div>'}</section>
      <section class="card card-b panel"><h4>معاينة مصغّرة</h4><div style="border:1px solid var(--line);border-radius:10px;overflow:hidden;font-size:11px;background:#071C30;color:#fff">
        <div style="display:flex;gap:8px;align-items:center;padding:8px;border-bottom:1px solid rgba(255,255,255,.08)"><img src="../${esc(S_.brand.logoLight)}" alt="" style="block-size:16px"><span style="opacity:.6">المكتبة · الأفكار · الإعلانات</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px;align-items:center"><b style="font-size:14px;line-height:1.3">${esc(S_.brand.tagline)}</b><img src="${esc(src(S_.heroImages[0]))}" alt="" style="border-radius:8px;block-size:70px;inline-size:100%;object-fit:cover"></div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:8px;background:#fff;color:#16222E">${S_.stats.map((s) => `<span style="text-align:center"><b style="display:block;font-size:13px">${fmt(s.value)}+</b>${esc(s.label)}</span>`).join('')}</div></div></section>
    </aside></div>`, null, (rer) => { $('#page').onclick = (e) => { const hm = e.target.closest('[data-hmv]'); if (hm) { const o = D.site.home.order; const i = +hm.dataset.hmv; const j = i + +hm.dataset.d; if (j >= 0 && j < o.length) { [o[i], o[j]] = [o[j], o[i]]; save('تغيّر ترتيب الأقسام'); rer(); } return; } const b = e.target.closest('[data-unfeat]'); if (!b) return; D.initiatives.find((i) => String(i.id) === b.dataset.unfeat).featured = false; save('أُلغي التمييز'); rer(); }; });
  }
  function vGeneral() {
    const S_ = D.site; const tab = genTab;
    const panels = [
      () => `<div class="set-row"><div><h4>اسم الموقع</h4><p>يظهر في عنوان المتصفح ونتائج البحث.</p></div><div class="form cols">${fld('brand.name', 'بالعربية', S_.brand.name)}${fld('brand.nameEn', 'بالإنجليزية', S_.brand.nameEn, { dir: 'ltr' })}</div></div>
        <div class="set-row"><div><h4>الشعار</h4><p>نسخة للخلفية الفاتحة وأخرى للداكنة.</p></div><div class="form">${imgPick('brand.logo', 'خلفية فاتحة', S_.brand.logo)}${imgPick('brand.logoLight', 'خلفية داكنة', S_.brand.logoLight)}</div></div>
        <div class="set-row"><div><h4>الجهة المنفذة</h4><p>تظهر في الواجهة والتذييل.</p></div><div class="form cols">${fld('brand.org', 'الاسم', S_.brand.org)}${fld('brand.orgUrl', 'الرابط', S_.brand.orgUrl, { dir: 'ltr' })}</div></div>`,
      () => `<div class="set-row"><div><h4>نص «من نحن»</h4><p>كل سطر فقرة. الفقرة الأولى تظهر أيضًا في التذييل.</p></div>${area('about.text', '', S_.about.text, { t: 'lines', rows: 8 })}</div>
        <div class="set-row"><div><h4>الرؤية والرسالة</h4></div><div class="form">${area('about.vision', 'الرؤية', S_.about.vision, { rows: 2 })}${area('about.mission', 'الرسالة', S_.about.mission, { rows: 2 })}</div></div>
        <div class="card-b">${listCard('supportWays', S_.supportWays, [['title', 'طريقة الدعم'], ['text', 'الوصف', { ta: 1 }], ['icon', 'الأيقونة']], { title: '', text: '', icon: 'hands' }, 'طرق التعاون (صفحة ادعم البنك)', { cols: '1fr 2fr 1fr' })}</div>`,
      () => `<div class="set-row"><div><h4>بيانات التواصل</h4><p>تظهر في التذييل وصفحة «تواصل معنا».</p></div><div class="form cols">${fld('contact.phone', 'الهاتف', S_.contact.phone, { dir: 'ltr' })}${fld('contact.ibEmail', 'بريد البنك', S_.contact.ibEmail, { dir: 'ltr' })}${fld('contact.email', 'بريد المنتدى', S_.contact.email, { dir: 'ltr' })}</div></div>
        <div class="card-b grid g2">${listCard('contact.offices', S_.contact.offices, [['city', 'المدينة'], ['address', 'العنوان']], { city: '', address: '' }, 'المكاتب', { cols: '1fr 2fr' })}${listCard('contact.social', S_.contact.social, [['name', 'المنصة'], ['url', 'الرابط', { dir: 'ltr' }]], { name: '', url: '' }, 'حسابات التواصل', { cols: '1fr 2fr' })}</div>`,
      () => ['privacy', 'terms'].map((k) => `<div class="set-row" style="align-items:start"><div><h4>${esc(S_.legal[k].title)}</h4><p>آخر تحديث ${fmtDate(S_.legal[k].updated)}</p></div><div class="form">${fld(`legal.${k}.title`, 'العنوان', S_.legal[k].title)}${fld(`legal.${k}.updated`, 'آخر تحديث', S_.legal[k].updated, { type: 'date' })}${area(`legal.${k}.content`, 'المحتوى (HTML)', S_.legal[k].content, { code: true, rows: 10 })}</div></div>`).join(''),
    ];
    S_.a11y = S_.a11y || { enabled: true, statement: '' }; S_.seo = S_.seo || { baseUrl: 'https://initiativesbank.ps/' };
    panels.push(() => `<div class="set-row"><div><h4>أداة «الوصول للجميع»</h4><p>زر عائم يفتح لوحة إتاحة: حجم النص، التباين، الخط المقروء، إيقاف الحركة، دليل القراءة وملفات جاهزة.</p></div><label class="sw-l">${sw('a11y.enabled', S_.a11y.enabled !== false, 'تفعيل')}<span>إظهار الأداة في كل صفحات الموقع</span></label></div>
      <div class="set-row" style="align-items:start"><div><h4>بيان إمكانية الوصول</h4><p>يظهر داخل لوحة الإتاحة. اتركه فارغًا لإخفائه.</p></div>${area('a11y.statement', '', S_.a11y.statement || '', { rows: 4 })}</div>
      <div class="set-row"><div><h4>عنوان الموقع على الإنترنت</h4><p>يُستخدم في الروابط القانونية (canonical) وخريطة الموقع ووسوم المشاركة. غيّره عند نقل الموقع إلى نطاق جديد.</p></div>${fld('seo.baseUrl', 'الرابط الأساسي', S_.seo.baseUrl, { dir: 'ltr', ph: 'https://initiativesbank.ps/' })}</div>
      <div class="set-row"><div><h4>كلمات مفتاحية</h4><p>تساعد محركات البحث على فهم موضوع الموقع.</p></div>${fld('seo.keywords', '', S_.seo.keywords || '')}</div>
      <div class="set-row"><div><h4>صورة المشاركة الافتراضية</h4><p>تظهر عند مشاركة رابط الموقع على الشبكات الاجتماعية.</p></div>${imgPick('seo.ogImage', '', S_.seo.ogImage || '')}</div>`);
    return siteView('general', () => `<section class="card"><div class="tabs" style="--gc:var(--yellow)">${['الهوية', 'من نحن', 'التواصل', 'الصفحات القانونية', 'الوصول والسيو'].map((l, k) => `<button data-panel="${k}" aria-selected="${k === tab}">${l}</button>`).join('')}</div>${panels[tab]()}</section>`, null,
      () => { $$('[data-panel]').forEach((b) => { b.onclick = () => { genTab = +b.dataset.panel; route(); }; }); });
  }
  /* ---------- منشئ النماذج ---------- */
  const FTYPES = {
    text: 'نص قصير', textarea: 'نص طويل', number: 'رقم', email: 'بريد إلكتروني', tel: 'رقم جوال', date: 'تاريخ',
    select: 'قائمة منسدلة', radio: 'اختيار واحد', checks: 'اختيار متعدد', money: 'مبلغ وعملة', file: 'مرفقات',
    confirm: 'إقرار / موافقة', heading: 'عنوان أو نص توضيحي', repeater: 'بطاقات متكررة', budget: 'جدول موازنة',
  };
  const FT_ICON = { text: 'edit', textarea: 'news', number: 'tag', email: 'mail', tel: 'phone', date: 'clock', select: 'down', radio: 'check', checks: 'check', money: 'tag', file: 'upload', confirm: 'lock', heading: 'layout', repeater: 'layers', budget: 'layers' };
  let formTab = 0; let openField = null;
  function vForms() {
    const FM = D.site.forms; FM.list = FM.list || []; FM.gateway = FM.gateway || {};
    const F = D.site.submit;
    const tabs = ['الإعدادات العامة'].concat(FM.list.map((f) => f.short || f.title || f.id));
    if (formTab > FM.list.length) formTab = 0;
    const optsField = (base, f) => {
      const t = f.type; let h = '';
      if (['select', 'radio', 'checks'].includes(t)) h += `<div class="form cols">${area(base + '.options', 'الخيارات <small>كل سطر خيار</small>', f.options || [], { t: 'lines', rows: 6 })}${area(base + '.labels', 'تسميات معروضة (اختياري) <small>بنفس الترتيب</small>', f.labels || [], { t: 'lines', rows: 6 })}</div>`;
      if (t === 'confirm') h += area(base + '.text', 'نص الإقرار', f.text, { rows: 2 });
      if (t === 'money') h += area(base + '.currencies', 'العملات <small>كل سطر عملة</small>', f.currencies || ['دولار', 'شيكل'], { t: 'lines', rows: 3 });
      if (t === 'file') h += `<div class="form cols">${fld(base + '.maxFiles', 'أقصى عدد ملفات', f.maxFiles || 5, { t: 'num', type: 'number' })}${fld(base + '.maxMb', 'الحجم الأقصى (MB)', f.maxMb || 10, { t: 'num', type: 'number' })}</div>${fld(base + '.ext', 'الامتدادات المسموحة', f.ext || [], { t: 'tags', dir: 'ltr' })}`;
      if (['text', 'textarea'].includes(t)) h += `<div class="form cols">${fld(base + '.max', 'أقصى عدد أحرف', f.max || '', { t: 'num', type: 'number' })}${fld(base + '.placeholder', 'نص إرشادي داخل الحقل', f.placeholder || '')}</div>`;
      if (t === 'text') h += fld(base + '.quick', 'اقتراحات سريعة <small>مفصولة بفواصل</small>', f.quick || [], { t: 'tags' });
      if (t === 'repeater' || t === 'budget') {
        f.item = f.item || { fields: [] };
        h += `<div class="form cols">${fld(base + '.item.title', 'اسم البطاقة', f.item.title || '')}${fld(base + '.item.firstTitle', 'اسم البطاقة الأولى (اختياري)', f.item.firstTitle || '')}${fld(base + '.item.addLabel', 'نص زر الإضافة', f.item.addLabel || '')}${fld(base + '.item.countFrom', 'العدد يُؤخذ من الحقل (مفتاح)', f.item.countFrom || '', { dir: 'ltr', h: 'اتركه فارغًا ليضيف المتقدّم البطاقات بنفسه' })}${fld(base + '.item.min', 'الحد الأدنى', f.item.min || 1, { t: 'num', type: 'number' })}${fld(base + '.item.max', 'الحد الأقصى', f.item.max || 10, { t: 'num', type: 'number' })}</div>`;
        if (t === 'budget') h += `<div class="form cols">${fld(base + '.adminCategory', 'فئة المصاريف الإدارية', f.adminCategory || '')}${fld(base + '.contribKey', 'مفتاح حقل المساهمة الذاتية', f.contribKey || '', { dir: 'ltr' })}</div>`;
        h += `<div class="f"><span>حقول البطاقة</span>${fieldList(base + '.item.fields', f.item.fields, true)}</div>`;
      }
      return h;
    };
    const condEd = (base, f, keys) => { const c = f.showIf || {}; return `<div class="cond"><span class="muted">يظهر فقط إذا كان</span>
      <select class="in" data-cond="${base}" data-ck="key"><option value="">— يظهر دائمًا —</option>${keys.map((k) => `<option${k === c.key ? ' selected' : ''}>${esc(k)}</option>`).join('')}</select>
      <select class="in" data-cond="${base}" data-ck="op">${[['eq', 'يساوي'], ['neq', 'لا يساوي'], ['includes', 'يتضمن'], ['filled', 'مُعبّأ']].map(([v, l]) => `<option value="${v}"${v === (c.op || 'eq') ? ' selected' : ''}>${l}</option>`).join('')}</select>
      <input class="in" data-cond="${base}" data-ck="value" value="${esc(c.value || '')}" placeholder="القيمة"></div>`; };
    const allKeys = (fl) => (fl || []).filter((x) => x.type !== 'heading').map((x) => x.key);
    function fieldEditor(base, f, keys) {
      return `<div class="fe-body">
        <div class="form cols">${sel(base + '.type', 'نوع الحقل', f.type, Object.entries(FTYPES))}${fld(base + '.key', 'المفتاح البرمجي', f.key, { dir: 'ltr', h: 'حروف لاتينية بلا مسافات، فريد داخل النموذج' })}</div>
        ${fld(base + '.label', 'عنوان الحقل', f.label)}
        ${area(base + '.hint', 'نص المساعدة <small>يظهر تحت الحقل</small>', f.hint || '', { rows: f.type === 'heading' ? 5 : 2 })}
        ${f.type === 'heading' ? '' : `<div class="fe-row"><label class="sw-l">${sw(base + '.required', f.required, 'مطلوب')}<span>حقل مطلوب</span></label>
          <label class="f" style="flex:1"><span>العرض</span><select class="in" data-p="${base}.width"><option value=""${f.width ? '' : ' selected'}>عرض كامل</option><option value="half"${f.width === 'half' ? ' selected' : ''}>نصف عرض</option></select></label>
          ${sel(base + '.role', 'دور خاص', f.role || '', [['', '—'], ['title', 'اسم المبادرة'], ['contactName', 'اسم شخص التواصل'], ['contactPhone', 'جوال شخص التواصل'], ['contactEmail', 'بريد شخص التواصل'], ['contactDob', 'ميلاد شخص التواصل']])}</div>`}
        ${optsField(base, f)}
        ${condEd(base, f, keys.filter((k) => k !== f.key))}
      </div>`;
    }
    function fieldList(path, fields, nested) {
      const keysHere = allKeys(fields);
      return `<ol class="fl${nested ? ' nested' : ''}">${(fields || []).map((f, j) => { const base = `${path}.${j}`; const open = openField === base;
        return `<li class="fi${open ? ' open' : ''}${f.type === 'heading' ? ' is-head' : ''}">
          <div class="fi-h"><span class="ft">${svg(FT_ICON[f.type] || 'edit')}</span><button type="button" class="fi-t" data-fopen="${base}"><b>${esc(f.label || '(بلا عنوان)')}</b><small><span class="tag">${FTYPES[f.type] || f.type}</span> <code dir="ltr">${esc(f.key || '')}</code>${f.required ? ' <span class="pill st-review">مطلوب</span>' : ''}${f.showIf && f.showIf.key ? ` <span class="pill st-sched">شرطي: ${esc(f.showIf.key)}</span>` : ''}${f.item ? ` <span class="pill st-pub">${(f.item.fields || []).length} حقول</span>` : ''}</small></button>
            <span class="fi-a"><button type="button" class="icon-btn sm" data-fmv="${base}" data-d="-1" aria-label="أعلى">${svg('up')}</button><button type="button" class="icon-btn sm" data-fmv="${base}" data-d="1" aria-label="أسفل">${svg('down')}</button><button type="button" class="icon-btn sm" data-fdup="${base}" aria-label="تكرار">${svg('copy')}</button><button type="button" class="icon-btn sm danger" data-frm="${base}" aria-label="حذف">${svg('trash')}</button></span></div>
          ${open ? fieldEditor(base, f, nested ? keysHere : keysHere) : ''}</li>`; }).join('')}</ol>
        <div class="fadd"><span class="muted">إضافة حقل:</span>${Object.entries(FTYPES).filter(([k]) => !nested || !['repeater', 'budget', 'heading', 'file'].includes(k)).map(([k, l]) => `<button type="button" class="chip-btn" data-fadd="${path}" data-ft="${k}">${svg(FT_ICON[k] || 'plus')}${l}</button>`).join('')}</div>`;
    }
    const general = () => `<div class="set-row"><div><h4>رابط استقبال الطلبات</h4><p>بدونه يُحفظ الطلب في متصفح المتقدّم ويُعرض عليه إرسال نسخة بالبريد. يقبل أي خدمة تستقبل JSON مثل Formspree أو Google Apps Script.</p></div>${fld('forms.endpoint', 'الرابط', FM.endpoint, { dir: 'ltr', ph: 'https://formspree.io/f/…' })}</div>
      <div class="set-row"><div><h4>عنوان الصفحة ومقدمتها</h4></div><div class="form">${fld('submit.title', 'العنوان', F.title)}${area('submit.intro', 'المقدمة', F.intro, { rows: 2 })}</div></div>
      <div class="set-row" style="align-items:start"><div><h4>بوابة اختيار النموذج</h4><p>السؤال الأول الذي يحدد أي نموذج يفتح للمتقدّم.</p></div><div class="form">${fld('forms.gateway.title', 'العنوان الصغير', FM.gateway.title || '')}${fld('forms.gateway.question', 'السؤال', FM.gateway.question || '')}
        <div class="form cols">${['yes', 'no'].map((k) => { FM.gateway[k] = FM.gateway[k] || {}; return `<div class="gw-card"><b>${k === 'yes' ? 'الخيار الأول' : 'الخيار الثاني'}</b>${fld(`forms.gateway.${k}.label`, 'النص', FM.gateway[k].label || '')}${fld(`forms.gateway.${k}.cta`, 'نص الزر', FM.gateway[k].cta || '')}${sel(`forms.gateway.${k}.form`, 'يفتح النموذج', FM.gateway[k].form || '', FM.list.map((f) => [f.id, f.title]))}</div>`; }).join('')}</div></div></div>
      <div class="card-b grid g2">${listCard('submit.steps', F.steps, [['title', 'الخطوة'], ['text', 'الوصف']], { title: '', text: '' }, 'كيف يتم التقديم؟')}${listCard('submit.faq', F.faq, [['q', 'السؤال'], ['a', 'الجواب', { ta: 1 }]], { q: '', a: '' }, 'الأسئلة الشائعة')}</div>
      <div class="card-b"><button type="button" class="btn primary" id="newForm">${svg('plus')}نموذج جديد</button></div>`;
    const formPanel = (fi) => { const f = FM.list[fi]; const P = `forms.list.${fi}`; const nF = f.steps.reduce((n, s) => n + (s.fields || []).length, 0);
      return `<div class="set-row" style="align-items:start"><div><h4>بيانات النموذج</h4><p>${f.steps.length} خطوات · ${nF} حقلًا</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px"><button type="button" class="btn sm" id="pvForm">${svg('eye')}معاينة</button><button type="button" class="btn sm" id="dupForm">${svg('copy')}تكرار</button><button type="button" class="btn sm danger" id="rmForm">${svg('trash')}حذف</button></div></div>
        <div class="form"><div class="fe-row"><label class="sw-l">${sw(P + '.open', f.open !== false, 'مفتوح')}<span>${f.open !== false ? 'مفتوح لاستقبال الطلبات' : 'مغلق — لا يظهر للزوار'}</span></label></div>
          <div class="form cols">${fld(P + '.title', 'العنوان', f.title)}${fld(P + '.short', 'اسم مختصر', f.short || '')}${fld(P + '.refPrefix', 'بادئة رقم الطلب', f.refPrefix || 'IB', { dir: 'ltr' })}${sel(P + '.icon', 'الأيقونة', f.icon || 'people', [['people', 'أشخاص'], ['hands', 'أيدٍ'], ['bulb', 'فكرة'], ['spark', 'شرارة'], ['rocket', 'صاروخ'], ['globe', 'عالم']])}</div>
          ${area(P + '.desc', 'وصف يظهر في بوابة الاختيار', f.desc || f.subtitle || '', { rows: 2 })}</div></div>
        <div class="steps-ed">${f.steps.map((s, k) => `<section class="step-ed card"><div class="card-h"><span class="sn">${k + 1}</span><h3>${esc(s.title || 'خطوة')}</h3><span class="end">${s.review ? '<span class="pill st-pub">خطوة المراجعة</span>' : ''}<button type="button" class="icon-btn sm" data-smv="${k}" data-d="-1" aria-label="أعلى">${svg('up')}</button><button type="button" class="icon-btn sm" data-smv="${k}" data-d="1" aria-label="أسفل">${svg('down')}</button><button type="button" class="icon-btn sm danger" data-srm="${k}" aria-label="حذف الخطوة">${svg('trash')}</button></span></div>
          <div class="card-b"><div class="form cols">${fld(`${P}.steps.${k}.title`, 'عنوان الخطوة', s.title)}${fld(`${P}.steps.${k}.intro`, 'مقدمة الخطوة', s.intro || '')}</div>
          <div class="fe-row" style="margin:10px 0"><label class="sw-l">${sw(`${P}.steps.${k}.review`, s.review, 'مراجعة')}<span>تعرض ملخص الإجابات قبل الإرسال</span></label></div>
          ${fieldList(`${P}.steps.${k}.fields`, s.fields || [])}</div></section>`).join('')}
          <button type="button" class="btn" id="addStep">${svg('plus')}إضافة خطوة</button></div>`; };
    return siteView('forms', () => `<section class="card"><div class="tabs" style="--gc:var(--yellow)">${tabs.map((l, k) => `<button data-ftab="${k}" aria-selected="${k === formTab}">${esc(l)}${k && FM.list[k - 1].open === false ? ' <span>مغلق</span>' : ''}</button>`).join('')}</div>${formTab ? formPanel(formTab - 1) : general()}</section>`,
      () => [[FM.list.length, 'نماذج'], [FM.list.filter((f) => f.open !== false).length, 'مفتوحة'], [FM.endpoint ? 'متصل' : 'غير متصل', 'استقبال الطلبات']],
      (rer) => {
        const page = $('#page');
        const at = (p) => p.split('.').reduce((o, k) => o[k], D.site);
        const parent = (p) => { const ks = p.split('.'); const i = +ks.pop(); return [ks.reduce((o, k) => o[k], D.site), i]; };
        page.onclick = (e) => {
          const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
          if (d.ftab) { formTab = +d.ftab; openField = null; return rer(); }
          if (d.fopen) { openField = openField === d.fopen ? null : d.fopen; return rer(); }
          if (d.fadd) { const arr = at(d.fadd); const nf = { key: d.ft + (arr.length + 1), type: d.ft, label: FTYPES[d.ft] };
            if (['select', 'radio', 'checks'].includes(d.ft)) nf.options = ['الخيار الأول', 'الخيار الثاني'];
            if (d.ft === 'confirm') nf.text = 'أقرّ بصحة البيانات.';
            if (d.ft === 'repeater') nf.item = { title: 'عنصر', addLabel: 'أضف عنصرًا', min: 1, max: 10, fields: [{ key: 'name', type: 'text', label: 'الاسم', required: true }] };
            if (d.ft === 'budget') Object.assign(nf, { categories: [], adminCategory: 'مصاريف إدارية', item: { title: 'البند', addLabel: 'أضف بندًا', min: 1, max: 30, fields: [{ key: 'desc', type: 'text', label: 'وصف البند', required: true, width: 'half' }, { key: 'qty', type: 'number', label: 'الكمية', required: true, width: 'half' }, { key: 'cost', type: 'number', label: 'تكلفة الوحدة', required: true, width: 'half' }] } });
            arr.push(nf); openField = `${d.fadd}.${arr.length - 1}`; save('أُضيف الحقل'); return rer(); }
          if (d.fmv) { const [arr, i] = parent(d.fmv); const j = i + +d.d; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; openField = null; save(); return rer(); }
          if (d.fdup) { const [arr, i] = parent(d.fdup); const c = clone(arr[i]); c.key = c.key + '_2'; arr.splice(i + 1, 0, c); save('كُرّر الحقل'); return rer(); }
          if (d.frm) { const [arr, i] = parent(d.frm); const x = arr.splice(i, 1)[0]; openField = null; save(); rer(); return toast('حُذف الحقل', () => { arr.splice(i, 0, x); save(); rer(); }); }
          const f = FM.list[formTab - 1];
          if (d.smv) { const i = +d.smv; const j = i + +d.d; if (j < 0 || j >= f.steps.length) return; [f.steps[i], f.steps[j]] = [f.steps[j], f.steps[i]]; save(); return rer(); }
          if (d.srm) { const i = +d.srm; const x = f.steps.splice(i, 1)[0]; save(); rer(); return toast('حُذفت الخطوة', () => { f.steps.splice(i, 0, x); save(); rer(); }); }
          if (b.id === 'addStep') { const rv = f.steps.findIndex((s) => s.review); f.steps.splice(rv >= 0 ? rv : f.steps.length, 0, { id: 's' + uid().toString(36), title: 'خطوة جديدة', intro: '', fields: [] }); save('أُضيفت خطوة'); return rer(); }
          if (b.id === 'newForm') { const id = 'f' + uid().toString(36); FM.list.push({ id, title: 'نموذج جديد', short: 'نموذج جديد', desc: '', icon: 'bulb', open: false, refPrefix: 'IB', steps: [
            { id: 'basic', title: 'المعلومات الأساسية', intro: '', fields: [{ key: 'consent', type: 'confirm', label: 'الموافقة', required: true, text: 'أوافق على جمع البيانات لدراسة الطلب والتواصل معي.' }, { key: 'name', type: 'text', label: 'اسم المبادرة', required: true, role: 'title' }] },
            { id: 'review', title: 'المراجعة والإرسال', review: true, fields: [] }] }); formTab = FM.list.length; save('أُنشئ نموذج جديد (مغلق حتى تفعّله)'); return rer(); }
          if (b.id === 'dupForm') { const c = clone(f); c.id = 'f' + uid().toString(36); c.title += ' (نسخة)'; c.short = (c.short || '') + ' (نسخة)'; c.open = false; FM.list.push(c); formTab = FM.list.length; save('كُرّر النموذج'); return rer(); }
          if (b.id === 'rmForm') { const i = formTab - 1; const x = FM.list.splice(i, 1)[0]; formTab = 0; save(); rer(); return toast('حُذف النموذج', () => { FM.list.splice(i, 0, x); save(); rer(); }); }
          if (b.id === 'pvForm') return preview('submit.html?form=' + encodeURIComponent(f.id));
        };
        page.addEventListener('change', (e) => {
          const c = e.target.closest('[data-cond]'); if (c) { const fo = at(c.dataset.cond); const v = c.value; if (c.dataset.ck === 'key' && !v) delete fo.showIf; else { fo.showIf = fo.showIf || { op: 'eq', value: '' }; fo.showIf[c.dataset.ck] = v; } save(); return; }
          const t = e.target.closest('[data-p$=".type"], [data-p$=".key"], [data-p$=".label"]'); if (t) setTimeout(rer, 0);
        });
        page.addEventListener('input', (e) => { const c = e.target.closest('[data-cond][data-ck="value"]'); if (c) { const fo = at(c.dataset.cond); fo.showIf = fo.showIf || { op: 'eq' }; fo.showIf.value = c.value; save(); } });
      });
  }

  /* ====================== الوسائط ====================== */
  function allMedia() {
    const m = new Map(); const add = (p, w) => { if (!p || typeof p !== 'string') return; if (!m.has(p)) m.set(p, []); m.get(p).push(w); };
    D.initiatives.forEach((i) => { add(i.cover, i.title); (i.gallery || []).forEach((g) => add(g, i.title)); (i.team || []).forEach((t) => add(t.photo, i.title)); });
    D.posts.forEach((p) => { add(p.cover, p.title); (p.content.match(/src="([^"]+)"/g) || []).forEach((s) => add(s.slice(5, -1), p.title)); });
    D.site.partners.forEach((p) => add(p.logo, 'الشركاء')); D.site.about.images.forEach((p) => add(p, 'من نحن')); add(D.site.heroImages[0], 'الرئيسية');
    return m;
  }
  function vMedia() {
    const m = allMedia(); const inl = [...m.keys()].filter((p) => p.startsWith('data:')).length;
    const html = hero('media', `<button class="btn primary" id="up">${svg('upload')}رفع صور</button>`, [[fmt(m.size), 'صورة مستخدمة'], [inl, 'مضمّنة في المسودة (لم تُرفع كملف)']]) + `
    <section class="card" style="margin-bottom:16px"><div class="toolbar" style="border:0"><div class="seg" id="segm"><button aria-pressed="true" data-f="">الكل</button><button aria-pressed="false" data-f="ini">المبادرات</button><button aria-pressed="false" data-f="team">صور الفرق</button><button aria-pressed="false" data-f="other">أخرى</button></div><label class="field grow">${svg('search')}<span class="sr">بحث</span><input id="q" placeholder="ابحث باسم الملف أو المبادرة…"></label></div></section>
    <div class="media-grid" id="grid"></div>`;
    const after = () => {
      const st = { q: '', f: '' }; const teamSet = new Set(D.initiatives.flatMap((i) => (i.team || []).map((t) => t.photo)));
      const iniSet = new Set(D.initiatives.flatMap((i) => [i.cover, ...(i.gallery || [])]));
      const render = () => {
        $('#grid').innerHTML = `<button class="drop" id="up2" style="min-block-size:200px">${svg('upload', 'width="28" height="28"')}<div><b style="color:var(--ink)">ارفع صورًا</b><br><small>تُصغّر تلقائيًا إلى 1600px</small></div></button>` + [...m.entries()].filter(([p, w]) => (!st.q || (p + w.join()).includes(st.q)) && (!st.f || (st.f === 'team' ? teamSet.has(p) : st.f === 'ini' ? iniSet.has(p) : !teamSet.has(p) && !iniSet.has(p)))).slice(0, 400).map(([p, w]) =>
          `<figure class="m-item"><img src="${esc(src(p))}" alt="" loading="lazy"><figcaption><b title="${esc(p)}">${esc(p.startsWith('data:') ? 'صورة مضمّنة' : p.split('/').pop())}</b><span class="muted">${w.length === 1 ? esc(w[0]).slice(0, 44) : `مستخدمة في ${w.length} مواضع`}</span><button class="btn sm" data-copy="${esc(p.startsWith('data:') ? '' : p)}" style="justify-self:start">${svg('copy')}نسخ المسار</button></figcaption></figure>`).join('');
      };
      const up = async () => { const fs = await pickFile(true); for (const f of fs) { try { const p = await uploadImage(f); m.set(p, ['مرفوعة الآن']); } catch (err) { toast(err.message, null, true); } } render(); };
      $('#up').onclick = up;
      $('#grid').addEventListener('click', (e) => { if (e.target.closest('#up2')) up(); const c = e.target.closest('[data-copy]'); if (c && c.dataset.copy) { if (navigator.clipboard) navigator.clipboard.writeText(c.dataset.copy); toast('نُسخ المسار'); } });
      $('#q').oninput = (e) => { st.q = e.target.value; render(); };
      $('#segm').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; st.f = b.dataset.f; $$('#segm button').forEach((x) => x.setAttribute('aria-pressed', x === b)); render(); };
      render();
    };
    return [html, after];
  }
  function mediaPicker() {
    return new Promise((res) => {
      const m = allMedia(); const dr = $('#picker');
      dr.querySelector('.sheet-b').innerHTML = `<div class="media-grid" style="inline-size:100%">${[...m.keys()].filter((p) => !p.startsWith('data:')).map((p) => `<figure class="m-item pick" data-pp="${esc(p)}" tabindex="0"><img src="${esc(src(p))}" alt="" loading="lazy"><figcaption><b>${esc(p.split('/').pop())}</b></figcaption></figure>`).join('')}</div>`;
      dr.classList.add('open');
      const done = (v) => { dr.classList.remove('open'); dr.onclick = null; dr.onkeydown = null; res(v); };
      dr.onclick = (e) => { if (e.target.closest('[data-close]')) done(null); const f = e.target.closest('[data-pp]'); if (f) done(f.dataset.pp); };
      dr.onkeydown = (e) => { if (e.key === 'Enter') { const f = e.target.closest('[data-pp]'); if (f) done(f.dataset.pp); } };
    });
  }

  /* ====================== الطلبات ====================== */
  function subBody(s) {
    const schema = ((D.site.forms || {}).list || []).find((f) => f.id === s.form);
    if (!s.data || !schema) {
      return `<dl class="dl"><dt>النموذج</dt><dd>${s.form === 'pwd' ? 'مبادرات ذوي الإعاقة' : 'عام'}</dd><dt>المجالات</dt><dd>${esc((s.domains || []).join('، '))}</dd><dt>الفئات</dt><dd>${esc((s.audiences || []).join('، '))}</dd><dt>المكان</dt><dd>${esc(s.location || '')}</dd><dt>المدة</dt><dd>${esc(s.duration || '')}</dd><dt>الميزانية</dt><dd>${esc(s.budget || '')}</dd></dl>`
        + [['المشكلة', s.problem], ['الأهداف', s.goals], ['الأنشطة', s.activities], ['المواءمة', s.access]].filter((x) => x[1]).map(([l, v]) => `<div class="f" style="margin-top:12px"><span>${l}</span><p class="sub-p">${esc(v)}</p></div>`).join('')
        + `<div class="f" style="margin-top:12px"><span>الفريق</span><ul class="feed" style="font-size:13px">${(s.members || []).map((m, k) => `<li><span class="avatar" style="inline-size:24px;block-size:24px;font-size:10px">${k + 1}</span><div><b>${esc(m.name)}</b><time dir="ltr" style="text-align:end">${esc(m.phone)} · ${esc(m.email)}</time></div></li>`).join('')}</ul></div>`;
    }
    const d = s.data;
    const val = (f, v) => { if (v == null || v === '' || (Array.isArray(v) && !v.length)) return ''; if (f.type === 'confirm') return v ? 'نعم' : ''; if (f.type === 'money') return `${v.amount || ''} ${v.cur || ''}`.trim(); if (f.type === 'select' && f.labels) { const i = (f.options || []).indexOf(v); return i >= 0 ? f.labels[i] : v; } return Array.isArray(v) ? v.join('، ') : String(v); };
    return `<dl class="dl"><dt>النموذج</dt><dd>${esc(schema.title)}</dd></dl>` + schema.steps.filter((st) => !st.review).map((st) => {
      const rows = (st.fields || []).filter((f) => f.type !== 'heading' && f.type !== 'confirm').map((f) => {
        if (f.item) { const arr = d[f.key] || []; if (!arr.length) return ''; return `<div class="f"><span>${esc(f.label)}</span><ol class="sub-items">${arr.map((it, i) => `<li><b>${esc((i === 0 && f.item.firstTitle) || `${f.item.title || ''} ${i + 1}`)}</b>${(f.item.fields || []).map((sf) => { const v = val(sf, it[sf.key]); return v ? `<div><small>${esc(sf.label)}</small> ${esc(v)}</div>` : ''; }).join('')}${f.type === 'budget' ? `<div><small>الإجمالي</small> ${fmt((+it.qty || 0) * (+it.cost || 0))}</div>` : ''}</li>`).join('')}</ol></div>`; }
        const v = val(f, d[f.key]); if (!v) return '';
        return v.length > 80 || f.type === 'textarea' ? `<div class="f"><span>${esc(f.label)}</span><p class="sub-p">${esc(v)}</p></div>` : `<dl class="dl"><dt>${esc(f.label)}</dt><dd>${esc(v)}</dd></dl>`;
      }).join('');
      return rows ? `<details class="sub-sec" open><summary>${esc(st.title)}</summary>${rows}</details>` : '';
    }).join('');
  }
  function vSubmissions(openId) {
    let cur = openId || (SUBS[0] && SUBS[0].id);
    const imp = () => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.json,application/json'; i.onchange = async () => { try { const arr = [].concat(JSON.parse(await i.files[0].text())); const ids = new Set(SUBS.map((s) => s.id)); let n = 0; arr.forEach((s) => { if (s && s.title && !ids.has(s.id)) { s.id = s.id || 'S' + uid().toString(36); s.status = SUB[s.status] ? s.status : 'new'; s.members = s.members || []; SUBS.unshift(s); n++; } }); saveSubs(); toast(`استُورد ${n} طلب`); route(); } catch (err) { toast('ملف غير صالح', null, true); } }; i.click(); };
    const csv = () => {
      const flat = (o, pre, out) => { Object.entries(o || {}).forEach(([k, v]) => { const key = pre ? pre + '.' + k : k; if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, key, out); else if (Array.isArray(v) && v.some((x) => x && typeof x === 'object')) v.forEach((x, i) => flat(x, key + '.' + (i + 1), out)); else out[key] = Array.isArray(v) ? v.join('، ') : v; }); return out; };
      const recs = SUBS.map((x) => Object.assign({ id: x.id, receivedAt: x.receivedAt, status: (SUB[x.status] || [x.status])[0], form: x.formTitle || x.form, title: x.title, contact_name: (x.contact || (x.members || [])[0] || {}).name, contact_phone: (x.contact || (x.members || [])[0] || {}).phone, contact_email: (x.contact || (x.members || [])[0] || {}).email, notes: x.notes }, flat(x.data || { problem: x.problem, goals: x.goals, activities: x.activities, budget: x.budget, location: x.location }, '', {})));
      const cols = [...new Set(recs.flatMap((r) => Object.keys(r)))];
      const rows = recs.map((r) => cols.map((c) => { const v = r[c] == null ? '' : String(r[c]); return '"' + v.replace(/"/g, '""') + '"'; }).join(','));
      download('initiatives-bank-submissions.csv', '﻿' + [cols.join(','), ...rows].join('\n'), 'text/csv');
    };
    const html = () => hero('submissions', `<button class="btn" id="imp">${svg('upload')}استيراد JSON</button><button class="btn" id="csv" ${SUBS.length ? '' : 'disabled'}>${svg('download')}تصدير CSV</button>`,
      Object.entries(SUB).map(([k, [l]]) => [SUBS.filter((s) => s.status === k).length, l])) + `
      <div class="note">${svg('lock', 'width="16" height="16"')}<div>الطلبات فيها أسماء أعضاء الفرق وهواتفهم، لذلك تُحفظ على هذا الجهاز فقط ولا تُنشر مع بيانات الموقع. اسحب البطاقة بين الأعمدة لتغيير مرحلتها.</div></div>
      ${SUBS.length ? `<div class="grid g-main"><div class="kanban">${Object.entries(SUB).map(([k, [l, c]]) => { const arr = SUBS.filter((s) => s.status === k); return `<div class="col" style="--c:${c}" data-col="${k}"><h4><i></i>${l}<span>${arr.length}</span></h4>${arr.map((s) => `<button class="app-card" draggable="true" data-id="${esc(s.id)}" aria-pressed="${s.id === cur}"><b>${esc(s.title)}</b><small>${esc(s.location || '')}</small><div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;gap:6px"><span class="tag">${s.form === 'pwd' ? 'ذوو الإعاقة' : 'عام'}</span><small>${fmtDate((s.receivedAt || '').slice(0, 10))}</small></div></button>`).join('') || '<div class="ghost">اسحب طلبًا هنا</div>'}</div>`; }).join('')}</div>
        <aside class="card card-b panel" id="detail"></aside></div>`
        : `<section class="card empty">${svg('inbox', 'width="34" height="34"')}<h3>لا توجد طلبات على هذا الجهاز</h3><p>تصل الطلبات هنا عند تقديمها من هذا المتصفح، أو باستيراد ملف من خدمة الاستقبال المضبوطة في «نموذج قدّم فكرتك».</p><a class="btn" href="#forms">ضبط الاستقبال</a></section>`}`;
    const after = () => {
      const page = $('#page'); const rer = () => { page.innerHTML = `<div class="view">${html()}</div>`; detail(); };
      const detail = () => {
        const s = SUBS.find((x) => x.id === cur); const box = $('#detail'); if (!box) return; if (!s) { box.innerHTML = '<div class="empty">اختر طلبًا</div>'; return; }
        const c = s.contact || (s.members && s.members[0]) || {};
        box.innerHTML = `<div style="display:flex;gap:12px;align-items:center;margin-bottom:14px"><span class="avatar" style="inline-size:46px;block-size:46px;background:${SUB[s.status][1]}">${esc((c.name || '؟').trim()[0])}</span><div style="min-inline-size:0"><h4 style="margin:0">${esc(s.title)}</h4><small class="muted">${esc(c.name || '')} · رقم الطلب <span dir="ltr">${esc(s.id)}</span></small></div></div>
          <div class="seg" style="margin-bottom:14px">${Object.entries(SUB).map(([k, [l]]) => `<button data-move="${k}" aria-pressed="${s.status === k}">${l}</button>`).join('')}</div>
          ${subBody(s)}
          <label class="f" style="margin-top:10px"><span>ملاحظات الفريق <small>لا تصل للمتقدّم</small></span><textarea class="in" id="notes" rows="2">${esc(s.notes || '')}</textarea></label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px"><button class="btn primary" id="toInit">${svg('spark')}إلى مبادرة</button><button class="btn" id="toIdea">${svg('bulb')}إلى بنك الأفكار</button>
            <a class="btn" href="mailto:${esc(c.email || '')}?subject=${encodeURIComponent('بنك المبادرات: ' + s.title)}">${svg('mail')}مراسلة</a><button class="btn danger" id="rmS">${svg('trash')}حذف</button></div>
          <div class="trans" style="margin-top:14px;font-size:12.5px;display:block"><b style="font-weight:500">خصوصية الطلب</b><div class="muted" style="margin-top:4px">استُلم ${esc((s.receivedAt || '').replace('T', ' ').slice(0, 16))} · وافق المتقدّم على شروط جمع البيانات</div></div>`;
      };
      page.addEventListener('click', (e) => {
        const t0 = e.target.closest('button'); if (t0 && t0.id === 'imp') return imp(); if (t0 && t0.id === 'csv') return csv();
        const card = e.target.closest('.app-card'); if (card) { cur = card.dataset.id; $$('.app-card').forEach((x) => x.setAttribute('aria-pressed', x === card)); return detail(); }
        const s = SUBS.find((x) => x.id === cur); const t = t0; if (!t || !s) return;
        if (t.dataset.move) { s.status = t.dataset.move; saveSubs(); log(`نقل الطلب «${s.title}» إلى ${SUB[s.status][0]}`); return rer(); }
        if (t.id === 'rmS') { const k = SUBS.indexOf(s); SUBS.splice(k, 1); saveSubs(); cur = SUBS[0] && SUBS[0].id; rer(); return toast('حُذف الطلب', () => { SUBS.splice(k, 0, s); saveSubs(); cur = s.id; rer(); }); }
        if (t.id === 'toIdea') { D.ideas.unshift({ id: uid(), title: s.title, summary: (s.problem || '').slice(0, 260), domains: s.domains || [], location: s.location || '', status: 'draft', fromSubmission: s.id }); save('أُضيفت إلى بنك الأفكار كمسودة — بلا بيانات شخصية'); log(`حوّل «${s.title}» إلى فكرة`); }
        if (t.id === 'toInit') {
          const i = newInitiative(); i.title = s.title; i.summary = (s.problem || '').slice(0, 220); i.location = s.location || ''; i.themes = s.domains || []; i.audience = (s.audiences || []).join('، ');
          i.blocks[1].paragraphs = (s.problem || '').split('\n').filter(Boolean); i.blocks[3].items = (s.goals || '').split('\n').filter(Boolean); i.blocks[4].paragraphs = (s.activities || '').split('\n').filter(Boolean);
          D.initiatives.unshift(i); s.status = 'accepted'; saveSubs(); save(); log(`حوّل الطلب «${s.title}» إلى مبادرة`); location.hash = '#initiative/' + i.id;
        }
      });
      page.addEventListener('input', (e) => { if (e.target.id === 'notes') { const s = SUBS.find((x) => x.id === cur); s.notes = e.target.value; IB.safeSet(SUBS_KEY, JSON.stringify(SUBS)); } });
      page.addEventListener('dragstart', (e) => { const c = e.target.closest('.app-card'); if (c) e.dataTransfer.setData('text/plain', c.dataset.id); });
      page.addEventListener('dragover', (e) => { const col = e.target.closest('[data-col]'); if (col) { e.preventDefault(); $$('.col').forEach((x) => x.classList.toggle('over', x === col)); } });
      page.addEventListener('drop', (e) => { const col = e.target.closest('[data-col]'); if (!col) return; e.preventDefault(); const s = SUBS.find((x) => x.id === e.dataTransfer.getData('text/plain')); if (s && s.status !== col.dataset.col) { s.status = col.dataset.col; cur = s.id; saveSubs(); log(`نقل الطلب «${s.title}» إلى ${SUB[s.status][0]}`); toast(`نُقل إلى «${SUB[s.status][0]}»`); } rer(); });
      detail();
    };
    return [html(), after];
  }

  /* ====================== النشر ====================== */
  const siteJS = (d) => '/* بيانات موقع بنك المبادرات — يُولَّد ويُحدَّث من لوحة التحكم */\nwindow.IB_DATA = ' + JSON.stringify(d, null, 1) + ';\n';
  const exportData = () => { const o = clone(D); o.generatedAt = new Date().toISOString().slice(0, 10); delete o.submissions; o.initiatives.forEach(syncDerived); return o; };
  function download(name, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'application/json' })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
  const b64 = (s) => btoa(unescape(encodeURIComponent(s)));
  async function ghReq(cfg, path, opt) {
    const r = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}${opt && opt.method ? '' : '?ref=' + encodeURIComponent(cfg.branch)}`, Object.assign({ headers: { Authorization: 'Bearer ' + cfg.token, Accept: 'application/vnd.github+json' } }, opt || {}));
    if (!r.ok && r.status !== 404) { const j = await r.json().catch(() => ({})); throw new Error(j.message || 'HTTP ' + r.status); }
    return r.status === 404 ? null : r.json();
  }
  async function ghPut(cfg, path, content, message) {
    const cur = await ghReq(cfg, path);
    return ghReq(cfg, path, { method: 'PUT', headers: { Authorization: 'Bearer ' + cfg.token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' }, body: JSON.stringify({ message, content, branch: cfg.branch, sha: cur ? cur.sha : undefined }) });
  }
  function diff() {
    const c = (a, b) => { const A = new Map(a.map((x) => [String(x.id), JSON.stringify(x)])); const B = new Map(b.map((x) => [String(x.id), JSON.stringify(x)])); let add = 0, mod = 0, del = 0; A.forEach((v, k) => { if (!B.has(k)) add++; else if (B.get(k) !== v) mod++; }); B.forEach((v, k) => { if (!A.has(k)) del++; }); return [add, mod, del]; };
    return [['المبادرات', 'spark', c(D.initiatives, PUB.initiatives)], ['الأخبار', 'news', c(D.posts, PUB.posts)], ['الأفكار', 'bulb', c(D.ideas, PUB.ideas || [])], ['إعدادات الموقع', 'gear', JSON.stringify(D.site) === JSON.stringify(PUB.site) ? [0, 0, 0] : [0, 1, 0]]];
  }
  function vPublish() {
    const cfg = gh() || { owner: 'mahabuhamada', repo: 'gaza-timeline', branch: 'main', token: '' };
    const inl = (JSON.stringify(D).match(/data:image\/[^"]+/g) || []).length; const d = diff(); const any = dirty();
    const html = hero('publish', `<button class="btn" id="pvsite">${svg('eye')}معاينة الموقع بالمسودة</button>`, [[any ? 'نعم' : 'لا', 'تغييرات غير منشورة'], [inl, 'صور مضمّنة لم تُرفع']]) + `
    <div class="grid g2">
      <section class="card"><div class="card-h"><h3>ما الذي سيتغيّر</h3><span class="end"><span class="pill ${any ? 'st-review' : 'st-pub'}">${any ? 'المسودة تختلف عن الموقع' : 'متزامن'}</span></span></div>
        <table class="table"><thead><tr><th>القسم</th><th>جديد</th><th>معدّل</th><th>محذوف</th></tr></thead><tbody>${d.map(([l, i, [a, m, x]]) => `<tr><td><span style="display:inline-flex;gap:8px;align-items:center">${svg(i, 'width="16" height="16"')}${l}</span></td><td>${a || '—'}</td><td>${m || '—'}</td><td>${x || '—'}</td></tr>`).join('')}</tbody></table>
        <div class="card-b"><button class="btn danger" id="reset" ${any ? '' : 'disabled'}>${svg('trash')}تجاهل المسودة</button></div></section>
      <section class="card"><div class="card-h"><h3 style="display:flex;gap:8px;align-items:center">${svg('github', 'width="18" height="18"')}النشر إلى GitHub</h3></div><div class="card-b form">
        <p class="muted" style="margin:0;font-size:13px">يحدّث <code>data/site-data.js</code> في المستودع، فيظهر التحديث على GitHub Pages خلال دقيقة.</p>
        <div class="form cols"><label class="f"><span>المالك</span><input class="in" id="gOwner" dir="ltr" value="${esc(cfg.owner)}"></label><label class="f"><span>المستودع</span><input class="in" id="gRepo" dir="ltr" value="${esc(cfg.repo)}"></label>
        <label class="f"><span>الفرع</span><input class="in" id="gBranch" dir="ltr" value="${esc(cfg.branch)}"></label><label class="f"><span>رمز الوصول <small>Contents: Read & Write</small></span><input class="in" id="gToken" dir="ltr" type="password" value="${esc(cfg.token)}" placeholder="github_pat_…"></label></div>
        <div class="trans"><div style="flex:1"><b style="font-weight:500">تذكّر الرمز على هذا الجهاز</b><br><small class="muted">وإلا يُحذف عند إغلاق المتصفح</small></div><button type="button" class="switch" role="switch" id="gRemember" aria-checked="${!!IB.safeGet(GH_KEY)}" aria-label="تذكر الرمز"></button></div>
        <div style="display:flex;gap:8px"><button class="btn" id="gSave">حفظ الإعدادات</button><button class="btn primary" id="gPub">${svg('send')}نشر الآن</button></div><div id="gMsg"></div></div></section>
      <section class="card"><div class="card-h"><h3>تصدير واستيراد</h3></div><div class="card-b form"><p class="muted" style="margin:0;font-size:13px">للنسخ الاحتياطي أو النشر اليدوي: ضع <code>site-data.js</code> داخل مجلد <code>data</code> في المستودع.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="exJs">${svg('download')}site-data.js</button><button class="btn" id="exJson">${svg('download')}JSON</button><button class="btn" id="imJson">${svg('upload')}استيراد JSON</button></div></div></section>
      <section class="card"><div class="card-h"><h3 style="display:flex;gap:8px;align-items:center">${svg('lock', 'width="16" height="16"')}بيانات الدخول للوحة</h3></div><div class="card-b form">
        <p class="muted" style="margin:0;font-size:13px">تُحفظ في المسودة، وتسري بعد <b>النشر</b>. تُخزَّن كلمة المرور مشفّرة (PBKDF2) لا كنص.</p>
        <div class="form cols"><label class="f"><span>اسم المستخدم</span><input class="in" id="aUser" dir="ltr" autocomplete="username" value="${esc((D.site.admin && D.site.admin.user) || (window.IBAuth && IBAuth.user()) || 'admin')}"></label>
        <label class="f"><span>كلمة المرور الجديدة <small>8 أحرف على الأقل</small></span><input class="in" id="aPass" dir="ltr" type="password" autocomplete="new-password"></label>
        <label class="f"><span>تأكيد كلمة المرور</span><input class="in" id="aPass2" dir="ltr" type="password" autocomplete="new-password"></label></div>
        <div><button class="btn" id="aSave">${svg('lock')}تحديث بيانات الدخول</button></div></div></section>
      <section class="card"><div class="card-h"><h3 style="display:flex;gap:8px;align-items:center">${svg('lock', 'width="16" height="16"')}عن الأمان</h3></div><div class="card-b"><p class="muted" style="margin:0;font-size:13.5px;line-height:1.9">اللوحة صفحة ثابتة: من يفتحها يرى البيانات العامة نفسها الموجودة في الموقع، ولا يستطيع تغيير الموقع المنشور بدون رمز GitHub. استخدم رمزًا محدود الصلاحية على هذا المستودع فقط، ولا تشاركه. طلبات المتقدّمين لا تغادر هذا الجهاز.</p></div></section>
    </div>`;
    const after = () => {
      const readCfg = () => ({ owner: $('#gOwner').value.trim(), repo: $('#gRepo').value.trim(), branch: $('#gBranch').value.trim() || 'main', token: $('#gToken').value.trim() });
      const store = () => { const c = readCfg(); const s = JSON.stringify(c); if ($('#gRemember').getAttribute('aria-checked') === 'true') IB.safeSet(GH_KEY, s); else { IB.safeDel(GH_KEY); try { sessionStorage.setItem(GH_KEY, s); } catch (e) { /* */ } } return c; };
      $('#gRemember').onclick = (e) => e.currentTarget.setAttribute('aria-checked', e.currentTarget.getAttribute('aria-checked') !== 'true');
      $('#gSave').onclick = () => { store(); toast('حُفظت إعدادات النشر'); };
      $('#gPub').onclick = async () => {
        const c = store(); const msg = $('#gMsg');
        if (!c.token) { msg.innerHTML = `<div class="note bad">${svg('alert', 'width="16" height="16"')}<div>أدخل رمز الوصول أولًا.</div></div>`; return; }
        $('#gPub').disabled = true; msg.innerHTML = '<div class="note">جارٍ النشر…</div>';
        try {
          const data = exportData();
          await ghPut(c, 'data/site-data.js', b64(siteJS(data)), 'تحديث بيانات الموقع من لوحة التحكم');
          await ghPut(c, 'data/site-data.json', b64(JSON.stringify(data, null, 1)), 'تحديث نسخة JSON من بيانات الموقع');
          Object.keys(PUB).forEach((k) => delete PUB[k]); Object.assign(PUB, clone(data)); PUB.ideas = PUB.ideas || [];
          IB.safeDel(IB.DRAFT_KEY); D = clone(data); log('نشر التحديثات إلى الموقع'); syncBadge();
          msg.innerHTML = `<div class="note">${svg('check', 'width="16" height="16"')}<div>نُشر إلى <b dir="ltr">${esc(c.owner)}/${esc(c.repo)}@${esc(c.branch)}</b>. يظهر على الموقع خلال دقيقة تقريبًا.</div></div>`;
        } catch (err) { msg.innerHTML = `<div class="note bad">${svg('alert', 'width="16" height="16"')}<div>فشل النشر: ${esc(err.message)}</div></div>`; }
        $('#gPub').disabled = false;
      };
      $('#aSave').onclick = async () => {
        const u = $('#aUser').value.trim(); const p = $('#aPass').value;
        if (!u) return toast('أدخل اسم المستخدم', null, true);
        if (p.length < 8) return toast('كلمة المرور قصيرة: 8 أحرف على الأقل', null, true);
        if (p !== $('#aPass2').value) return toast('كلمتا المرور غير متطابقتين', null, true);
        try { D.site.admin = await IBAuth.makeCreds(u, p); } catch (e) { return toast('تعذّر التشفير في هذا المتصفح', null, true); }
        save('حُفظت بيانات الدخول في المسودة — انشر لتسري'); log('تحديث بيانات الدخول للوحة'); route();
      };
      $('#exJs').onclick = () => download('site-data.js', siteJS(exportData()), 'text/javascript');
      $('#exJson').onclick = () => download('site-data.json', JSON.stringify(exportData(), null, 1));
      $('#imJson').onclick = () => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.json'; i.onchange = async () => { try { const o = JSON.parse(await i.files[0].text()); if (!o.site || !o.initiatives) throw new Error(); D = o; D.ideas = D.ideas || []; delete D.submissions; save('استُوردت البيانات إلى المسودة'); log('استورد ملف بيانات'); route(); } catch (e) { toast('ملف غير صالح', null, true); } }; i.click(); };
      $('#pvsite').onclick = () => preview('index.html');
      $('#reset').onclick = () => { const old = D; IB.safeDel(IB.DRAFT_KEY); D = clone(PUB); syncBadge(); route(); toast('استُعيدت النسخة المنشورة', () => { D = old; save(); route(); }); };
    };
    return [html, after];
  }

  function vLog() {
    const html = hero('log', `<button class="btn" id="clr" ${LOG.length ? '' : 'disabled'}>${svg('trash')}مسح السجل</button>`, [[LOG.length, 'تعديل مسجّل']]) + `
    <section class="card"><div class="card-b">${LOG.length ? `<ul class="feed">${LOG.map((l) => `<li><span class="avatar">ب</span><div>${esc(l.t)}<time>${new Date(l.at).toLocaleString('ar-u-nu-latn', { dateStyle: 'medium', timeStyle: 'short' })}</time></div></li>`).join('')}</ul>` : '<div class="empty">لا تعديلات مسجّلة على هذا الجهاز بعد.</div>'}</div></section>`;
    return [html, () => { const b = $('#clr'); if (b) b.onclick = () => { LOG = []; IB.safeDel(LOG_KEY); route(); }; }];
  }

  function notFound() { return `<section class="card empty"><h3>العنصر غير موجود</h3><a class="btn" href="#home">العودة للرئيسية</a></section>`; }

  /* ---------- المعاينة ---------- */
  function preview(path) {
    IB.safeSet(IB.DRAFT_KEY, JSON.stringify(D)); IB.safeSet(IB.PREVIEW_KEY, '1');
    $('#frame').src = '../' + path + (path.includes('?') ? '&' : '?') + 't=' + Date.now(); $('#pvOpen').href = '../' + path; $('#drawer').classList.add('open');
  }

  /* ---------- التنقل ---------- */
  let current = 'home', genTab = 0;
  function renderNav(active) {
    const counts = { submissions: SUBS.filter((s) => s.status === 'new').length };
    $('#nav').innerHTML = GROUPS.map((g) => `<div class="group" style="--gc:${g.c}">${g.id === 'main' ? '' : `<button aria-expanded="true"><i></i>${g.label}${svg('chev')}</button>`}
      <div class="links"><div>${g.items.map((k) => `<a href="#${k}" ${active === k ? 'aria-current="page"' : ''}><span class="ic">${svg(S[k].i)}</span>${S[k].t}${counts[k] ? `<span class="count">${counts[k]}</span>` : ''}</a>`).join('')}</div></div></div>`).join('');
  }
  const VIEWS = { home: vHome, initiatives: vInitiatives, posts: vPosts, ideas: vIdeas, projects: vProjects, taxonomies: vTaxonomies, partners: vPartners, stories: vStories, media: vMedia, homepage: vHomepage, general: vGeneral, forms: vForms, submissions: vSubmissions, publish: vPublish, log: vLog };
  function route() {
    const raw = decodeURIComponent(location.hash.slice(1)) || 'home';
    const [k0, arg] = raw.split('/');
    const editMap = { initiative: ['initiatives', vInitiativeEdit], post: ['posts', vPostEdit] };
    const isEdit = !!editMap[k0];
    const k = isEdit ? editMap[k0][0] : VIEWS[k0] ? k0 : 'home';
    current = k;
    const draw = () => {
      renderNav(k);
      let out = isEdit ? editMap[k0][1](arg) : VIEWS[k](arg);
      if (typeof out === 'string') out = [out];
      const [html, after, title] = out;
      const sep = svg('left', 'width="13" height="13"');
      $('#crumbs').innerHTML = k === 'home' ? '<b>الرئيسية</b>' : `<a href="#home">الرئيسية</a>${sep}${S[k].g.label}${sep}${isEdit ? `<a href="#${k}">${S[k].t}</a>${sep}<b id="crumbT">${esc(title || 'تحرير')}</b>` : `<b>${S[k].t}</b>`}`;
      const old = $('#page'); const page = old.cloneNode(false); old.replaceWith(page);
      page.innerHTML = `<div class="view">${html}</div>`;
      if (after) after();
      document.title = `${isEdit ? 'تحرير — ' : ''}${S[k].t} | لوحة تحكم بنك المبادرات`;
      $('#side').classList.remove('open'); window.scrollTo({ top: 0 }); syncBadge();
    };
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(draw); else draw();
  }

  /* ---------- لوحة الأوامر ---------- */
  function cmds() {
    return [
      ...Object.keys(S).map((k) => ({ label: S[k].t, hint: S[k].g.label, icon: S[k].i, c: S[k].c, go: '#' + k })),
      ...D.initiatives.map((i) => ({ label: i.title || 'مبادرة بلا عنوان', hint: 'مبادرة', icon: 'spark', c: 'var(--orange)', go: '#initiative/' + i.id })),
      ...D.posts.map((p) => ({ label: p.title || 'خبر بلا عنوان', hint: 'خبر', icon: 'news', c: 'var(--orange)', go: '#post/' + p.id })),
      { label: 'مبادرة جديدة', hint: 'إجراء', icon: 'plus', c: 'var(--orange)', go: '#initiative/new' },
      { label: 'خبر جديد', hint: 'إجراء', icon: 'plus', c: 'var(--orange)', go: '#post/new' },
      { label: 'معاينة الموقع', hint: 'إجراء', icon: 'eye', c: 'var(--blue)', run: () => preview('index.html') },
      { label: 'تبديل الوضع الليلي', hint: 'إجراء', icon: 'moon', c: 'var(--violet)', run: () => $('#themeBtn').click() },
    ];
  }
  let selI = 0, shown = [];
  function drawPal() {
    const q = $('#palIn').value.trim();
    shown = cmds().filter((c) => !q || c.label.includes(q) || c.hint.includes(q)).slice(0, 9); selI = Math.max(0, Math.min(selI, shown.length - 1));
    $('#palList').innerHTML = shown.map((c, i) => `<li role="option" aria-selected="${i === selI}" data-i="${i}" style="--gc:${c.c}"><span class="ic">${svg(c.icon)}</span><span class="l">${esc(c.label)}</span><small>${c.hint}</small></li>`).join('') || '<li class="muted">لا نتائج</li>';
  }
  const openPal = () => { $('#palette').classList.add('open'); $('#palIn').value = ''; selI = 0; drawPal(); $('#palIn').focus(); };
  const closePal = () => $('#palette').classList.remove('open');
  const runCmd = (c) => { if (!c) return; closePal(); if (c.run) c.run(); else location.hash = c.go; };

  /* ---------- الهيكل ---------- */
  document.getElementById('app').innerHTML = `
  <aside class="side" id="side" aria-label="القائمة الرئيسية">
    <div class="brand"><img src="../${esc(D.site.brand.logoLight)}" alt="${esc(D.site.brand.name)}"></div>
    <div class="brand-chip">لوحة تحكم بنك المبادرات · مبادرة من ${esc(D.site.brand.org)}</div>
    <nav class="nav" id="nav"></nav>
    <div class="me"><span class="avatar">ب</span><div style="min-inline-size:0"><b>${esc((window.IBAuth && IBAuth.user()) || 'فريق بنك المبادرات')}</b><small><a href="../index.html" target="_blank" rel="noopener">فتح الموقع ↗</a></small></div></div>
  </aside>
  <div class="main">
    <header class="top">
      <button class="icon-btn menu-btn" id="menuBtn" aria-label="فتح القائمة">${svg('menu')}</button>
      <div class="crumbs" id="crumbs"></div>
      <button class="search" id="openPal">${svg('search', 'width="16" height="16"')}<span>ابحث عن مبادرة أو انتقل إلى قسم…</span><kbd>Ctrl K</kbd></button>
      <a class="sync" id="sync" href="#publish"></a>
      <button class="icon-btn" id="themeBtn" aria-label="تبديل الوضع الليلي">${svg('moon')}</button>
      <button class="icon-btn" id="logoutBtn" aria-label="تسجيل الخروج" title="تسجيل الخروج">${svg('logout')}</button>
    </header>
    <main class="page" id="page" tabindex="-1"></main>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', `
  <div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="معاينة"><div class="scrim" data-close></div><div class="sheet">
    <div class="sheet-h"><b>معاينة كما سيراها الزائر</b><span class="pill st-review">مسودة</span>
      <div class="seg" style="margin-inline-start:auto"><button aria-pressed="true" data-dev="desktop">حاسوب</button><button aria-pressed="false" data-dev="mobile">جوال</button></div>
      <a class="icon-btn" id="pvOpen" target="_blank" rel="noopener" aria-label="فتح في نافذة">${svg('ext')}</a><button class="icon-btn" data-close aria-label="إغلاق">${svg('x')}</button></div>
    <div class="sheet-b"><iframe class="frame" id="frame" title="معاينة الصفحة"></iframe></div></div></div>
  <div class="drawer" id="picker" role="dialog" aria-modal="true" aria-label="اختيار صورة"><div class="scrim" data-close></div><div class="sheet">
    <div class="sheet-h"><b>اختر صورة من المكتبة</b><button class="icon-btn" data-close aria-label="إغلاق" style="margin-inline-start:auto">${svg('x')}</button></div><div class="sheet-b"></div></div></div>
  <div class="palette" id="palette" role="dialog" aria-modal="true" aria-label="البحث السريع"><div class="pal"><input id="palIn" placeholder="اكتب اسم مبادرة أو قسم أو إجراء…" autocomplete="off" aria-label="بحث"><ul id="palList" role="listbox"></ul>
    <div class="foot"><span>↑↓ للتنقل</span><span>Enter للفتح</span><span>Esc للإغلاق</span></div></div></div>`);

  $('#openPal').onclick = openPal;
  $('#palIn').oninput = () => { selI = 0; drawPal(); };
  $('#palList').onclick = (e) => { const li = e.target.closest('[data-i]'); if (li) runCmd(shown[+li.dataset.i]); };
  $('#palette').onclick = (e) => { if (e.target.id === 'palette') closePal(); };
  $('#drawer').addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) { $('#drawer').classList.remove('open'); $('#frame').src = 'about:blank'; }
    const d = e.target.closest('[data-dev]'); if (d) { $$('[data-dev]').forEach((x) => x.setAttribute('aria-pressed', x === d)); $('#frame').classList.toggle('mobile', d.dataset.dev === 'mobile'); }
  });
  document.addEventListener('click', (e) => {
    const gr = e.target.closest('.group > button'); if (gr) { const g = gr.parentElement; g.toggleAttribute('data-closed'); gr.setAttribute('aria-expanded', !g.hasAttribute('data-closed')); }
    if ($('#side').classList.contains('open') && !e.target.closest('#side') && !e.target.closest('#menuBtn')) $('#side').classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPal(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save('حُفظت المسودة'); }
    if (e.key === 'Escape') { closePal(); $$('.drawer').forEach((d) => d.classList.remove('open')); $('#side').classList.remove('open'); }
    if ($('#palette').classList.contains('open') && shown.length) {
      if (e.key === 'ArrowDown') { e.preventDefault(); selI = (selI + 1) % shown.length; drawPal(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); selI = (selI - 1 + shown.length) % shown.length; drawPal(); }
      if (e.key === 'Enter') runCmd(shown[selI]);
    }
  });
  try { const th = localStorage.getItem(THEME_KEY); if (th) document.documentElement.dataset.theme = th; } catch (e) { /* */ }
  $('#themeBtn').onclick = () => { const isDark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; const d = isDark ? 'light' : 'dark'; document.documentElement.dataset.theme = d; try { localStorage.setItem(THEME_KEY, d); } catch (e) { /* */ } };
  $('#logoutBtn').onclick = () => { if (window.IBAuth) IBAuth.logout(); };
  $('#menuBtn').onclick = (e) => { e.stopPropagation(); $('#side').classList.toggle('open'); };
  addEventListener('hashchange', route);
  route();
})();

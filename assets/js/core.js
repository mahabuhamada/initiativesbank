/* بنك المبادرات — أدوات مشتركة بين الموقع ولوحة التحكم */
(function () {
  'use strict';

  const DRAFT_KEY = 'ib_data_draft';
  const PREVIEW_KEY = 'ib_preview';

  // مسار الجذر محسوباً من موقع هذا الملف (يعمل على GitHub Pages أو من الملفات مباشرة)
  const me = document.currentScript && document.currentScript.src;
  const BASE = me ? me.replace(/assets\/js\/core\.js.*$/, '') : '';

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function safeDel(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }

  function published() { return window.IB_DATA ? JSON.parse(JSON.stringify(window.IB_DATA)) : null; }
  function draft() { const r = safeGet(DRAFT_KEY); if (!r) return null; try { return JSON.parse(r); } catch (e) { return null; } }
  function previewOn() { return safeGet(PREVIEW_KEY) === '1' && !!draft(); }
  // صفحة مولّدة مسبقًا عند البناء (لمحركات البحث) / بيئة التوليد نفسها
  const built = !!document.querySelector('meta[name="ib-built"]');
  const prerender = /jsdom/i.test(navigator.userAgent || '');

  /** البيانات التي يعرضها الموقع: المنشورة، أو المسودة إن فُعّلت المعاينة من اللوحة */
  function data() { return previewOn() ? draft() : published(); }

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const src = (p) => !p ? '' : (/^(https?:|data:|blob:|\/)/.test(p) ? p : BASE + p);
  const url = (p) => BASE + p;
  const qs = (k) => new URLSearchParams(location.search).get(k);
  const num = (n) => Number(n || 0).toLocaleString('en-US');

  const dateFmt = new Intl.DateTimeFormat('ar-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });
  const monthFmt = new Intl.DateTimeFormat('ar-u-nu-latn', { month: 'short', year: 'numeric' });
  function fmtDate(d) { if (!d) return ''; const x = new Date(d + 'T12:00:00'); return isNaN(x) ? d : dateFmt.format(x); }
  function fmtMonth(d) { const x = new Date(d + 'T12:00:00'); return isNaN(x) ? d : monthFmt.format(x); }

  // أيقونات خطية بسيطة (SVG)
  const P = {
    spark: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3.2"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/>',
    hands: '<path d="M2 14l4-4 3 2 3-3 3 3 3-2 4 4"/><path d="M6 10v6l4 4h4l4-4v-6"/>',
    rocket: '<path d="M14 4c3 0 6 3 6 6l-6 6-6-6c0-3 3-6 6-6z"/><circle cx="14" cy="10" r="1.8"/><path d="M8 16l-3 3M10 18l-2 3M6 14l-3 2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    box: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
    megaphone: '<path d="M3 10v4l11 5V5L3 10z"/><path d="M14 8a4 4 0 0 1 0 8M6 14l1 6h3l-1-5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/>',
    team: '<circle cx="12" cy="7" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><circle cx="4.5" cy="10" r="2"/><circle cx="19.5" cy="10" r="2"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    arrowL: '<path d="M15 6l-6 6 6 6"/>',
    arrowR: '<path d="M9 6l6 6-6 6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    filter: '<path d="M4 5h16l-6 8v5l-4 2v-7L4 5z"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
    quote: '<path d="M10 7H6a2 2 0 0 0-2 2v4h5v5H4M20 7h-4a2 2 0 0 0-2 2v4h5v5h-5" />',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    send: '<path d="M21 3L3 10.5l7 3 3 7L21 3z"/><path d="M10 13.5L21 3"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v7h4v-7h3l1-4h-4V8z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
    x_: '<path d="M4 4l16 16M20 4L4 20"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
    youtube: '<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9v6l5-3z"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3-3.46M14 3c.5 2.5 2.3 4 5 4"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3V4z"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    home: '<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h4.5v-5h3v5H18V9.5"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2L9 9z"/>',
  };
  function icon(name, cls) {
    const p = P[name] || P.spark;
    return `<svg class="${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  }
  const socialIcon = { Facebook: 'facebook', Instagram: 'instagram', X: 'x_', LinkedIn: 'linkedin', YouTube: 'youtube', TikTok: 'tiktok' };

  const NAV = [
    ['index.html', 'الرئيسية', 'home', 'home'],
    ['about.html', 'من نحن', 'about', 'people'],
    ['initiatives.html', 'مكتبة المبادرات', 'initiatives', 'grid'],
    ['ideas.html', 'بنك الأفكار', 'ideas', 'bulb'],
    ['news.html', 'الإعلانات', 'news', 'megaphone'],
    ['partners.html', 'الشركاء', 'partners', 'hands'],
    ['support.html', 'ادعم البنك', 'support', 'spark'],
  ];

  function header(active) {
    const d = data();
    return `
<a class="skip" href="#main">تخطَّ إلى المحتوى</a>
<header class="site-header">
  <div class="wrap">
    <div class="nav-shell">
      <a class="brand" href="${url('index.html')}" aria-label="${esc(d.site.brand.name)} – الرئيسية">
        <img src="${src(d.site.brand.logo)}" alt="${esc(d.site.brand.name)}" width="150" height="42">
      </a>
      <nav class="nav" id="nav" aria-label="القائمة الرئيسية">
        ${NAV.map(([h, t, k, ic]) => `<a href="${url(h)}"${k === active ? ' aria-current="page"' : ''}>${icon(ic)}${t}</a>`).join('')}
      </nav>
      <div class="header-cta">
        <a class="icon-btn" href="${url('initiatives.html')}" aria-label="ابحث في المبادرات">${icon('search')}</a>
        <a class="btn btn-white btn-sm" href="${url('contact.html')}"><span class="btn-text">تواصل معنا</span><span class="sr-only">تواصل</span>${icon('mail')}</a>
        <a class="btn btn-primary btn-sm" href="${url('submit.html')}">${icon('bulb')}<span class="btn-text">قدّم فكرتك</span></a>
        <button class="icon-btn menu-btn" aria-expanded="false" aria-controls="nav" aria-label="القائمة">${icon('menu')}</button>
      </div>
    </div>
  </div>
</header>`;
  }

  function footer(active) {
    const d = data(); const s = d.site;
    const nInit = live(d.initiatives).length; const nPosts = live(d.posts).length;
    const grp = (t, ic, items) => `<details class="ft-grp" open><summary>${icon(ic)}<h4>${t}</h4>${icon('chev')}</summary><ul>${items.map(([h, l]) => `<li><a href="${url(h)}">${l}</a></li>`).join('')}</ul></details>`;
    const tile = (href, ic, lbl, val, cls, ext) => `<a class="ft-tile ${cls}" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}><span class="ti">${icon(ic)}</span><span><small>${lbl}</small><b${cls === 'tel' ? ' dir="ltr"' : ''}>${val}</b></span></a>`;
    const dock = [['index.html', 'الرئيسية', 'home', 'home'], ['initiatives.html', 'المبادرات', 'grid', 'initiatives'], null, ['ideas.html', 'الأفكار', 'brain', 'ideas']];
    return `
<footer class="site-footer ft">
  <div class="wrap">
    <section class="ft-cta">
      <span class="ft-cta-ic">${icon('bulb')}</span>
      <div><h3>لديك فكرة تصنع فرقًا؟</h3><p>قدّمها الآن، ونساعدك في تحويلها إلى مبادرة على أرض الواقع.</p></div>
      <div class="ft-cta-act"><a class="btn btn-white btn-sm" href="${url('submit.html')}">${icon('bulb')} قدّم فكرتك</a><a class="btn btn-glass btn-sm" href="${url('contact.html')}">${icon('mail')} تواصل معنا</a></div>
    </section>
    <div class="ft-bento">
      <div class="ft-card ft-brand">
        <img src="${src(s.brand.logoLight)}" alt="${esc(s.brand.name)}" width="160" height="45" loading="lazy">
        <p>${esc(s.about.text[0])}</p>
        <div class="socials">${s.contact.social.map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener" aria-label="${esc(x.name)}">${icon(socialIcon[x.name] || 'link')}</a>`).join('')}</div>
      </div>
      <nav class="ft-card ft-links" aria-label="روابط التذييل">
        ${grp('البنك', 'people', [['about.html', 'من نحن'], ['partners.html', 'الشركاء'], ['support.html', 'ادعم بنك المبادرات'], ['contact.html', 'تواصل معنا']])}
        ${grp('المحتوى', 'book', [['initiatives.html', 'مكتبة المبادرات'], ['ideas.html', 'بنك الأفكار'], ['news.html', 'الإعلانات والأخبار']])}
        ${grp('شارك', 'spark', [['submit.html', 'قدّم فكرتك'], ['submit.html?form=pwd', 'مبادرة لذوي الإعاقة']])}
      </nav>
      <div class="ft-card ft-contact">
        <h4>تواصل معنا</h4>
        ${tile('mailto:' + esc(s.contact.ibEmail), 'mail', 'البريد الإلكتروني', esc(s.contact.ibEmail), 'mail')}
        ${tile('tel:' + esc(s.contact.phone), 'phone', 'الهاتف', esc(s.contact.phone), 'tel')}
        ${tile(url('contact.html'), 'pin', `${s.contact.offices.length} مكاتب`, esc(s.contact.offices[0].city) + ' · فلسطين', 'loc')}
      </div>
      <div class="ft-card ft-nums">
        <h4>البنك بالأرقام</h4>
        <div class="ft-n"><a href="${url('initiatives.html')}"><b>${num(nInit)}</b><small>مبادرة</small></a><a href="${url('news.html')}"><b>${num(nPosts)}</b><small>خبر</small></a><a href="${url('contact.html')}"><b>${num(s.contact.offices.length)}</b><small>مكاتب</small></a></div>
        <button type="button" class="ft-top" data-top>${icon('up')} العودة للأعلى</button>
      </div>
    </div>
    <div class="ft-bottom">
      <span>© ${new Date().getFullYear()} ${esc(s.brand.name)} — مبادرة من <a href="${esc(s.brand.orgUrl)}" target="_blank" rel="noopener">${esc(s.brand.org)}</a></span>
      <span class="ft-legal"><a href="${url('privacy.html')}">سياسة الخصوصية</a><a href="${url('terms.html')}">الشروط والأحكام</a></span>
    </div>
  </div>
</footer>
<a class="fab" href="${url('submit.html')}">${icon('bulb')}<span>قدّم فكرتك</span></a>
<nav class="dock" aria-label="تنقل سريع">${dock.map((x) => x ? `<a href="${url(x[0])}"${x[3] === active ? ' aria-current="page"' : ''}>${icon(x[2])}<span>${x[1]}</span></a>` : `<a class="dock-main" href="${url('submit.html')}" aria-label="قدّم فكرتك"><i>${icon('bulb')}</i><span>قدّم فكرتك</span></a>`).join('')}<button type="button" class="dock-menu" aria-controls="nav" aria-expanded="false">${icon('menu')}<span>القائمة</span></button></nav>`;
  }

  /* ====== الوصول للجميع (لوحة إتاحة احترافية) ====== */
  const A11Y_KEY = 'ib_a11y';
  const AI = {
    a11y: '<circle cx="12" cy="4.2" r="2"/><path d="M4.5 8.2c2.5.9 5 1.3 7.5 1.3s5-.4 7.5-1.3M12 9.5v4.5M12 14l-3.2 6.5M12 14l3.2 6.5"/>',
    text: '<path d="M4 7V5h11v2M9.5 5v14M7 19h5M14 12v-1.5h6V12M17 10.5V19M15.5 19h3"/>',
    lh: '<path d="M10 6h10M10 12h10M10 18h10M5 4v16M3 6l2-2 2 2M3 18l2 2 2-2"/>',
    ls: '<path d="M5 15l3-9 3 9M6 12.5h4M13 15V6h3a2 2 0 0 1 0 4h-3 3.5a2.5 2.5 0 0 1 0 5H13M3 19h18M3 19l2-1.5M3 19l2 1.5M21 19l-2-1.5M21 19l-2 1.5"/>',
    font: '<path d="M6 19 11 5h2l5 14M8 14h8"/>',
    heads: '<path d="M5 5v14M14 5v14M5 12h9M18 9l2-1.5V19"/>',
    links: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    align: '<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>',
    dark: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    contrast: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>',
    satLow: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M8 15h8"/>',
    satHigh: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M12 11v7M8.5 14.5h7"/>',
    mono: '<circle cx="12" cy="12" r="8.5"/><path d="M5 18 18 5"/>',
    motion: '<rect x="6.5" y="5" width="3.5" height="14" rx="1"/><rect x="14" y="5" width="3.5" height="14" rx="1"/>',
    img: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8M3 3l18 18"/>',
    guide: '<rect x="3" y="9.5" width="18" height="5" rx="1.5"/><path d="M7 9.5V12M11 9.5V12M15 9.5V12"/>',
    mask: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 14h18" stroke-dasharray="2 2"/>',
    cursor: '<path d="M5 3l14 7-6 2-2 6z"/>',
    focus: '<rect x="4" y="7" width="16" height="10" rx="3"/><path d="M2 5V3h2M20 3h2v2M22 19v2h-2M4 21H2v-2"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3V4z"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    kbd: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
  };
  const ai = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${AI[k]}</svg>`;
  // [المفتاح، العنوان، الأيقونة، عدد المستويات (1 = تشغيل/إيقاف)، مجموعة حصرية]
  const A11Y_GROUPS = [
    ['تعديل المحتوى', [['text', 'حجم النص', 'text', 4], ['lh', 'تباعد الأسطر', 'lh', 3], ['ls', 'تباعد الأحرف', 'ls', 3], ['font', 'خط سهل القراءة', 'font', 1], ['heads', 'إبراز العناوين', 'heads', 1], ['links', 'إبراز الروابط', 'links', 1], ['align', 'محاذاة النص', 'align', 1]]],
    ['تعديل الألوان', [['dark', 'تباين داكن', 'dark', 1, 'c'], ['light', 'تباين فاتح', 'light', 1, 'c'], ['contrast', 'تباين عالٍ', 'contrast', 1, 'c'], ['satLow', 'تشبّع منخفض', 'satLow', 1, 's'], ['satHigh', 'تشبّع عالٍ', 'satHigh', 1, 's'], ['mono', 'أحادي اللون', 'mono', 1, 's']]],
    ['التنقل والتركيز', [['motion', 'إيقاف الحركة', 'motion', 1], ['img', 'إخفاء الصور', 'img', 1], ['guide', 'دليل القراءة', 'guide', 1], ['mask', 'قناع القراءة', 'mask', 1], ['cursor', 'مؤشر كبير', 'cursor', 1], ['focus', 'إبراز التركيز', 'focus', 1]]],
  ];
  const A11Y_PROFILES = [
    ['vision', 'ضعف البصر', 'eye', { text: 2, contrast: 1, heads: 1, cursor: 1 }],
    ['seizure', 'آمن لنوبات الصرع', 'bolt', { motion: 1, satLow: 1 }],
    ['adhd', 'تشتت الانتباه', 'brain', { mask: 1, motion: 1, heads: 1 }],
    ['dyslexia', 'صعوبات القراءة', 'book', { font: 1, lh: 2, ls: 1, guide: 1 }],
    ['keyboard', 'التنقل بلوحة المفاتيح', 'kbd', { focus: 1, links: 1 }],
  ];
  const A11Y_ITEMS = A11Y_GROUPS.flatMap(([, it]) => it);
  function a11yState() { try { return JSON.parse(safeGet(A11Y_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function a11yApply(st) {
    const h = document.documentElement;
    A11Y_ITEMS.forEach(([k]) => { const v = st[k] || 0; h.classList.toggle('a11y-' + k, !!v); if (v) h.setAttribute('data-a11y-' + k, v); else h.removeAttribute('data-a11y-' + k); });
    h.style.setProperty('--a11y-scale', String(1 + (st.text || 0) * 0.1));
    const need = (id, on, build) => { let el = document.getElementById(id); if (on && !el) { el = build(); document.body.appendChild(el); } else if (!on && el) el.remove(); };
    need('a11y-guide', st.guide, () => { const g = document.createElement('div'); g.id = 'a11y-guide'; g.setAttribute('aria-hidden', 'true'); return g; });
    need('a11y-mask', st.mask, () => { const m = document.createElement('div'); m.id = 'a11y-mask'; m.setAttribute('aria-hidden', 'true'); m.innerHTML = '<i></i><i></i>'; return m; });
    if (!a11yApply.bound) {
      a11yApply.bound = true;
      document.addEventListener('pointermove', (e) => {
        const g = document.getElementById('a11y-guide'); if (g) g.style.top = e.clientY + 'px';
        const m = document.getElementById('a11y-mask'); if (m) { m.firstChild.style.height = Math.max(0, e.clientY - 60) + 'px'; m.lastChild.style.top = (e.clientY + 60) + 'px'; }
      }, { passive: true });
    }
  }
  function a11yWidget() {
    const S = data() || {}; const conf = S.a11y || {};
    if (conf.enabled === false) return;
    const st = a11yState();
    const tile = ([k, l, i, lv, grp]) => `<button type="button" class="a11y-tile" data-k="${k}" data-lv="${lv}"${grp ? ` data-g="${grp}"` : ''} aria-pressed="false">${ai(i)}<span>${l}</span>${lv > 1 ? `<span class="lv" aria-hidden="true">${Array.from({ length: lv }, () => '<i></i>').join('')}</span>` : ''}<b class="ok" aria-hidden="true"></b></button>`;
    document.body.insertAdjacentHTML('beforeend', `
<div class="a11y" id="a11y">
  <button type="button" class="a11y-btn" id="a11y-btn" aria-expanded="false" aria-controls="a11y-panel" aria-label="فتح أدوات الوصول للجميع (Alt+A)" title="الوصول للجميع">${ai('a11y')}</button>
  <div class="a11y-scrim" data-close></div>
  <section class="a11y-panel" id="a11y-panel" role="dialog" aria-modal="true" aria-labelledby="a11y-ttl" hidden>
    <header class="a11y-head"><span class="a11y-ic">${ai('a11y')}</span><div><h2 id="a11y-ttl">الوصول للجميع</h2><small>اضبط الموقع بما يناسبك · Alt+A</small></div><button type="button" class="a11y-x" data-close aria-label="إغلاق">×</button></header>
    <div class="a11y-body">
      <div class="a11y-sec"><h3>ملفات جاهزة</h3><div class="a11y-prof">${A11Y_PROFILES.map(([k, l, i]) => `<button type="button" data-p="${k}" aria-pressed="false">${ai(i)}<span>${l}</span><i class="sw" aria-hidden="true"></i></button>`).join('')}</div></div>
      ${A11Y_GROUPS.map(([t, it], gi) => `<details class="a11y-sec" open><summary><h3>${t}</h3>${ai('chev')}</summary><div class="a11y-grid">${it.map(tile).join('')}</div></details>`).join('')}
      ${conf.statement ? `<details class="a11y-sec a11y-stmt"><summary><h3>${ai('info')} بيان إمكانية الوصول</h3>${ai('chev')}</summary><p>${esc(conf.statement)}</p></details>` : ''}
    </div>
    <footer class="a11y-foot"><button type="button" class="a11y-reset">${ai('reset')} إعادة ضبط الإعدادات</button></footer>
  </section>
</div>`);
    const box = document.getElementById('a11y'); const btn = document.getElementById('a11y-btn'); const panel = document.getElementById('a11y-panel');
    const sync = () => {
      box.querySelectorAll('.a11y-tile').forEach((b) => { const v = st[b.dataset.k] || 0; b.setAttribute('aria-pressed', !!v); b.querySelectorAll('.lv i').forEach((i, n) => i.classList.toggle('on', n < v)); });
      box.querySelectorAll('[data-p]').forEach((b) => { const p = A11Y_PROFILES.find((x) => x[0] === b.dataset.p); b.setAttribute('aria-pressed', st._p === p[0]); });
      btn.classList.toggle('on', A11Y_ITEMS.some(([k]) => st[k]));
    };
    const save = () => { safeSet(A11Y_KEY, JSON.stringify(st)); a11yApply(st); sync(); };
    const setOpen = (o) => {
      panel.hidden = !o; btn.setAttribute('aria-expanded', o); box.classList.toggle('open', o);
      if (o) setTimeout(() => panel.querySelector('.a11y-x').focus(), 30); else btn.focus();
    };
    btn.onclick = () => setOpen(panel.hidden);
    box.querySelectorAll('[data-close]').forEach((x) => x.onclick = () => setOpen(false));
    document.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ش')) { e.preventDefault(); setOpen(panel.hidden); }
      if (e.key === 'Escape' && !panel.hidden) setOpen(false);
      if (e.key === 'Tab' && !panel.hidden) { const f = [...panel.querySelectorAll('button, summary, a')].filter((x) => x.offsetParent); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    });
    box.querySelectorAll('.a11y-tile').forEach((b) => b.onclick = () => {
      const k = b.dataset.k; const lv = +b.dataset.lv; const g = b.dataset.g;
      const nv = ((st[k] || 0) + 1) % (lv + 1);
      if (g && nv) A11Y_ITEMS.forEach(([x, , , , gg]) => { if (gg === g) delete st[x]; });
      if (nv) st[k] = nv; else delete st[k];
      delete st._p; save();
    });
    box.querySelectorAll('[data-p]').forEach((b) => b.onclick = () => {
      const p = A11Y_PROFILES.find((x) => x[0] === b.dataset.p); const was = st._p === p[0];
      Object.keys(st).forEach((k) => delete st[k]);
      if (!was) { Object.assign(st, p[3]); st._p = p[0]; }
      save();
    });
    box.querySelector('.a11y-reset').onclick = () => { Object.keys(st).forEach((k) => delete st[k]); save(); };
    a11yApply(st); sync();
  }

  function mountChrome(active) {
    // عند فتح صفحة مولّدة مسبقًا نعيد بناء الواجهة حيّةً من البيانات
    document.querySelectorAll('body > .site-header, body > header.nav-shell, body > .site-footer, body > footer, body > .fab, body > .dock, body > .a11y, body > .preview-bar, body > .skip').forEach((x) => x.remove());
    document.body.insertAdjacentHTML('afterbegin', header(active));
    document.body.insertAdjacentHTML('beforeend', footer(active));
    const btn = document.querySelector('.menu-btn'); const nav = document.getElementById('nav');
    const dm = document.querySelector('.dock-menu');
    const setNav = (o) => { nav.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); if (dm) dm.setAttribute('aria-expanded', o); document.documentElement.classList.toggle('nav-open', o); };
    btn.addEventListener('click', () => setNav(!nav.classList.contains('open')));
    if (dm) dm.addEventListener('click', () => { const o = !nav.classList.contains('open'); setNav(o); if (o) window.scrollTo({ top: 0, behavior: 'smooth' }); });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) setNav(false); });
    document.addEventListener('click', (e) => { if (nav.classList.contains('open') && !e.target.closest('#nav, .menu-btn, .dock-menu')) setNav(false); });
    const fab = document.querySelector('.fab'); const ftEl = document.querySelector('.ft');
    if (fab && ftEl && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => fab.classList.toggle('away', e.isIntersecting)).observe(ftEl);
    const up = document.querySelector('[data-top]'); if (up) up.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    // مجموعات روابط الفوتر: مطوية على الجوال، مفتوحة على الشاشات الكبيرة
    if (window.matchMedia) { const mq = matchMedia('(max-width: 760px)'); const fold = () => document.querySelectorAll('.ft-grp').forEach((g) => { g.open = !mq.matches; }); fold(); mq.addEventListener && mq.addEventListener('change', fold); }
    if (previewOn()) {
      document.body.insertAdjacentHTML('beforeend', `<div class="preview-bar" role="status">وضع المعاينة: تعرض مسودة لوحة التحكم <button type="button">إيقاف</button></div>`);
      document.querySelector('.preview-bar button').onclick = () => { safeDel(PREVIEW_KEY); location.reload(); };
    }
    if (!prerender) a11yWidget();
  }

  function reveal() {
    const els = document.querySelectorAll('.reveal');
    if (prerender) return;
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -40px' });
    els.forEach((e) => io.observe(e));
  }

  function countUp(root) {
    (root || document).querySelectorAll('[data-count]').forEach((el) => {
      const to = +el.dataset.count; const plus = el.dataset.plus ? '+' : '';
      if (prerender || !window.matchMedia || !('IntersectionObserver' in window)) { el.textContent = num(to) + plus; return; }
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = num(to) + plus; return; }
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        const t0 = performance.now(); const dur = 1400;
        const step = (t) => { const k = Math.min(1, (t - t0) / dur); el.textContent = num(Math.round(to * (1 - Math.pow(1 - k, 3)))) + plus; if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
      io.observe(el);
    });
  }

  /** عناصر الواجهة العامة المعروضة فقط */
  const live = (arr) => (arr || []).filter((x) => (x.status || 'published') === 'published');

  window.IB = {
    BASE, DRAFT_KEY, PREVIEW_KEY, built, prerender, data, published, draft, previewOn, safeGet, safeSet, safeDel,
    esc, src, url, qs, num, fmtDate, fmtMonth, icon, mountChrome, reveal, countUp, live,
  };
})();

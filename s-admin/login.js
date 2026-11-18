/* بوابة دخول لوحة التحكم
 * - تتحقق من اسم المستخدم وكلمة المرور (PBKDF2-SHA256) ثم تحمّل اللوحة.
 * - بيانات الدخول تُغيَّر من اللوحة: «النشر والنسخ الاحتياطي» ← «بيانات الدخول»، ثم تُنشر مع الموقع.
 * - الموقع ثابت بلا خادم: هذه البوابة تمنع الزائر العادي من فتح اللوحة، أما تعديل الموقع المنشور
 *   فيبقى محميًّا برمز GitHub الذي لا يُحفظ في المستودع.
 */
(function () {
  'use strict';
  const SESS = 'ib_admin_sess';
  const DEFAULT = { user: 'admin', salt: 'e4a8c7e2f1a35ba5e045844f42e1a626', hash: '81c9168e164a287659403dddacadc1df7c7935bcda838f68e2a74108521898e0', iter: 150000 };
  const conf = () => { const d = (window.IB && IB.published()) || {}; const a = d.site && d.site.admin; return a && a.hash && a.salt ? Object.assign({ iter: 150000 }, a) : DEFAULT; };
  const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  const unhex = (h) => new Uint8Array(h.match(/../g).map((x) => parseInt(x, 16)));

  async function derive(pass, salt, iter) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveBits']);
    return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(salt), iterations: iter }, key, 256));
  }
  async function makeCreds(user, pass) {
    const salt = hex(crypto.getRandomValues(new Uint8Array(16))); const iter = 150000;
    return { user: user.trim(), salt, iter, hash: await derive(pass, salt, iter) };
  }

  const store = (k) => { try { return JSON.parse(sessionStorage.getItem(k) || localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  function session() {
    const s = store(SESS); const c = conf();
    return s && s.exp > Date.now() && s.sig === c.hash.slice(0, 16) && s.u === c.user ? s : null;
  }
  function logout() { try { sessionStorage.removeItem(SESS); localStorage.removeItem(SESS); } catch (e) { /* */ } location.reload(); }
  window.IBAuth = { logout, makeCreds, user: () => (session() || {}).u };

  let booted = false;
  function boot() {
    if (booted) return; booted = true;
    const s = document.createElement('script'); s.src = 'admin.js'; document.body.appendChild(s);
  }
  if (session()) { boot(); return; }

  /* ---------- شاشة الدخول ---------- */
  const d = (window.IB && IB.published()) || { site: { brand: {} } };
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ic = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const PENTA = '50,6 93,37 77,90 23,90 7,37';
  document.documentElement.classList.add('locked');
  const app = document.getElementById('app');
  app.insertAdjacentHTML('beforebegin', `
<main class="gate" id="gate">
  <div class="gate-sky" aria-hidden="true">${Array.from({ length: 9 }, (_, k) => `<svg class="fl f${k}" viewBox="0 0 100 100"><polygon points="${PENTA}"/></svg>`).join('')}</div>
  <form class="gate-card" id="gForm" novalidate autocomplete="on">
    <div class="gate-mark" aria-hidden="true">
      <svg viewBox="0 0 100 100"><polygon class="ring" points="${PENTA}"/><polygon class="fill" points="${PENTA}"/></svg>
      <img src="../${esc(d.site.brand.icon || '')}" alt="">
    </div>
    <h1>أهلًا بعودتك</h1>
    <p class="gate-sub">لوحة تحكم <b>${esc(d.site.brand.name || 'بنك المبادرات')}</b></p>
    <label class="gf"><span class="gi">${ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>')}</span>
      <input id="gUser" name="username" autocomplete="username" placeholder=" " dir="ltr" required><em>اسم المستخدم</em></label>
    <label class="gf"><span class="gi">${ic('<rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>')}</span>
      <input id="gPass" name="password" type="password" autocomplete="current-password" placeholder=" " dir="ltr" required><em>كلمة المرور</em>
      <button type="button" class="eye" id="gEye" aria-label="إظهار كلمة المرور" aria-pressed="false">${ic('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>')}</button></label>
    <label class="gate-rem"><input type="checkbox" id="gRem"><i aria-hidden="true"></i>تذكّرني على هذا الجهاز لمدة أسبوع</label>
    <div class="gate-msg" id="gMsg" role="alert" aria-live="assertive"></div>
    <button class="gate-go" id="gGo" type="submit"><span>دخول</span>${ic('<path d="M19 12H5M11 6l-6 6 6 6"/>')}</button>
    <a class="gate-back" href="../index.html">${ic('<path d="M5 12h14M13 6l6 6-6 6"/>')} العودة إلى الموقع</a>
  </form>
</main>`);

  const $ = (id) => document.getElementById(id);
  const form = $('gForm'); const msg = $('gMsg'); const go = $('gGo');
  setTimeout(() => $('gUser').focus(), 60);
  $('gEye').onclick = (e) => { const p = $('gPass'); const show = p.type === 'password'; p.type = show ? 'text' : 'password'; e.currentTarget.setAttribute('aria-pressed', show); };
  let fails = 0, lockUntil = 0;
  form.onsubmit = async (e) => {
    e.preventDefault();
    const u = $('gUser').value.trim(); const p = $('gPass').value;
    if (Date.now() < lockUntil) { msg.textContent = `محاولات كثيرة. انتظر ${Math.ceil((lockUntil - Date.now()) / 1000)} ثانية.`; return; }
    if (!u || !p) { msg.textContent = 'أدخل اسم المستخدم وكلمة المرور.'; form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake'); return; }
    go.disabled = true; form.classList.add('busy'); msg.textContent = '';
    const c = conf(); let ok = false;
    try { ok = u === c.user && (await derive(p, c.salt, c.iter)) === c.hash; } catch (err) { msg.textContent = 'المتصفح لا يدعم التحقق الآمن. افتح اللوحة عبر https.'; }
    form.classList.remove('busy'); go.disabled = false;
    if (!ok) {
      if (!msg.textContent) msg.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
      fails++; if (fails >= 5) { lockUntil = Date.now() + 30000; fails = 0; }
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake'); $('gPass').select(); return;
    }
    const rem = $('gRem').checked;
    const s = JSON.stringify({ u: c.user, sig: c.hash.slice(0, 16), exp: Date.now() + (rem ? 7 * 864e5 : 12 * 36e5) });
    try { (rem ? localStorage : sessionStorage).setItem(SESS, s); } catch (err) { /* */ }
    form.classList.add('ok'); msg.textContent = '';
    setTimeout(() => { $('gate').classList.add('out'); document.documentElement.classList.remove('locked'); boot(); }, 650);
    setTimeout(() => { const g = $('gate'); if (g) g.remove(); }, 1300);
  };
})();

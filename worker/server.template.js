const homeHtml = __HOME_HTML__;
const blogHtml = __BLOG_HTML__;
const coverImage = __COVER_BASE64__;
const logoImage = __LOGO_BASE64__;
const aiSecurityImage = __AI_SECURITY_BASE64__;
const aiExplainerImage = __AI_EXPLAINER_BASE64__;
const logoBytes = Uint8Array.from(atob(logoImage), character => character.charCodeAt(0));
const SESSION_COOKIE = "technation_admin";
const SESSION_SECONDS = 12 * 60 * 60;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const LOGIN_HTML = `<!doctype html><html lang="my"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TechNation · Writer access</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap" rel="stylesheet"><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(ellipse at 80% 10%,#16476966,transparent 34%),radial-gradient(ellipse at 10% 95%,#f20d322e,transparent 38%),#08090f;color:#f5f6fa;font:16px/1.8 'Noto Sans Myanmar','Onest',sans-serif;display:grid;place-items:center;padding:24px}.card{width:min(100%,620px);background:#11131deF;border:1px solid #ffffff20;border-radius:22px;padding:clamp(24px,5vw,44px);box-shadow:0 28px 100px #0008}.brand{font:700 19px Onest,sans-serif;letter-spacing:-.5px;display:flex;align-items:center;gap:10px}.wordmark{display:inline-flex;align-items:center;padding:0;font-style:italic;font-weight:800;letter-spacing:-1px;text-transform:uppercase}.wordmark .tech{color:#f20d32}.wordmark .nation{color:#f20d32}.mark{height:38px;width:38px;border-radius:10px;display:block;object-fit:cover}.eyebrow{margin:31px 0 4px;color:#ff748d;text-transform:uppercase;letter-spacing:.13em;font:600 11px Onest,sans-serif}.card h1{font-size:29px;line-height:1.45;margin:0 0 8px}.muted{margin:0 0 25px;color:#b3b6c3;font-size:14px}.field{display:grid;gap:7px;margin:14px 0}.field label{font-size:14px;color:#dedfe7}.field input,.field textarea{width:100%;font:inherit;color:#f5f6fa;background:#090b12;border:1px solid #ffffff26;border-radius:11px;padding:12px 14px;outline:none}.field input:focus,.field textarea:focus{border-color:#fa4164;box-shadow:0 0 0 3px #f20d3228}.field textarea{min-height:220px;resize:vertical}.button{border:0;border-radius:999px;background:#f20d32;color:white;padding:12px 20px;font:600 14px Onest,'Noto Sans Myanmar',sans-serif;cursor:pointer}.button:hover{background:#ff2748}.secondary{border:1px solid #ffffff30;border-radius:999px;background:#ffffff0d;color:white;padding:9px 15px;cursor:pointer;font:500 13px Onest,'Noto Sans Myanmar',sans-serif}.row{display:flex;justify-content:space-between;align-items:center;gap:15px}.notice{min-height:28px;color:#ff9caf;font-size:13px}.hidden{display:none!important}.preview{display:block;max-width:100%;max-height:300px;object-fit:contain;border-radius:12px;margin:12px 0}.topline{display:flex;justify-content:space-between;align-items:center;margin-bottom:27px}.tiny{font:12px Onest,sans-serif;color:#aeb1bf}.card a{color:#ff859a;text-decoration:none}.back{display:inline-block;margin-top:23px;font-size:13px;color:#aeb1bf!important}@media(max-width:520px){.card{padding:22px}.card h1{font-size:25px}.row{align-items:flex-start;flex-direction:column}.row .button{width:100%}}</style></head><body><main class="card"><div class="brand"><img class="mark" src="/assets/technation-mark.jpg" alt=""> <span class="wordmark"><span class="tech">TECH</span><span class="nation">NATION</span></span></div><section id="gate"><p class="eyebrow">Writer access</p><h1>စာရေးသူအတွက် ဝင်ရောက်ရန်</h1><p class="muted">ဆောင်းပါးအသစ် တင်ရန် စကားဝှက်ကို ထည့်ပါ။</p><form id="login"><div class="field"><label for="password">Page password</label><input id="password" name="password" type="password" autocomplete="current-password" required autofocus></div><button class="button" type="submit">ဝင်ရောက်မည်</button><p class="notice" id="login-message" role="status" aria-live="polite"></p></form></section><section id="editor" class="hidden"><div class="topline"><div><p class="eyebrow" style="margin:0 0 4px">TechNation editor</p><h1 style="margin:0">ဆောင်းပါးအသစ်</h1></div><button class="secondary" id="logout" type="button">ထွက်ရန်</button></div><p class="muted">ခေါင်းစဉ်၊ စာသားနဲ့ ပုံတစ်ပုံ ထည့်ပြီး ထုတ်ဝေပါ။ ထုတ်ဝေပြီးတာနဲ့ ဘလော့ဂ်စာမျက်နှာမှာ ဖတ်ရှုနိုင်ပါမယ်။</p><form id="post-form"><div class="field"><label for="title">ခေါင်းစဉ်</label><input id="title" name="title" maxlength="180" required placeholder="ဆောင်းပါးခေါင်းစဉ်"></div><div class="field"><label for="body">ဆောင်းပါးစာသား</label><textarea id="body" name="body" maxlength="50000" required placeholder="ဆောင်းပါးအကြောင်းအရာ ရေးပါ…"></textarea></div><div class="field"><label for="image">ဆောင်းပါးပုံ (JPG, PNG သို့မဟုတ် WebP · အများဆုံး 8 MB)</label><input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required><img id="preview" class="preview hidden" alt="ရွေးထားသော ပုံကို ကြိုတင်ကြည့်ရှုရန်"></div><div class="row"><button class="button" id="publish" type="submit">ဆောင်းပါးထုတ်ဝေမည်</button><span class="tiny">TechNation · Myanmar</span></div><p class="notice" id="post-message" role="status" aria-live="polite"></p></form></section><a class="back" href="/">← ဘလော့ဂ်သို့ ပြန်သွားရန်</a></main><script>
const gate=document.querySelector('#gate'),editor=document.querySelector('#editor'),loginMessage=document.querySelector('#login-message'),postMessage=document.querySelector('#post-message');
function showEditor(){gate.classList.add('hidden');editor.classList.remove('hidden')}
async function checkSession(){try{const r=await fetch('/api/admin/session');if(r.ok&&(await r.json()).authenticated)showEditor()}catch{}}
checkSession();
document.querySelector('#login').addEventListener('submit',async e=>{e.preventDefault();loginMessage.textContent='စစ်ဆေးနေသည်…';try{const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:new FormData(e.currentTarget).get('password')})});if(!r.ok)throw new Error(r.status===401?'စကားဝှက် မမှန်ပါ။':'ဝင်ရောက်၍ မရပါ။ ထပ်မံကြိုးစားပါ။');showEditor()}catch(err){loginMessage.textContent=err.message}});
document.querySelector('#logout').addEventListener('click',async()=>{await fetch('/api/admin/logout',{method:'POST'});editor.classList.add('hidden');gate.classList.remove('hidden');document.querySelector('#password').value='';loginMessage.textContent='ထွက်ပြီးပါပြီ။'});
document.querySelector('#image').addEventListener('change',e=>{const file=e.target.files[0],img=document.querySelector('#preview');if(!file){img.classList.add('hidden');return}img.src=URL.createObjectURL(file);img.classList.remove('hidden')});
document.querySelector('#post-form').addEventListener('submit',async e=>{e.preventDefault();const button=document.querySelector('#publish');button.disabled=true;button.textContent='ထုတ်ဝေနေသည်…';postMessage.textContent='';try{const r=await fetch('/api/posts',{method:'POST',body:new FormData(e.currentTarget)});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'ဆောင်းပါးတင်၍ မရပါ။ ထပ်မံကြိုးစားပါ။');e.currentTarget.reset();document.querySelector('#preview').classList.add('hidden');postMessage.textContent='ဆောင်းပါးကို အောင်မြင်စွာ ထုတ်ဝေပြီးပါပြီ။ ဘလော့ဂ်မှာ ကြည့်ရှုနိုင်ပါတယ်။';}catch(err){postMessage.textContent=err.message}finally{button.disabled=false;button.textContent='ဆောင်းပါးထုတ်ဝေမည်'}});
</script></body></html>`;

const DETAIL_HTML = `<!doctype html><html lang="my"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TechNation · ဆောင်းပါး</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap" rel="stylesheet"><style>*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at 88% 0%,#18344d66,transparent 30%),#08090f;color:#f5f6fa;font:17px/2 'Noto Sans Myanmar','Onest',sans-serif}.wrap{width:min(850px,calc(100% - 36px));margin:auto}.nav{padding:22px 0;border-bottom:1px solid #ffffff20;font:700 18px Onest,sans-serif}.wordmark{color:#f20d32;font-style:italic;font-weight:800;letter-spacing:-1px;text-transform:uppercase}.nav b{color:#f20d32}.nav img{width:38px;height:38px;border-radius:10px;object-fit:cover;vertical-align:middle;margin-right:8px}.nav a{color:inherit;text-decoration:none}.post{padding:40px 0 80px}.post h1{font-size:clamp(27px,5vw,46px);line-height:1.55;margin:0 0 9px}.meta{font:13px Onest,sans-serif;color:#aeb1bf}.post img{width:100%;max-height:580px;object-fit:cover;border-radius:16px;margin:26px 0 5px}.caption{font-size:13px;color:#9da1af}.body{white-space:pre-wrap;color:#dfe0e7;margin-top:30px}.back{color:#ff8199;text-decoration:none;font-size:14px}.error{color:#ff8498}</style></head><body><header class="wrap nav"><a href="/"><img src="/assets/technation-mark.jpg" alt=""><span class="wordmark">TECHNATION</span></a></header><main class="wrap post" id="post"><p>ဆောင်းပါးကို ဖွင့်နေသည်…</p></main><script>const id=decodeURIComponent(location.pathname.split('/').pop());fetch('/api/posts/'+encodeURIComponent(id)).then(async r=>{if(!r.ok)throw Error('မတွေ့ရှိပါ');return r.json()}).then(({post})=>{document.title=post.title+' · TechNation';const root=document.querySelector('#post'),h=document.createElement('h1'),meta=document.createElement('p'),img=document.createElement('img'),caption=document.createElement('p'),body=document.createElement('div'),back=document.createElement('a');h.textContent=post.title;meta.className='meta';meta.textContent='TechNation · '+new Date(post.publishedAt).toLocaleDateString('my-MM',{year:'numeric',month:'long',day:'numeric'});img.src=post.imageUrl;img.alt=post.title;caption.className='caption';caption.textContent='TechNation';body.className='body';body.textContent=post.body;back.className='back';back.href='/';back.textContent='← TechNation သို့ ပြန်သွားရန်';root.replaceChildren(h,meta,img,caption,body,back)}).catch(()=>{const p=document.querySelector('#post');p.innerHTML='<h1>ဆောင်းပါးကို ရှာမတွေ့ပါ</h1><a class="back" href="/">← TechNation သို့ ပြန်သွားရန်</a>'});</script></body></html>`;

function json(value, status = 200, extra = {}) {
  return new Response(JSON.stringify(value), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": "https://9helen.github.io", "vary": "Origin", ...extra } });
}
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) diff |= (a.charCodeAt(i % Math.max(a.length, 1)) || 0) ^ (b.charCodeAt(i % Math.max(b.length, 1)) || 0);
  return diff === 0;
}
function toBase64Url(bytes) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
async function sign(expiry, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(expiry)));
}
function cookie(request) {
  const item = (request.headers.get("cookie") || "").split(";").map(part => part.trim()).find(part => part.startsWith(SESSION_COOKIE + "="));
  return item ? decodeURIComponent(item.slice(SESSION_COOKIE.length + 1)) : "";
}
async function authenticated(request, env) {
  if (!env.ADMIN_SESSION_SECRET) return false;
  const [expiry, signature, extra] = cookie(request).split(".");
  if (!expiry || !signature || extra || !/^\d+$/.test(expiry) || Number(expiry) < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, await sign(expiry, env.ADMIN_SESSION_SECRET));
}
function requireBucket(env) { if (!env.BUCKET) throw new Error("Image and post storage is not configured."); return env.BUCKET; }
function postId() { return Date.now() + "-" + crypto.randomUUID().slice(0, 8); }
function validId(value) { return /^\d{13}-[a-f0-9]{8}$/.test(value); }
async function listPosts(env) {
  const bucket = requireBucket(env);
  const listed = await bucket.list({ prefix: "posts/", limit: 100 });
  const keys = listed.objects.map(item => item.key).sort().reverse();
  const posts = [];
  for (const key of keys) {
    const object = await bucket.get(key);
    if (!object) continue;
    const post = await object.json();
    posts.push({ ...post, imageUrl: "/media/" + post.imageKey.slice("images/".length) });
  }
  return posts;
}
async function handleApi(request, env, url) {
  const path = url.pathname;
  if (path === "/api/admin/session" && request.method === "GET") return json({ authenticated: await authenticated(request, env) });
  if (path === "/api/admin/login" && request.method === "POST") {
    if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) return json({ error: "Editor access is not configured." }, 503);
    let payload;
    try { payload = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
    if (!safeEqual(payload?.password, env.ADMIN_PASSWORD)) return json({ error: "Incorrect password." }, 401);
    const expiry = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
    const token = expiry + "." + await sign(expiry, env.ADMIN_SESSION_SECRET);
    return json({ authenticated: true }, 200, { "set-cookie": SESSION_COOKIE + "=" + encodeURIComponent(token) + "; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=" + SESSION_SECONDS });
  }
  if (path === "/api/admin/logout" && request.method === "POST") return json({ authenticated: false }, 200, { "set-cookie": SESSION_COOKIE + "=; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=0" });
  if (path === "/api/posts" && request.method === "GET") {
    try { return json({ posts: await listPosts(env) }, 200, { "cache-control": "public, max-age=60" }); }
    catch (error) { return json({ error: "Posts are temporarily unavailable." }, 503); }
  }
  if (path === "/api/posts" && request.method === "POST") {
    if (!(await authenticated(request, env))) return json({ error: "Writer access is required." }, 401);
    const length = Number(request.headers.get("content-length") || 0);
    if (length > MAX_IMAGE_BYTES + 70000) return json({ error: "The image must be 8 MB or smaller." }, 413);
    let form;
    try { form = await request.formData(); } catch { return json({ error: "Invalid form data." }, 400); }
    const title = String(form.get("title") || "").trim();
    const body = String(form.get("body") || "").trim();
    const image = form.get("image");
    if (!title || title.length > 180 || !body || body.length > 50000) return json({ error: "Add a title and article text within the length limits." }, 400);
    if (!image || typeof image.arrayBuffer !== "function") return json({ error: "Choose an article image." }, 400);
    const extensions = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
    const extension = extensions[image.type];
    if (!extension) return json({ error: "Use a JPG, PNG or WebP image." }, 415);
    if (image.size > MAX_IMAGE_BYTES) return json({ error: "The image must be 8 MB or smaller." }, 413);
    const id = postId(), bucket = requireBucket(env), imageKey = "images/" + id + "." + extension;
    try {
      await bucket.put(imageKey, await image.arrayBuffer(), { httpMetadata: { contentType: image.type } });
      const post = { id, title, body, imageKey, publishedAt: new Date().toISOString() };
      await bucket.put("posts/" + id + ".json", JSON.stringify(post), { httpMetadata: { contentType: "application/json; charset=utf-8" } });
      return json({ post: { ...post, imageUrl: "/media/" + id + "." + extension } }, 201);
    } catch (error) {
      await bucket.delete(imageKey).catch(() => {});
      return json({ error: "Could not publish the post. Your text is still in the editor; please try again." }, 503);
    }
  }
  const detailMatch = path.match(/^\/api\/posts\/([^/]+)$/);
  if (detailMatch && request.method === "GET") {
    const id = detailMatch[1];
    if (!validId(id)) return json({ error: "Post not found." }, 404);
    try {
      const object = await requireBucket(env).get("posts/" + id + ".json");
      if (!object) return json({ error: "Post not found." }, 404);
      const post = await object.json();
      return json({ post: { ...post, imageUrl: "/media/" + post.imageKey.slice("images/".length) } }, 200, { "cache-control": "public, max-age=60" });
    } catch (error) { return json({ error: "Post is temporarily unavailable." }, 503); }
  }
  const mediaMatch = path.match(/^\/media\/(\d{13}-[a-f0-9]{8}\.(?:jpg|png|webp))$/);
  if (mediaMatch && request.method === "GET") {
    try {
      const object = await requireBucket(env).get("images/" + mediaMatch[1]);
      if (!object) return new Response("Not found", { status: 404 });
      const headers = new Headers({ "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" });
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      return new Response(object.body, { headers });
    } catch (error) { return new Response("Image storage unavailable", { status: 503 }); }
  }
  return json({ error: "Not found." }, 404);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/media/")) return handleApi(request, env, url);
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
    if (url.pathname === "/blog" || url.pathname === "/blog/") return new Response(blogHtml, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (url.pathname === "/" || url.pathname === "/index.html") return new Response(homeHtml, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (url.pathname === "/admin") return new Response(LOGIN_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" } });
    if (/^\/posts\/\d{13}-[a-f0-9]{8}$/.test(url.pathname)) return new Response(DETAIL_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (url.pathname === "/assets/technation-mark.jpg") return new Response(logoBytes, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
    if (url.pathname === "/assets/ai-agent-explainer.jpg") {
      const bytes = Uint8Array.from(atob(aiExplainerImage), character => character.charCodeAt(0));
      return new Response(bytes, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
    }
    if (url.pathname === "/assets/ai-agent-security.jpg") {
      const bytes = Uint8Array.from(atob(aiSecurityImage), character => character.charCodeAt(0));
      return new Response(bytes, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
    }
    if (url.pathname === "/assets/macbook-ultra.jpg") {
      const bytes = Uint8Array.from(atob(coverImage), character => character.charCodeAt(0));
      return new Response(bytes, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
    }
    return new Response("Not found", { status: 404 });
  },
};

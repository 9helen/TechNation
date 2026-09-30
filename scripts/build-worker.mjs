import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(new URL("..", import.meta.url).pathname);
const sourceHome = await readFile(resolve(root, "site-content/index.html"), "utf8");
let home = sourceHome;
const plain = value => value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim();
const readPost = (html, headingIndex = 0) => {
  const headings = [...html.matchAll(/<h2>([\s\S]*?)<\/h2>/g)];
  const bodyHtml = html.match(/<div class="article-body">([\s\S]*?)<\/div>/)?.[1] || "";
  const firstParagraph = bodyHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] || "";
  const imageUrl = html.match(/<figure class="article-hero"><img src="([^"]+)/)?.[1] || "/assets/technation-mark.jpg";
  const dateText = plain(html.match(/<small>([\s\S]*?)<\/small>/)?.[1] || "");
  const date = dateText.split(" · ")[0];
  return { title: plain(headings[headingIndex]?.[1] || "TechNation story"), bodyHtml, imageUrl: imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl, date, excerpt: plain(firstParagraph) };
};
const mainPostHtml = sourceHome.match(/<article class="article">([\s\S]*?)<section class="previous-story"/)?.[1] || "";
const staticPosts = [readPost(mainPostHtml, 1), ...[...sourceHome.matchAll(/<section class="previous-story"[\s\S]*?<\/section>/g)].map(match => readPost(match[0], 1))].map((post, index) => ({ ...post, anchor: "post-" + (index + 1), href: ["#article", "#post-ai-security", "#post-ai-explainer"][index] || "/blog" }));
home = home.replace(/<section class="wrap feature reveal d1"[\s\S]*?<\/section>/, "<section class=\"wrap feature reveal d1 featured-rotator\" aria-label=\"Featured stories\" aria-roledescription=\"carousel\"><div class=\"feature-copy\"><div class=\"tag\" id=\"featured-tag\">Featured stories</div><h2 id=\"featured-title\"></h2><p id=\"featured-excerpt\"></p><div class=\"feature-foot\"><a class=\"read-link\" id=\"featured-link\" href=\"#article\">ဆောင်းပါးဖတ်ရန်</a><span class=\"read-time\" id=\"featured-date\"></span></div><div class=\"featured-controls\"><button type=\"button\" id=\"featured-prev\" aria-label=\"Previous featured post\">←</button><span id=\"featured-count\" aria-live=\"polite\"></span><button type=\"button\" id=\"featured-next\" aria-label=\"Next featured post\">→</button></div></div><div class=\"feature-img\"><img id=\"featured-image\" src=\"\" alt=\"\"></div></section>");
const css = `\n#published-posts{display:none;padding:45px 0 8px}.posts-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:18px}.published-card{overflow:hidden;border:1px solid #ffffff18;border-radius:16px;background:linear-gradient(140deg,#171923,#10121b);transition:transform .2s,border-color .2s}.published-card:hover{transform:translateY(-3px);border-color:#f20d3266}.published-card img{display:block;width:100%;height:190px;object-fit:cover}.published-card-copy{padding:17px 19px 20px}.published-card h3{font-size:18px;line-height:1.65;margin:0 0 8px}.published-card p{font-size:14px;color:#b9bdc9;line-height:1.8;margin:0 0 14px}.published-card small{font:12px Onest,sans-serif;color:#9094a3}.published-card a{color:inherit;text-decoration:none}.write-link{display:inline-flex;align-items:center;border:1px solid #ffffff25;background:#ffffff08;border-radius:999px;padding:7px 12px;font:12px Onest,sans-serif;color:#d7d9e2;transition:background .2s}.write-link:hover{background:#ffffff15}`;
home = home.replace("</style>", css + `
.featured-controls{display:flex;align-items:center;gap:10px;margin-top:18px;color:#aeb1bf;font:12px Onest,sans-serif}.featured-controls button{width:34px;height:34px;border:1px solid #ffffff28;border-radius:50%;background:#ffffff0b;color:#fff;cursor:pointer;font-size:17px;transition:background .2s,transform .2s}.featured-controls button:hover{background:#f20d32;transform:translateY(-1px)}.featured-controls button:focus-visible{outline:2px solid #ff8095;outline-offset:3px}.featured-rotator #featured-image{transition:opacity .2s}.featured-rotator.changing #featured-image{opacity:.25}@media(prefers-reduced-motion:reduce){.featured-rotator #featured-image{transition:none}}` + css + "</style>");
home = home.replace('<div class="wrap content" id="article">', `<section id="published-posts" class="wrap"><div class="section-head"><h2>Community stories</h2><a class="write-link" href="/admin">စာရေးသူဝင်ရန်</a></div><div class="posts-grid" id="posts-grid"></div></section>\n<div class="wrap content" id="article">`);
const script = `<script>\nconst API_BASE=location.origin;(async()=>{const section=document.querySelector('#published-posts'),grid=document.querySelector('#posts-grid');try{const response=await fetch(new URL('/api/posts',API_BASE));if(!response.ok)return;const {posts=[]}=await response.json();if(!posts.length)return;section.style.display='block';for(const post of posts){const card=document.createElement('article'),a=document.createElement('a'),img=document.createElement('img'),copy=document.createElement('div'),h=document.createElement('h3'),p=document.createElement('p'),meta=document.createElement('small');card.className='published-card';a.href=new URL('/posts/'+encodeURIComponent(post.id),API_BASE);img.src=new URL(post.imageUrl,API_BASE);img.alt=post.title;img.loading='lazy';copy.className='published-card-copy';h.textContent=post.title;p.textContent=post.body.slice(0,180)+(post.body.length>180?'…':'');meta.textContent=new Date(post.publishedAt).toLocaleDateString('my-MM',{year:'numeric',month:'long',day:'numeric'});copy.append(h,p,meta);a.append(img,copy);card.append(a);grid.append(card)}}catch{}})();\n</script>`;
const featuredScript = `<script>(()=>{const builtIn=${JSON.stringify(staticPosts).replace(/</g,"\\u003c")};const rotator=document.querySelector('.featured-rotator'),title=document.querySelector('#featured-title'),excerpt=document.querySelector('#featured-excerpt'),image=document.querySelector('#featured-image'),link=document.querySelector('#featured-link'),date=document.querySelector('#featured-date'),tag=document.querySelector('#featured-tag'),count=document.querySelector('#featured-count'),prev=document.querySelector('#featured-prev'),next=document.querySelector('#featured-next');let items=[],index=0,timer;const labelDate=d=>new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});function render(){if(!items.length)return;const item=items[index];rotator.classList.add('changing');title.textContent=item.title;excerpt.textContent=item.excerpt;image.src=item.imageUrl;image.alt=item.title;link.href=item.href;date.textContent=labelDate(item.sortDate);tag.textContent='Featured · '+item.topic;count.textContent=(index+1)+' / '+items.length;window.setTimeout(()=>rotator.classList.remove('changing'),180)}function move(delta){index=(index+delta+items.length)%items.length;render()}function stop(){window.clearInterval(timer);timer=undefined}function start(){stop();if(items.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)timer=window.setInterval(()=>move(1),6500)}prev.addEventListener('click',()=>{move(-1);start()});next.addEventListener('click',()=>{move(1);start()});rotator.addEventListener('mouseenter',stop);rotator.addEventListener('mouseleave',start);rotator.addEventListener('focusin',stop);rotator.addEventListener('focusout',e=>{if(!rotator.contains(e.relatedTarget))start()});items=builtIn.map((p,i)=>({title:p.title,excerpt:p.excerpt,imageUrl:p.imageUrl,href:p.href,sortDate:Date.parse(p.date)||0,topic:i===0?'MacBook · Rumors':'AI · Explained'}));render();(async()=>{try{const r=await fetch(new URL('/api/posts',API_BASE));if(!r.ok)return;const {posts=[]}=await r.json();for(const p of posts)items.push({title:p.title,excerpt:p.body.slice(0,220),imageUrl:new URL(p.imageUrl,API_BASE).href,href:new URL('/posts/'+encodeURIComponent(p.id),API_BASE).href,sortDate:Date.parse(p.publishedAt)||0,topic:'TechNation · Latest'});items.sort((a,b)=>b.sortDate-a.sortDate);items=items.slice(0,3);index=0;render();start()}catch{start()}})();start()})();</script>`;
home = home.replace("</body>", script + featuredScript + "</body>");
const fluidEngine = await readFile(resolve(root, "site-content/fluid-simulation.js"), "utf8");
home = home.replace("</body>", `<script id="fluid-simulation">\n${fluidEngine}\n</script></body>`);
const blogTemplate = await readFile(resolve(root, "site-content/blog.html"), "utf8");
const blogHtml = blogTemplate.replace("__STATIC_POSTS__", JSON.stringify(staticPosts).replace(/</g, "\\u003c"));
const pagesRoot = resolve(root, "pages-build");
const pagesBase = "/TechNation";
const apiOrigin = "https://technation.hksh-yin.chatgpt.site";
await rm(pagesRoot, { recursive: true, force: true });
await mkdir(resolve(pagesRoot, "blog"), { recursive: true });
await mkdir(resolve(pagesRoot, "assets"), { recursive: true });
const toPagesHtml = html => html
  .replace(/const API_BASE=location\.origin/g, `const API_BASE="${apiOrigin}"`)
  .replace(/href="\/admin"/g, `href="${apiOrigin}/admin"`)
  .replace(/href="\/blog"/g, `href="${pagesBase}/blog/"`)
  .replace(/href="\/"/g, `href="${pagesBase}/"`)
  .replace(/\/assets\//g, `${pagesBase}/assets/`);
await writeFile(resolve(pagesRoot, "index.html"), toPagesHtml(home));
await writeFile(resolve(pagesRoot, "blog", "index.html"), toPagesHtml(blogHtml));
for (const filename of ["technation-mark.jpg", "ai-agent-security.jpg", "ai-agent-explainer.jpg", "macbook-ultra.jpg"]) {
  await copyFile(resolve(root, "site-content", filename), resolve(pagesRoot, "assets", filename));
}
await writeFile(resolve(pagesRoot, ".nojekyll"), "");
const cover = (await readFile(resolve(root, "site-content/macbook-ultra.jpg"))).toString("base64");
const logo = (await readFile(resolve(root, "site-content/technation-mark.jpg"))).toString("base64");
const aiSecurity = (await readFile(resolve(root, "site-content/ai-agent-security.jpg"))).toString("base64");
const aiExplainer = (await readFile(resolve(root, "site-content/ai-agent-explainer.jpg"))).toString("base64");
let worker = await readFile(resolve(root, "worker/server.template.js"), "utf8");
worker = worker.replace("__HOME_HTML__", JSON.stringify(home)).replace("__BLOG_HTML__", JSON.stringify(blogHtml)).replace("__COVER_BASE64__", JSON.stringify(cover)).replace("__LOGO_BASE64__", JSON.stringify(logo)).replace("__AI_SECURITY_BASE64__", JSON.stringify(aiSecurity)).replace("__AI_EXPLAINER_BASE64__", JSON.stringify(aiExplainer));
await writeFile(resolve(root, "worker/index.js"), worker);
console.log("Generated Worker source from TechNation home and archive pages, fluid simulation, and blog images.");

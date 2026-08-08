import { certificates } from "./images.js";
const filterChips = document.getElementById("filterChips");
const certGrid = document.getElementById("certGrid");
const featuredGrid = document.getElementById("featuredGrid");
const countEl = document.getElementById("count");
const timelineEl = document.getElementById("timeline");
const categories = ["All","Professional","Achievements","Skills"];
let activeCat = "All";
let activeList = [...certificates];
let viewerIdx = 0;
function renderChips(){
  filterChips.innerHTML = categories.map(c => `<button class="chip ${activeCat===c?'active':''}" data-cat="${c}">${c}</button>`).join("");
  filterChips.querySelectorAll(".chip").forEach(b=>{b.onclick=()=>{activeCat=b.dataset.cat; renderChips(); filterAndRender();};});
}
function filterAndRender(){
  activeList = activeCat==="All" ? [...certificates] : certificates.filter(x=>x.category===activeCat);
  countEl.textContent = activeList.length + " credentials";
  renderGrids(); renderTimeline();
}
function cardHTML(c,i){
  return `<div class="card" data-i="${i}"><div class="thumb"><img src="${c.img}" loading="lazy" alt="${c.title}"><span class="badge ${c.featured?'pro':''}">${c.category}</span><span class="date">${c.date}</span></div><div class="card-body"><h3>${c.title}</h3><small>${c.issuer}</small><div class="proof"><i>✓</i><span>${c.proof}</span></div></div></div>`;
}
function renderGrids(){
  const featured = certificates.filter(c=>c.featured);
  featuredGrid.innerHTML = featured.map((c)=>cardHTML(c, certificates.indexOf(c))).join("");
  certGrid.innerHTML = activeList.map((c)=>cardHTML(c, certificates.indexOf(c))).join("");
  document.querySelectorAll(".card").forEach(el=>{el.onclick=()=>openViewer(parseInt(el.dataset.i));});
}
function renderTimeline(){
  const sorted=[...activeList].sort((a,b)=>b.year-a.year);
  timelineEl.innerHTML = sorted.map(c=>`<div class="t-item ${c.featured?'pro':''}"><h4>${c.title}</h4><p>${c.issuer} • ${c.date}</p></div>`).join("");
}
const viewer = document.getElementById("viewer");
const vImg = document.getElementById("vImg");
const vTitle = document.getElementById("vTitle");
const vIssuer = document.getElementById("vIssuer");
const vOrg = document.getElementById("vOrg");
const vDesc = document.getElementById("vDesc");
const vProof = document.getElementById("vProof");
const vId = document.getElementById("vId");
function openViewer(idx){
  viewerIdx = idx;
  const c = certificates[idx];
  if(!c) return;
  vImg.src=c.img; vTitle.textContent=c.title; vIssuer.textContent=c.issuer; vOrg.textContent=c.issuer; vDesc.textContent=c.desc; vProof.textContent=c.proof; vId.textContent=c.vid;
  viewer.classList.remove("hidden");
  document.body.style.overflow="hidden";
}
function closeViewer(){ viewer.classList.add("hidden"); document.body.style.overflow=""; }
document.getElementById("closeViewer").onclick=closeViewer;
document.getElementById("prevBtn").onclick=()=>{ viewerIdx=(viewerIdx-1+certificates.length)%certificates.length; openViewer(viewerIdx); };
document.getElementById("nextBtn").onclick=()=>{ viewerIdx=(viewerIdx+1)%certificates.length; openViewer(viewerIdx); };
viewer.addEventListener("click",(e)=>{ if(e.target===viewer) closeViewer(); });
document.getElementById("shareBtn").onclick=async()=>{
  const data={title:"Vivek Tiwari - Credential Portfolio", text:"Check my verified certificates", url: location.href};
  try{ if(navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(location.href); alert("Link copied!"); } }catch{}
};
renderChips(); filterAndRender();

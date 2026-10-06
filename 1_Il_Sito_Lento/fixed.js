/*
 VERSIONE CORRETTA

 1) Promise.all(): le chiamate indipendenti partono insieme.
 2) slice(): usiamo solo i record che ci servono per la UI.
 3) DocumentFragment: costruiamo le card fuori dal DOM e facciamo una
    sola modifica importante alla pagina.

 In produzione la correzione migliore sarebbe anche lato server:
 paginazione + ricerca + select dei soli campi necessari.
*/

const API={profile:"./api/profile.json",stats:"./api/stats.json",offers:"./api/offerte.json"};
const VISIBLE=12;

async function getJson(url){
  const response=await fetch(url);
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function makeCard(offer){
  const card=document.createElement("article");
  card.className="offer-card";
  card.innerHTML=`
    <div class="offer-top"><b>${offer.company}</b><span>${offer.city}</span></div>
    <h3>${offer.title}</h3>
    <p>${offer.description}</p>
    <div class="offer-meta"><span>${offer.contract}</span><span>€ ${offer.salaryMin.toLocaleString("it-IT")}–${offer.salaryMax.toLocaleString("it-IT")}</span></div>`;
  return card;
}

function renderBetter(offers){
  const list=document.getElementById("offers");
  const fragment=document.createDocumentFragment();

  // La UI necessita solo di una porzione dell'array.
  offers.slice(0,VISIBLE).forEach(offer=>fragment.appendChild(makeCard(offer)));

  // Un'unica append sul DOM.
  list.replaceChildren(fragment);
}

async function init(){
  document.getElementById("loading-state").textContent="Caricamento dashboard…";

  // Le richieste sono indipendenti: partono contemporaneamente.
  const [profile,stats,offers]=await Promise.all([
    getJson(API.profile),getJson(API.stats),getJson(API.offers)
  ]);

  document.getElementById("candidate-name").textContent=`${profile.firstName} ${profile.lastName}`;
  document.getElementById("candidate-role").textContent=profile.role;
  document.getElementById("stat-applications").textContent=stats.newApplications;
  document.getElementById("stat-searches").textContent=stats.savedSearches;
  document.getElementById("stat-profile").textContent=`${stats.profileCompletion}%`;
  document.getElementById("stat-offers").textContent=stats.recommendedJobs;

  renderBetter(offers);
  document.getElementById("loading-state").textContent=`Dashboard pronta — ${VISIBLE} offerte visibili`;
}

document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("demo-form");
  form.addEventListener("submit",e=>{
    e.preventDefault();
    e.currentTarget.querySelector("button").textContent="Richiesta simulata ✓";
  });
  init().catch(err=>console.error(err));
});
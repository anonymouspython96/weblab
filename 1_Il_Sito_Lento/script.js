/*
 PERFORMANCE LAB — VERSIONE INTENZIONALMENTE INEFFICIENTE

 PROBLEMA A: OVERFETCHING
 La UI mostra 12 offerte, ma scarichiamo 600 record completi.
 In una vera app sarebbe meglio paginare/filtrare lato server e
 restituire solo i campi realmente necessari.

 PROBLEMA B: REQUEST SERIALI
 Gli endpoint profile, stats e offerte sono indipendenti ma vengono
 caricati uno dopo l'altro con await. Promise.all() può avviarli insieme.

 PROBLEMA C: LAYOUT THRASHING
 Inseriamo una card nel DOM e subito dopo leggiamo offsetHeight.
 La scrittura può invalidare il layout; la lettura può costringere
 il browser a calcolarlo prima di proseguire. Ripetuto molte volte,
 il costo cresce molto.

 Non usiamo sleep, busyWait o ritardi artificiali.
*/

const API = {
  profile: "./api/profile.json",
  stats: "./api/stats.json",
  offers: "./api/offerte.json"
};

const VISIBLE = 12;

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function makeCard(offer) {
  const card = document.createElement("article");
  card.className = "offer-card";

  // Template literal: costruiamo l'HTML usando i valori dell'oggetto.
  card.innerHTML = `
    <div class="offer-top"><b>${offer.company}</b><span>${offer.city}</span></div>
    <h3>${offer.title}</h3>
    <p>${offer.description}</p>
    <div class="offer-meta"><span>${offer.contract}</span><span>€ ${offer.salaryMin.toLocaleString("it-IT")}–${offer.salaryMax.toLocaleString("it-IT")}</span></div>
  `;
  return card;
}

function renderSlow(offers) {
  const list = document.getElementById("offers");
  list.textContent = "";

  // ERRORE: iteriamo su tutti i 600 record anche se ne servono 12.
  offers.forEach((offer, index) => {
    const card = makeCard(offer);
    list.appendChild(card);

    // Lettura di una proprietà di layout subito dopo una modifica DOM.
    // Può forzare un "reflow"/layout sincrono.
    const height = list.offsetHeight;
    card.dataset.heightCheck = height;

    // Nascondiamo i record eccedenti SOLO DOPO averli creati e misurati.
    if (index >= VISIBLE) card.hidden = true;
  });
}

function renderProfile(p) {
  document.getElementById("candidate-name").textContent = `${p.firstName} ${p.lastName}`;
  document.getElementById("candidate-role").textContent = p.role;
}

function renderStats(s) {
  document.getElementById("stat-applications").textContent = s.newApplications;
  document.getElementById("stat-searches").textContent = s.savedSearches;
  document.getElementById("stat-profile").textContent = `${s.profileCompletion}%`;
  document.getElementById("stat-offers").textContent = s.recommendedJobs;
}

async function init() {
  document.getElementById("loading-state").textContent = "Caricamento dashboard…";

  // ERRORE: 3 richieste indipendenti in sequenza.
  const profile = await getJson(API.profile);
  renderProfile(profile);

  const stats = await getJson(API.stats);
  renderStats(stats);

  const offers = await getJson(API.offers);

  document.getElementById("loading-state").textContent =
    `${offers.length} offerte ricevute. Rendering…`;

  renderSlow(offers);

  document.getElementById("loading-state").textContent =
    `Dashboard pronta — ${VISIBLE} offerte visibili`;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("demo-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    e.currentTarget.querySelector("button").textContent = "Richiesta simulata ✓";
  });

  init().catch(err => {
    console.error(err);
    document.getElementById("loading-state").textContent = "Errore di caricamento";
  });
});
/*
  MARIO ROSSI & FIGLI — BUG INTENZIONALE
  Demo didattica per il format "It's not a bug. It's a feature."
  La pagina introduce volutamente un Long Task JavaScript di ~4,2 secondi.
  Per il fix: cambia BUG_MODE da true a false.
*/
const BUG_MODE = false;
const BLOCK_MS = 4200;

function busyWait(ms) {
  const start = performance.now();
  let checksum = 0;
  while (performance.now() - start < ms) {
    checksum += Math.sqrt(Math.random() * 1000000);
  }
  return checksum;
}

function setMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const visible = nav.dataset.mobileOpen === 'true';
    nav.dataset.mobileOpen = String(!visible);
    nav.style.display = visible ? '' : 'flex';
    nav.style.position = 'absolute';
    nav.style.top = '82px'; nav.style.right = '12px'; nav.style.left = '12px';
    nav.style.padding = '14px'; nav.style.flexDirection = 'column';
    nav.style.background = 'rgba(246,244,237,.98)';
    nav.style.border = '1px solid rgba(23,32,28,.12)';
    nav.style.borderRadius = '18px';
  });
}

function wireForm() {
  const form = document.getElementById('demo-form');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    button.textContent = 'Richiesta simulata ✓';
    button.disabled = true;
  });
}

window.addEventListener('load', () => {
  if (BUG_MODE) busyWait(BLOCK_MS); // BUG: blocca il main thread.
  setMenu();
  wireForm();
});

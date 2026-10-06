# Mario Rossi & Figli — Performance Lab V2

Demo completamente fittizia per il format "It's not a bug. It's a feature."

## Problemi realistici volutamente introdotti

- Overfetching: 600 offerte JSON scaricate quando la UI ne mostra 12.
- Richieste seriali: profile → stats → offerte, anziché in parallelo.
- Layout thrashing: appendChild + lettura di offsetHeight in un loop.

Non ci sono busyWait, sleep o ritardi artificiali.

## Avvio

Dalla cartella del progetto:

    python -m http.server 8000

Poi apri:

    http://localhost:8000

## Test consigliato per il video

DevTools → Network:
- Disable cache ON
- filtro Fetch/XHR
- throttling: Fast 3G o Slow 3G
- Reload

Cerca `offerte.json`: osserva dimensione e durata.
Osserva anche che le tre richieste partono in sequenza.

DevTools → Performance:
- CPU 4× slowdown
- Record → Reload → Stop
- cerca Scripting / Recalculate Style / Layout / Long Tasks

Non aprire Response, Payload, Headers o Cookies durante una registrazione: questo progetto non ne ha bisogno.

## Fix

Sostituisci script.js con fixed.js.

La versione corretta:
- usa Promise.all()
- usa slice() per la parte mostrata
- usa DocumentFragment

In un backend reale, il fix migliore sarebbe paginazione/filtri lato server e risposta con soli campi necessari.

## Ripasso JS

Commenti inclusi su async/await, fetch, Promise.all, forEach, slice, createElement, appendChild, replaceChildren, DocumentFragment, dataset, offsetHeight, template literals, try/catch e DOMContentLoaded.

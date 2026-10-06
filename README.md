# Mario Rossi & Figli — demo

Sito dimostrativo per contenuti "It's not a bug. It's a feature.".
Azienda, contatti, numeri e contenuti sono fittizi.

## Demo del bug
1. Apri `index.html`.
2. DevTools → Performance.
3. Record.
4. Reload.
5. Stop.

Nel trace dovresti vedere un Long Task / blocco di scripting di circa 4,2 secondi.

## Fix
Usa `fixed.js` al posto di `script.js`, oppure modifica `BUG_MODE` in `script.js` da `true` a `false`.

## Avvio locale
Dalla cartella:

`python -m http.server 8000`

Poi apri `http://localhost:8000`.

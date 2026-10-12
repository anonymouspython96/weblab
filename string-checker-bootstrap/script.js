const s1Input = document.getElementById('string1');
const s2Input = document.getElementById('string2');
const caseSensitiveCheckbox = document.getElementById('caseSensitive');
const trimSpacesCheckbox = document.getElementById('trimSpaces');

const len1El = document.getElementById('len1');
const len2El = document.getElementById('len2');
const words1El = document.getElementById('words1');
const words2El = document.getElementById('words2');

const resultCard = document.getElementById('resultCard');
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const resultSubtitle = document.getElementById('resultSubtitle');

s1Input.addEventListener('input', checkStrings);
s2Input.addEventListener('input', checkStrings);
caseSensitiveCheckbox.addEventListener('change', checkStrings);
trimSpacesCheckbox.addEventListener('change', checkStrings);

function checkStrings() {
    let str1 = s1Input.value;
    let str2 = s2Input.value;

    len1El.textContent = `Lunghezza: ${str1.length}`;
    len2El.textContent = `Lunghezza: ${str2.length}`;

    const words1 = str1.trim() === '' ? 0 : str1.trim().split(/\s+/).length;
    const words2 = str2.trim() === '' ? 0 : str2.trim().split(/\s+/).length;
    words1El.textContent = `Parole: ${words1}`;
    words2El.textContent = `Parole: ${words2}`;

    if (str1 === '' && str2 === '') {
        setIdleState();
        return;
    }

    if (trimSpacesCheckbox.checked) {
        str1 = str1.trim();
        str2 = str2.trim();
    }

    let match = false;
    if (caseSensitiveCheckbox.checked) {
        match = (str1 === str2);
    } else {
        match = (str1.toLowerCase() === str2.toLowerCase());
    }

    if (match) {
        setEqualState();
    } else {
        setDifferentState();
    }
}

function setIdleState() {
    resultCard.className = "custom-card p-4 shadow-lg transition-all";
    resultIcon.className = "p-3 rounded-3 bg-secondary text-light d-flex align-items-center justify-content-center shadow";
    resultIcon.innerHTML = `<i class="bi bi-info-circle fs-3"></i>`;
    resultTitle.textContent = "In attesa di input...";
    resultTitle.className = "h6 fw-bold text-light mb-1";
    resultSubtitle.textContent = "Inserisci del testo in entrambe le caselle per iniziare il confronto.";
}

function setEqualState() {
    resultCard.className = "custom-card p-4 shadow-lg transition-all border-success bg-success bg-opacity-10";
    resultIcon.className = "p-3 rounded-3 bg-success text-white d-flex align-items-center justify-content-center shadow";
    resultIcon.innerHTML = `<i class="bi bi-check-lg fs-3"></i>`;
    resultTitle.textContent = "Le stringhe sono UGUALI! ✓";
    resultTitle.className = "h6 fw-bold text-success mb-1";
    resultSubtitle.textContent = "Il testo e i caratteri corrispondono esattamente in base ai criteri selezionati.";
}

function setDifferentState() {
    resultCard.className = "custom-card p-4 shadow-lg transition-all border-danger bg-danger bg-opacity-10";
    resultIcon.className = "p-3 rounded-3 bg-danger text-white d-flex align-items-center justify-content-center shadow";
    resultIcon.innerHTML = `<i class="bi bi-x-lg fs-3"></i>`;
    resultTitle.textContent = "Le stringhe sono DIVERSE! ✗";
    resultTitle.className = "h6 fw-bold text-danger mb-1";
    resultSubtitle.textContent = "I testi inseriti differiscono per uno o più caratteri.";
}

function clearInput(id) {
    document.getElementById(id).value = '';
    checkStrings();
}

function swapStrings() {
    const temp = s1Input.value;
    s1Input.value = s2Input.value;
    s2Input.value = temp;
    checkStrings();
}

function copyComparison() {
    const isMatch = resultTitle.textContent.includes("UGUALI");
    const isIdle = resultTitle.textContent.includes("attesa");

    let textToCopy = isIdle ? "Nessun confronto attivo." : (isMatch ? "Esito: Le stringhe sono UGUALI." : "Esito: Le stringhe sono DIVERSE.");
    textToCopy += `\nStringa 1: "${s1Input.value}"\nStringa 2: "${s2Input.value}"`;

    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        const copyBtnText = document.getElementById('copyText');
        copyBtnText.textContent = "Copiato!";
        setTimeout(() => { copyBtnText.textContent = "Copia Esito"; }, 2000);
    } catch (err) {
        console.error('Errore durante la copia', err);
    }
    document.body.removeChild(textarea);
}
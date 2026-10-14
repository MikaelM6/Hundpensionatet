// Del 1: Öppet just nu
const klockaEl = document.querySelector("#klocka");
const datumEl = document.querySelector("#datum");
const statusEl = document.querySelector("#oppet-status");

// Öppettider: dag (0 = söndag, 1 = måndag ... 6 = lördag)
// Varje dag är { opens, closes } i hela timmar, eller null om stängt.
const OPPETTIDER = [
  null,
  { opens: 7, closes: 18 },
  { opens: 7, closes: 18 },
  { opens: 7, closes: 18 },
  { opens: 7, closes: 18 },
  { opens: 7, closes: 18 },
  { opens: 9, closes: 14 },
];

function formaTid(datum) {
  const timme = String(datum.getHours()).padStart(2, "0");
  const minut = String(datum.getMinutes()).padStart(2, "0");
  const sekund = String(datum.getSeconds()).padStart(2, "0");
  return `${timme}:${minut}:${sekund}`;
}

function arOppet(datum) {
  const tider = OPPETTIDER[datum.getDay()];
  if (!tider) {
    return false;
  }

  const timme = datum.getHours();
  return timme >= tider.opens && timme < tider.closes;
}

function uppdateraTid() {
  const nu = new Date();
  const oppet = arOppet(nu);
  const text = oppet ? "Öppet just nu" : "Stängt just nu";

  datumEl.textContent = nu.toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  klockaEl.textContent = formaTid(nu);

  if (statusEl.textContent !== text) {
    statusEl.textContent = text;
  }

  statusEl.classList.toggle("open", oppet);
  statusEl.classList.toggle("closed", !oppet)
}

uppdateraTid();                    // kör direkt, så man slipper "Laddar..."
setInterval(uppdateraTid, 1000);   // och sedan varje sekund

// Del 2: Bokningsförfrågan
const formEl = document.querySelector("#bokningsform");
const hundEl = document.querySelector("#hundnamn");
const datumInputEl = document.querySelector("#datum-bokning");
const felEl = document.querySelector("#form-fel");
const listaEl = document.querySelector("#bokningslista");

class Bokningslista {
  constructor(key) {
    this.key = key;
    this.lista = this.load();
  }

  load() {
    const text = localStorage.getItem(this.key);
    if (!text) {
      return [];
    }

    try {
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  spara() {
    localStorage.setItem(this.key, JSON.stringify(this.lista));
  }

  laggTill(hund, datum) {
    this.lista.push({ id: Date.now(), hund, datum });
    this.spara();
  }

  taBort(id) {
    this.lista = this.lista.filter((item) => item.id !== id);
    this.spara();
  }
}

const bokningar = new Bokningslista("tassen-bokningar");

function ritaLista() {
  listaEl.textContent = "";

  if (bokningar.lista.length === 0) {
    const tom = document.createElement("li");
    tom.className = "empty";
    tom.textContent = "Du har inga förfrågningar än.";
    listaEl.append(tom);
    return;
  }

  bokningar.lista.forEach((item) => {
    const li = document.createElement("li");
    li.dataset.id = String(item.id);

    const text = document.createElement("span");
    text.textContent = `${item.hund} (${item.datum}) `;

    const knapp = document.createElement("button");
    knapp.type = "button";
    knapp.textContent = "Avboka";

    li.append(text, knapp);
    listaEl.append(li);
  });
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const hund = hundEl.value.trim();
  const datum = datumInputEl.value;

  if (hund === "") {
    felEl.textContent = "Skriv in hundens namn.";
    hundEl.focus();
    return;
  }

  if (datum === "") {
    felEl.textContent = "Välj ett önskat datum.";
    datumInputEl.focus();
    return;
  }

  felEl.textContent = "";
  bokningar.laggTill(hund, datum);
  ritaLista();
  formEl.reset();
});

listaEl.addEventListener("click", (event) => {
  const knapp = event.target.closest("button");
  if (!knapp) {
    return;
  }

  const li = knapp.closest("[data-id]");
  bokningar.taBort(Number(li.dataset.id));
  ritaLista();
});

ritaLista();

// Del 3: Omdömen

const omdomeTextEl = document.querySelector("#omdome-text");
const omdomePersonEl = document.querySelector("#omdome-person");
const nyttOmdomeKnapp = document.querySelector("#nytt-omdome");

const omdomen = [
  {
    namn: "Karin, ägare till Molly",
    text: "Min hund springer in genom grinden varje morgon. Det säger allt.",
  },

  {
    namn: "Johan, ägare till Bruno",
    text: "Trygg personal som verkligen ser varje hund.",
  },

  {
    namn: "Amina, ägare till Sixten",
    text: "Perfekt pensionat när vi var bortresta. Fick bilder varje dag.",
  },

  {
    namn: "Lars, ägare till Findus",
    text: "Klippkortet är smidigt och hunden kommer hem nöjd och trött.",
  },

  {
    namn: "Sofia, ägare till Stella",
    text: "Hämtning och lämning gör att vardagen funkar för oss.",
  },
];

let omdome = -1;

function visaOmdome() {
  let index = Math.floor(Math.random() * omdomen.length);

  while (omdomen.length > 1 && index === omdome) {
    index = Math.floor(Math.random() * omdomen.length);
  }

  omdome = index;
  omdomeTextEl.textContent = omdomen[index].text;
  omdomePersonEl.textContent = omdomen[index].namn;
}

nyttOmdomeKnapp.addEventListener("click", visaOmdome);

visaOmdome();

// Mobilmeny
const menyKnappEl = document.querySelector("#meny-knapp");
const menyEl = document.querySelector("#meny");

menyKnappEl.addEventListener("click", () => {
  const oppen = menyEl.classList.toggle("open");
  menyKnappEl.setAttribute("aria-expanded", String(oppen));
});

// Stäng menyn när man har klickat på en länk
menyEl.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menyEl.classList.remove("open");
    menyKnappEl.setAttribute("aria-expanded", "false");
  }
});
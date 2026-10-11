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
const klockaEl = document.querySelector("#klocka");
const datumEl = document.querySelector("#datum");
const statusEl = document.querySelector("#oppet-status");

// Del 1: Öppet just nu
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


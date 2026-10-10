const klockaEl = document.querySelector("#klocka");
const datumEl = document.querySelector("#datum");
const statusEl = document.querySelector("#oppet-status");

// Del 1: Öppet just nu
// Öppettider: dag (0 = söndag, 1 = måndag ... 6 = lördag)
// Varje dag är { open, closed } i hela timmar, eller null om stängt.
const OPPETTIDER = [
    null,                    // söndag
    { open: 7, closed: 18 }, // måndag
    { open: 7, closed: 18 }, // tisdag
    { open: 7, closed: 18 }, // onsdag
    { open: 7, closed: 18 }, // torsdag
    { open: 7, closed: 18 }, // fredag
    { open: 9, closed: 14 }, // lördag
];

function tvaSiffror(tal) {
    return String(tal).padStart(2, "0");
}

function uppdateraTid() {
    const nu = new Date(); // hämtas på nytt varje gång

    // Klocka
    const tid =
        tvaSiffror(nu.getHours()) + ":" +
        tvaSiffror(nu.getMinutes()) + ":" +
        tvaSiffror(nu.getSeconds());
    klockaEl.textContent = tid;

    // Datum
    datumEl.textContent = nu.toLocaleDateString("sv-SE", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    // Är det öppet?
    const tider = OPPETTIDER[nu.getDay()];
    const timme = nu.getHours();
    const arOppet = tider !== null && timme >= tider.open && timme < tider.closed;

    // 4. Visa status
    statusEl.textContent = arOppet ? "Öppet just nu" : "Stängt just nu";
    statusEl.classList.toggle("open", arOppet);
    statusEl.classList.toggle("closed", !arOppet);
}

uppdateraTid();                    // kör direkt, så man slipper "Laddar..."
setInterval(uppdateraTid, 1000);   // och sedan varje sekund


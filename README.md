# Hundpensionatet-Tassen

En webbplats för hunddagis och pensionatet Tassen. Sidan visar tjänster, priser och öppettider, låter besökaren skicka en bokningsförfrågan och visar omdömen från kunder.

## Så kör du projektet

Öppna `index.html` i webbläsaren, eller använd Live Server i VS Code (högerklicka på `index.html` och välj *Open with Live Server*). 

## Reflektion

Det svåraste var att få bokningslistan att fungera, eftersom flera delar måste hänga ihop: formuläret, arrayen, `localStorage` och att rita om listan. Jag lärde mig att alltid ändra arrayen först, spara och sedan rita om listan från arrayen. Jag lärde mig också att klockan måste hämta tiden på nytt varje sekund, annars står den still.

## En bugg jag fastnade på

Ibland blev omdömesrutan tom eller så byttes inte texten när jag klickade på knappen. Jag öppnade konsolen i DevTools (F12) och såg felet "Cannot read properties of undefined (reading 'text')". Jag skrev `console.log(index)` i funktionen och såg att `index` ibland blev 5, fast arrayen bara har index 0 till 4. Orsaken var att jag hade `+ 1` i `Math.random() * omdomen.length + 1`. Jag tog bort `+ 1` på båda raderna, och då fungerade det.

## Varför Flexbox och Grid

Jag använde Grid till tjänstekorten och sidfotens kolumner, eftersom där ska innehållet ligga i kolumner. På mobil byter jag till en kolumn i mediaqueryn. Jag använde Flexbox till headern, statusraden och raderna i bokningslistan, eftersom där ska saker ligga bredvid varandra på en rad. Med `flex-wrap: wrap` bryts de till flera rader när det inte finns plats.

## Varför forEach för bokningslistan

Jag valde `forEach` i `ritaLista()` eftersom jag vill göra något för varje bokning: skapa ett `li`, en text och en Avboka-knapp och lägga in dem i listan. Jag behöver ingen ny array tillbaka, så `map` passar inte. En vanlig `for`-loop fungerar också, men då måste jag skriva `lista[i]` hela tiden. Med `forEach` får jag varje bokning direkt som `item`, vilket är kortare och lättare att läsa.

## Scope och this

Jag använder `this` i klassen `Bokningslista`, till exempel i metoden `taBort(id)`. När jag skriver `new Bokningslista("tassen-bokningar")` skapas ett objekt, och `this` i metoderna pekar på det objektet. Därför kan `this.lista` och `this.spara()` använda objektets egen lista. I `taBort` använder jag en pilfunktion i `filter`. Den har ingen egen `this`, utan hittar variabeln `id` utanför sig själv. Det kallas lexikal scope.

## Användning av AI

Jag har använt AI som hjälp. AI hjälpte till med namn, omdömen, texter och färgerna på sidan.
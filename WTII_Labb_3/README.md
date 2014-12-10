# Reflektion

#### Filer av intresse

1.[index.html](https://github.com/latana/-1DV449_ms223eq/blob/master/WTII_Labb_3/app/index.html)
2.[server.js](https://github.com/latana/-1DV449_ms223eq/blob/master/WTII_Labb_3/server.js)
3.[googlemaps.js](https://github.com/latana/-1DV449_ms223eq/blob/master/WTII_Labb_3/app/js/googlemap.js)
4.[markbox.js](https://github.com/latana/-1DV449_ms223eq/blob/master/WTII_Labb_3/app/js/markerBox.js)

**Vad finns det för krav du måste anpassa dig efter i de olika API:erna?**

**Sveriges Radios:** Systemet får inte använda apiet för att på något sätt skada Sveriges Radio. Det finns inte
några begränsningar för antal anrop men de föredrar att man ska vara "snäll" mot deras api.

**Google:** Systemet får inte överskrida 25000 anrop under 90 dagar. Om det nu skulle bli så kontaktar google den ansvarige och talas vid om betalning.

**Hur och hur länga cachar du ditt data för att slippa anropa API:erna i onödan?**

- Från server.js  gör systemet ett anrop till Sveriges Radio varar 5 minut. Om datan den fått inte är den samma som den i sin cachade data betyder det att det blivit en uppdatering och sparar över i json-filen för att sedan presentera datan. Annars väntar systemet 5 minuter till.

**Vad finns det för risker med din applikation?**

- Systemet är starkt beroende av apierna. Sveriges radio finns det lite säkerhet i med cashningsstrategin och att det
  fortfarande finns en rolig karta men skulle google mot förmodan gå ner så finns det ingenting som hanterar detta och
  jag har en ganska tråkig webbplatts som inte gör någonting alls.

**Hur har du tänkt kring säkerheten i din applikation?**

- Om elak data skulle komma in från Sveriges Radio så spelar det ingen roll då jag skriver ut med textContent.
Min google infowindow blev det lite krongligare, jag implementerade en funktion som ser till så att scriptet inte exikveras.
Det blir inte vidare snygg på webbplattsen men systemet är skyddat.

**Hur har du tänkt kring optimeringen i din applikation?**

- Alla Js och css filer har jag minifierat och unglyfierat för att få lite snabbare prestanda. 
- Jag har gjort så gott jag kan för att inte göra några onödiga förfrågningar.
- När jag sätter ut lyssnare så ser jag till att det skapas just bara de som krävs. I tidigare testning då jag gjorde en ny förfrågan varje minut så skapas nya lyssnare varje gång det kom ut ny data vilket tog hårt på prestandan efter 5 minuter.
- Javascripten läses in sist i min html fil.

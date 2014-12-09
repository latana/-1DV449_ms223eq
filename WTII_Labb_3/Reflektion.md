# Reflektion

**Vad finns det för krav du måste anpassa dig efter i de olika API:erna?**

**Sveriges Radios:** Systemet får inte använda apiet för att på något sätt skada Sveriges Radio. Det finns inte
några begränsningar för antal anrop men de föredrar att man ska vara "snäll" mot deras api.

**Google:** Systemet får inte överskrida 25000 anrop under 90 dagar. Om det nu skulle bli så kontaktar google den ansvarige
och talas vid om betalning.

**Hur och hur länga cachar du ditt data för att slippa anropa API:erna i onödan?**

- Var 5 minut gör systemet ett anrop och om datan den fått inte är den samma som det i sin cachade data 
betyder det att det blivit en uppdatering och presenterar denna datan. Annars väntar systemet 5 minuter till.

**Vad finns det för risker med din applikation?**

- Systemet är starkt beroende av apierna.

**Hur har du tänkt kring säkerheten i din applikation?**

- Om elak data skulle komma in från Sveriges Radio så spelar det ingen roll då jag skriver ut med textContent.
Det blir inte vidare snygg på webbplattsen men den exikveras inte.


- All javascript som kan skriva i href länkarna ignoreras.

**Hur har du tänkt kring optimeringen i din applikation?**

- Minifiera filerna
- Inga onödiga anrop.
- Skapa endast lyssnare som krävs.

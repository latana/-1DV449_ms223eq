GameScore
================

**Inledning:**GameScore är en webbplats där användare ska kunna göra en sökning på olika electroniska spel och får tillbaka information om spelet de sökt på. Tanken var att jag ska lägga ihop deras betyg och även skapa en top 5 lista. Listan uppdateras efterhand som användarna söker på spel.

**Filer av intresse**
1. [server.js](https://github.com/latana/-1DV449_ms223eq/blob/master/WTII_Projekt/GameScore/server.js)
2. [renderMashup.js](https://github.com/latana/-1DV449_ms223eq/blob/master/WTII_Projekt/GameScore/app/js/renderMashup.js)
3. [index.html](https://github.com/latana/-1DV449_ms223eq/blob/master/WTII_Projekt/GameScore/app/index.html)
4. [manifest.appcache](https://github.com/latana/-1DV449_ms223eq/blob/master/WTII_Projekt/GameScore/app/manifest.appcache)


**Tänkta apier:**

1. [ign](http://se.ign.com/)
2. ~~giantbomb~~
3. ~~[metacritic](http://www.metacritic.com/)~~
4. [imdb](http://www.imdb.com/) [api](http://www.omdbapi.com/)

**Språk och tekniker** Jag använder mig ut av Node.js Javascript, web sockets och som databas använde jag mig ut av mongo.

[Diagram över dataflödet.](https://github.com/latana/-1DV449_ms223eq/issues/1)

**Serversida:** När servern får svar från klienten, tar han emot en sträng. Det systemet gör är att kolla mot databasen om det finns någon titel som matchar sökningen. Skulle användaren skriva in "mass" så hämtar systemet alla 3 Mass Effect spelen. Om systemet hittar sina spel kontrolleras deras timestamp. Skulle någon av spelens timestamp gått ut så börjar systemet genast göra en sökning på ign. Det första apiet. Om alla spel är fräsha så skickas det till klienten. Ign's api är väldigt flexibelt och klarar av en sökning på lösa ord. Strängen skickas in och max 20 spel kan hämtas ut. Skulle deras api inte hitta något så skickar systemet ett meddelande till klienten. När systemet är klart så går den vidare till omdb. En lop startas och systemet skickar in alla speltitlar systemet hittat från ign. Omdb har inga användarvilkor som jag har hittat så jag förmodar att jag inte har någon begränsning. Systemet hämtar ut alla spel från omdb och alla titlar som matchar sätts ihop. Skulle omdb inte hitta någonting eller ingen titel matchar skickas ett meddelande till klienten. Nu när mashapen är klar så sparas den i databasen. Om spelet är helt nytt läggs den till och om den redan finns så uppdateras den. Därefter går systemet in i Top-5 listan och kontrollerar ifall någon av spelen redan finns,  Om det inte är fallet så läggs spelet till i listan. Den sorteras och bara de 5 översta plockas ut och sparas. Därefter så skickar systemet datan till klienten.

**Klientsidan:** Systemet väntar på att användaren ska trycka på knappen. När det sker kontrollerar systemet om det finns något innehåll i sökfältet. Om inte skickas ett meddelande ut till användaren. Annars skickas sökningen till servernsidan.
Systemet väntar sedan på information från servern och när den får svar kontrollerar den innehållet. Om datan är en enkel sträng betyder det att det blivit något fel och systemet har inte kunnat hitta någon information. Annars renderar systemet ut datan han har fått.

När användaren först navigerar till webplattsen frågar klienten om data för top 5 listan och för localStore. Skulle systemet inte få någon data renderas ingen top 5 lista ut och localStore förblir tom.

**Säkerhet och prestandaoptimering:** Eftersom jag använder mig ut av websockets för att läsa av knappen och det inte blir en riktig post kan inte någon användare spama i sökfältet utan en användare måste fysiskt gå in och trycka på knappen. Datan jag får ut från apierna kan inte exikveras då jag använder mig ut av textContent. Så även om jag får ut någon dålig data så exekveras den inte. När det gäller att få in dålig kod så så har jag inte hittat någon information om injections på mongo. Den enda kontakten användaren har med min databas är när systemet kontrollerar om spelet finns i databasen. Annars har ign's api visat sig vara riktigt välarbetat. Jag testade och skickade in ``<script> window.alert("test");</script>`` och fick till och med träffar tillbaka. När det gäller prestanda så har jag minifierat filerna. Den cashade datan hämtas från databasen istället för apierna för ett snabbare svar. Skulle någon söka runt efter sidor som inte finns eller systemt stöta på ett allvarligt fel så skickas användaren till felsidan. Något som drar ner på prestandan är att jag gör fler anrop mot imdb's api vilket göra sökningen lite slö när det inget hittas eller måste uppdateras i databasen. Jag hade kunnat ändra så att det bara blir ett anrop men då får också användaren bara ett resultat.

**Offline-first** Varje gång en användare besöker webbplatsen så sparas all data från databasen ner till localstore. Filerna sparas också ner på webbläsaren. När användaren är offline kan användaren söka på de titlar som finns i localstore. När detta sker så gör systemet användaren uppmärksam om att användaren är offline. Skulle användaren inte få några träffar så meddelar systemet att det inte finns i offline mode. När användaren är uppkopplad igen går systemet ur offline mode och webbplatsen återgår till sitt normala utseende. Filerna och bilderna sparas också ner i webbläsaren vilket också höjer prestandan.

**Egen Reflektion:** Det svåra med hela projektet var att välja apier och att bestämma sig för vilka man skulle använda sig av. Jag testade mycket mot giantbomb första men gav upp då deras api inte kunde uppfylla mina syften. Större delen av projektet använde jag mig de tre återstående apierna. Metacritic var det ända apiet som krävde en plattform parameter och var dessutom riktigt petig med sina sökningar. Mot den sista tiden bestämmde jag mig för att skrota metacritic och det var då jag upptäkte att igns api inte gav de träffar jag skrev in utan det första bästa de hittade. Så jag fick ändra mitt anrop och göra så att koden var flexibel med flera objekt då den innan bara hanterade ett. Detta är ett misstag som jag är glad att jag fick upptäcka då den gjorde hela min applikation roligare att arbeta med. Javascript är inte my cup of tea och jag har börjat så smått behärska det tillsammans med mongo.db men mycket kvarstår att lära sig. Det har varit intressant att använda sig ut av apier även om det mesta handlar om att arbeta "runt" apierna. En del av koden är rent ut sagt inte bra och håller inte riktigt i längden men pga tidsbrist och dålig kunskap får jag håll mig till de dåliga lösningarna. 

**Risker med din applikation:** En stor risk som när man alltid jobbar med apier är ifall något av apierna går ner. Jag ser apierna som en databas och ifall något av dem går ner finns det inte mycket jag kan göra för att min mashup ska bestå. Men om nu olyckan är framme så går jag mot mongo databasen. Användaren kan själv se hur fräsh datan är nederst på varje spel.
Så ifall båda apierna går ner så gör jag ett kall mot databasen då timestampen ignoreras.
Rent etniskt skulle jag vilja säga att jag är i gråzonen. Ja jag sparar ner data men den är modifierad och inte rå data. Oavsett så har ingen av apierna hävdat att jag inte får spara ner deras data.


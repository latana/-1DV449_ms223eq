# Laborationsrapport

## Steg 1. Säkerhetsbrister

#### Inloggning

**1**.Både username och password tar emot taggar.

* **Risk:** En ond användare skulle kunna skriva in javascript och window.location(www.opassande_webbplatts.com).
* **Lösning:** Använder mig ut av strip_tags() functionen i check.php för att ta bort taggar i username och password.

**2**.Man kan skriva vad som helst. Systemet kontrollerar inte username och password.
* **Risk** Vem som helst kan logga in.
* **Lösning** filen sec.php anropar en medtod som heter isUser. IsUser var satt i en if satts i check.php och behövde retunera en bool men retunerade i ett senario en sträng. Nu retunerar den bara en bool.

**3**. Man kan navigera till mess.php i url'en dirrekt utan att logga in.
* **Risk** Då tar man sig igenom login försvaret.
* **Lösning** Implementerade en if - satts som kontrollerar sessionen. Om den inte är satt så skickas man tillbaka till index.php

**4**. Kunde INTE logga in genom sessionsstöld.
* **Risk** En ond användare skulle kunna stjäla en session från en annan användare och logga in på det sättet.
* **Lösning** Man kan fortfarande inte göra en sessions stöld.

**5**. Värdena går direkt in i sql frågan. Systemet är motagligt för sql-injection.
* **Risk** En ond användare skulle kunna komma runt login frågan eller ta bort data från databasen.
* **Lösning** I sqlfrågan har jag gjort så att värdena finns som parametrar i en array som används under execute.
Inloggningen är inte längre mottaglig för sql-injection.

**6**. Lösenorden sparas i databasen i klartext.
* **Risk** Om det skulle bli en databas läcka så skulle förövaren kunna se alla lösenord. Nu är de lite mer skyddade.
Dessutom så är den skyddad mot mig.
* **Lösning** Lösningen blev att använda mig ut av "password_hash(lösenordet, PASSWORD_BCRYPT));".
Och skicka in det i databasen. Nu sparas inte lösenorden i klartext.


#### Skriva meddelande

**1**. Både namnfältet och kommentars fältet tar emot taggar.
* **Risk** En ond användare skulle kunna skriva in javascript med taggarna.
* **Lösning** Använder mig ut av strip_tags på värdena i $_Get förfrågorna.

**2**. Både namnfältet och kommentars fältet tar emot whitespace.
* **Risk** Så att tråkiga användare inte ska kunna lägga upp tomma poster.
* **Lösning** Använder mig ut av trim och sedan en if - satts i post.php för att controllera så att det finns några värden. I så fall return false.

**3**. Inserten till databasen är inte skyddad mot sql injection.
* **Risk** En ond användare skulle kunna påverka all data i databasen.
* **Lösning** I sqlfrågan har jag gjort så att värdena finns som parametrar i en array som används under execute.
message är inte längre mottaglig för sql-injection.

**4**. Man kan posta inlägg via url'en.
* **Risk** En ond användare eller ett system skulle kunna komma in och spamma chatten med inlägg eller tillföra oönskade handlingar.
* **Lösning** Lade till en token så som endast kommer ut när man trycker på knappen. För att förhindra chrossscripting.

#### Övrigt

**1**. Man kan ladda ner db.db om man skriver in sökvägen till db.db i url'en.
* **Risk** Vem som helst kan ladda ner databasen och använda sig av en rainbowtable. 
* **Lösning** Kollade upp men hittade inget på mitt webbhotel.

## Steg 2. Optimering

1. En bild länkas in till body i mess.php html. Denna syns inte och därför beslutar jag att ta bort den.

2. I debug.php hittade jag kod som påverkade prestandan och som dessutom inte tillförde någon nytta.
   Jag tog beslutet att ta bort filen och anknytningen till den i systemet.

3. Css'en som fanns i mess.php och index.php har nu flyttats till vars sin css fil.

4. Både index.php och mess.php kallade på samma filer flera gånger. Nu kallar de på samma fil endast en gång.

5. filen "jquery.js" har redan en minivariant så jag tog bort den.

6. Jag minifierade css filen bootstrap detta gav runt 80kb mindre att hämta.

7. Tog bort bootstrap.js och jquery.js.


### Mätningar
####Index.php

* Jag har tagit bort css'en från index.php filen. Nu är den 20 milis snabbare men den hämta index.css som tar 145 milis.

* Bootstrap.css har jag gjort till en mini variant och går nu 200 milis snabbare.
* Eftersom bootstrap.js är borta så sparar jag 290 millis.

Totalt hämtar det nya systemet 150 kb mindre.

#### login

* mess.php tar 260 millis. I denna filen har jag tagit bort css'en. placerat alla javascript längst ner och tagit bort onödiga inlänkningar. Den är nu 110 millis "långsammare".
* longpoll.js är borta så där sparas 80 millis.
* getMessages har en förbättring på 80 millis. Kan detta på bero på PDO?

Totalt hämtar det nya systemet 2,8 kb MER

#### ladda om mess.php

* mess.php har en försämring på 10 millis.
* bootstrap.css har en förbättring på 150 millis eftersom den är minifierad.
* jquery har en förbättring på 217 millis eftersom den är minifierad.
* messageboard.js har en förbättring på 10 millis. messageboard har jag "lagt till" men metod. jag förmodar att det är pga en tillfällighet på webhotelet.
* script.js är borta vilket ger en förbättring på 316 millis.
* b.jpg är borta bildet ger en förbättring på 340 millis.

Totalt hämtar det nya systemet 700kb mer

#### Logga ut

* Jag har lagt till en sessionkiller.php som tar 90 millis att hämta.
* index.php har en förbättring på 80 millis.

Totalt hämtar det nya systemet 1kb mindre.

## Steg 3. Longpolling

Min longpolling börjar i messageBoard.js där getMessages anropar getMessages i get.php varje second. Efter varje
förfrågan så börjar servern kontrollera om det finns ny data att hitta i 20 seconder. Under den tiden så kontrollerar
systemet antalet inlägg från klienten mot databasen. Om databasens längd är större så skickar den ut de nya inlägget,
bryter loopen och presenterar det nya inlägget.

. Det är såklart kostsamt att skicka så många förfrågningar så ofta men det kanske var därför webbsocet blev
  en värdig ersättare.

### Optimering i Longpolling

Den första variationen av longpolling gjorde en anslutning mot databasen. Denna biten kan jag inte komma ifrån
men när systemet var medveten om att ny data ska presenteras så gjorde jag en ytterligare anslutning för att hämta
ut det senaste inlägget. Nu så använder jag mig ut av samma fråga.

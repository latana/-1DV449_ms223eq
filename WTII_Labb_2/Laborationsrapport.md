# Laborationsrapport

## Steg 1. Säkerhetsbrister

## Brister

#### Inloggning

1. Både username och password tar emot taggar.

2. Man kan skriva vad som helst. Systemet kontrollerar inte username och password.

3. Man kan navigera till mess.php i url'en dirrekt utan att logga in.

4. Kunde INTE logga in genom sessionsstöld.

5. Värdena går direkt in i sql frågan. Systemet är motagligt för sql-injection.

6. Lösenorden sparas i databasen i klartext.


#### Skriva meddelande

6. Både namnfältet och kommentars fältet tar emot taggar.

7. Både namnfältet och kommentars fältet tar emot whitespace.

8. Inserten till databasen är inte skyddad mot sql injection.


### Lösningar

#### Inloggning

1. Använder mig ut av strip_tags() functionen i check.php.

2. filen sec.php har en medtod som heter isUser. IsUser var satt i en if satts i check.php och behövde retunera en bool.

3. Implementerade en if - satts som kontrollerar sessionen. Om den inte är satt så skickas man tillbaka till index.php

4. Man kan fortfarande inte göra en sessions stöld.

5. Jag har gjort så att värdena finns som parametrar i en array som används under execute.

6. Lösningen blev att använda mig ut av "password_hash(lösenordet, PASSWORD_BCRYPT));".

#### Skriva meddelande

6. Använder mig ut av strip_tags på värdena i $_Get förfrågorna.

7. Använder mig ut av trim och en sedan en if - satts i post.php för att controllera så att det finns några värden.
i så fall return false;

8. Inserten till databasen är inte skyddad mot sql injection.

### Potentiell skada 

#### inlogning

1. En ond användare skulle kunna skriva in javascript och window.location(www.opassande_webbplatts.com).

2. Annars vet vi inte vem användaren är.

3. Då tar man sig igenom login försvaret.

4. En ond användare skulle kunna stjäla en session från en annan användare och logga in på det sättet.

5. En ond användare skulle kunna komma förbi login frågan eller ta bort data från databasen.
 
6. Om det skulle bli en databas läcka så skulle förövaren kunna se alla lösenord. Nu är de lite mer skyddade.
  Dessutom så är den skyddad mot mig själv.

#### Skriva meddelande

6. En ond användare skulle kunna skriva in javascript med taggarna.

7. Så att tråkiga användare inte ska kunna lägga upp tomma poster.

8. En ond användare skulle kunna påverka all data i databasen.


## Steg 2. Optimering

1. En bild länkas in till body i mess.php html. Denna syns inte och därför beslutar jag att ta bort den.

2. I debug.php hittade jag kod som påverkade prestandan och som dessutom inte tillförde någon nytta.

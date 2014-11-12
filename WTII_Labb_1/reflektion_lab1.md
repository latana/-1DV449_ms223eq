
### Frågor
    1. Vad tror Du vi har för skäl till att spara det skrapade datat i JSON-format?
    
    2. Olika jämförelsesiter är flitiga användare av webbskrapor. Kan du komma på fler 
        typer av tillämplingar där webbskrapor förekommer?
        
    3. Hur har du i din skrapning underlättat för serverägaren?
    
    4. Vilka etiska aspekter bör man fundera kring vid webbskrapning?
    
    5. Vad finns det för risker med applikationer som innefattar automatisk skrapning av webbsidor?
        Nämn minst ett par stycken!
        
    6. Tänk dig att du skulle skrapa en sida gjord i ASP.NET WebForms.
        Vad för extra problem skulle man kunna få då?
        
    7. Välj ut två punkter kring din kod du tycker är värd att diskutera vid redovisningen.
        Det kan röra val du gjort, tekniska lösningar eller lösningar du inte är riktigt nöjd med.
        
    8. Hitta ett rättsfall som handlar om webbskrapning. Redogör kort för detta.
    
    9. Känner du att du lärt dig något av denna uppgift?
    
    
### Svar

    1. Förmodligen för att Json är enkel och flexibel. Lätt att dela upp i objekt.
    
    2. https://torrentz.eu/, Gör sökning på andra sidor och skrapar länkarna om det blir en träff. 
    
    3. Jag skulle vilja säga att det är tvärrtom. Eftersom systemet är gjort i node.js så skrapas all
        information samtidigt.
    
    4. Man bör väl kolla så att det inte är någon privat eller känslig information man skrapar.
       Man borde inte skrapa sidor utan att ha deras tillstånd. Ta hänsyn till robot.txt och läsa igenom
       "Term of use".
       
    5. Det finns alltid en risk att sidan ändrar sin html struktur. Systemet måste vara vältestat så att
        inte oönskad eller känslig data skrapas. Om det är en stor skrapning eller om systemet skrapar på ett
        mindre bra sätt så kan det slöa ner servern.
    
    6. Varje gång man anropar så kräver ASP.NET-applikationen att man skickar med extra information för
        att behålla "state".
    
    7. Callback scopet och Interval. Hur man vet att skrapningen är klar.
    
    8. Pete Warden hade endast läst robot.txt och skrapade facebook på information för att hålla koll på folk
        från olika sociala nätverk. Detta växte och höll på tills facebook kontaktade honom och hotade med stämning.
        Som tur för honom klarade han sig undan. Är det kanske honom ni nämnt i föreläsningarna?
        Här är hans blog - 
        http://petewarden.com/2010/04/05/how-i-got-sued-by-facebook/
    
    9. Absolut!

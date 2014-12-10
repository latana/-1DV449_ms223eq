/**
 * Created by Latana on 2014-12-04.
 */
function createInfoString(message){

    var date = new Date(parseInt(message.createddate.replace("/Date(", "").replace(")/",""), 10));

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var milli = date.getTime();

    if(message.description == ''){
        message.description = "Information saknas";
    }
    if(message.exactlocation == ''){
        message.exactlocation = "Information saknas";
    }
    if(day < 10){
        day = '0' + day;
    }

    var infoString = "<div id='content'>"+
        "<div id='siteNotice'>"+
        "</div>"+
        "<h1 id='firstHeading' class='firstHeading'>"+striptaggs(message.title)+"</h1>"+
        "<h3>Kategori: "+striptaggs(message.subcategory)+"</h3>"+
        "<div id='bodyContent'>"+
        "<p>Beskrivning: "+striptaggs(message.description)+"</p>"+
        "<p>Datum : "+year +"-"+ month +"-"+ day+ " " + hour + ":" + min + "</p>"+
        "<p>Detaljerad beskrivning: "+ striptaggs(message.exactlocation)+ "</p>"+
        "</div>"+
        "</div>";

    return infoString;
}

function striptaggs (string){

    return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
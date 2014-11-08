/**
 * Created by Latana on 2014-11-05.
 */
var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

    var getTime = new Date();

    var year = getTime.getFullYear();
    var month = getTime.getMonth() + 1;
    var day = getTime.getDate();
    var hour = getTime.getHours();
    var min = getTime.getMinutes();

    if(day < 10){
        day = '0' + day;
    }
    var date = year +"-"+ month + "-" + day + " " + hour + ":" + min;

    var Json = {};
    Json.ScrapeDate = date;

    var url = 'http://coursepress.lnu.se/kurser/?bpage=1';
    pageScrape(url, Json);

    setTimeout(function(){

        fs.writeFile('done.json', JSON.stringify(Json, null, 4), function(err){

            console.log('done');
        });

    }, 30000);
});

function pageScrape(url, Json){

    var pageUrl = 'http://coursepress.lnu.se';
    request(url, function (error, response, html) {

        if (!error) {

            var $;
            $ = cheerio.load(html);

            $('.item-title a').filter(function () {

                var data = $(this);
                var name = data.html();
                var links = data.attr('href');

                if(links == undefined){
                    links = 'No information';
                }

                scrapeFromLink(links, Json);

                function scrapeFromLink(links, Json) {

                    request(links, function (error, response, html) {

                        if(!error) {
                            var $;
                            $ = cheerio.load(html);
                            var courseTitle = $('#header-wrapper h1 a').text();

                            if(courseTitle === undefined){
                                courseTitle = 'No Information';
                            }

                            var courseCode = $('#header-wrapper ul li').last().text();

                            if(courseCode == ''){
                                courseCode = 'No information';
                            }

                            Json[courseTitle] = {};

                            Json[courseTitle].title = courseTitle;

                            if(links !== "http://coursepress.lnu.se/") {
                                Json[courseTitle].link = links;
                            }

                            Json[courseTitle].code = courseCode;

                            var coursePlanLink = $('#navigation .sub-menu li a').filter(function(){

                                var data = $(this);
                                if(data.text().match("Kursplan")){
                                    var coursePlan = data.attr('href');

                                    if(coursePlan === undefined){
                                        coursePlan = 'No information';
                                    }

                                    Json[courseTitle].coursePlanLink = coursePlan;
                                }
                            });

                            var courseInfo = $('.entry-content p').text();

                            if(courseInfo == ''){
                                courseInfo = 'No Information';
                            }
                            Json[courseTitle].courseInfo = courseInfo;

                            var latestNews = $('#latest-post').parent().next().text();

                            if(latestNews === ''){
                                latestNews = 'No Information'
                            }
                            var latestTitle = $('.entry-header .entry-title').first().text();

                            if(latestTitle == ''){
                                lastTitle = 'No Information';
                            }

                            var publicher = $('.entry-header .entry-byline strong').first().text();

                            if(publicher == ''){
                                publicher = 'No Information';
                            }

                            var publichedDate = $('.entry-header .entry-byline').first().text();

                            if(publichedDate == ''){
                                publichedDate = 'No Information';
                            }

                            var dateResult = publichedDate.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/);

                            if(dateResult === null){

                                dateResult = 'No Information';
                            }
                            else{
                                Json[courseTitle].LatestNews = {

                                    NewsTitle: latestTitle,
                                    Publisher: publicher,
                                    Date: dateResult[0]
                                }
                            }
                        }
                    });
                }
            });
            var newUrl = $('#pag-top .next');
            newUrl = newUrl.attr('href');

            if (newUrl !== undefined) {

                pageUrl = pageUrl + newUrl;
                pageScrape(pageUrl, Json);
            }
        }
    });
}

function checkIfValidString(string){

    if(string === ''){
        return string = 'No information';
    }
    return string;
}

function setLastScrape(){

    var date = new Date();

    fs.writeFile('time.txt', JSON.stringify(Json, null, 4), function(err){

        console.log('done');
    });

}

function checkLastScrape(){


}

module.exports = router;

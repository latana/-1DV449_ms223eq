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
    var milli = getTime.getTime();


    if(day < 10){
        day = '0' + day;
    }
    var date = year +"-"+ month + "-" + day + " " + hour + ":" + min;
    var linkCount = 0;

    var Json = {};
    Json.ScrapeDate = date;

    var url = 'http://coursepress.lnu.se/kurser/?bpage=1';

    fs.readFile('CoursePress.json', function (err, data) {

        var writeToBrowser = function (data){
            res.write(data);
        };

        if (!data) {

            pageScrape(url, Json, linkCount, writeToBrowser);
            return;
        }

        var date = new Date().getTime();
        var content = JSON.parse(data);
        if (date - content.TimeStamp > 300000) {

            pageScrape(url,Json, linkCount, writeToBrowser);
        }
    });

});

function pageScrape(url, Json, linkCount, callback){

    var pageUrl = 'http://coursepress.lnu.se';

    request(url, function (error, response, html) {

        if (!error) {

            var $;
            $ = cheerio.load(html);

            $('.item-title a').filter(function () {

                var data = $(this);
                var name = data.html();
                var links = data.attr('href');

                if(links.match('/kurs')) {
                    linkCount ++;
                    scrapeFromLink(links, Json, linkCount, callback);
                }

                function scrapeFromLink(links, Json, linkCount, callback) {

                    var myRequest = {
                        url: links,
                            headers:{
                            "User-Agent": 'Måns Schütz'
                        }
                    };

                    request(myRequest, function (error, response, html) {

                        if(!error) {
                            var $;
                            $ = cheerio.load(html);
                            var courseTitle = $('#header-wrapper h1 a').text();

                            var courseCode = $('#header-wrapper ul li').last().text();

                            Json[checkIfValidString(courseTitle)] = {};

                            Json[courseTitle].title = checkIfValidString(courseTitle);

                            Json[courseTitle].code = checkIfValidString(courseCode);

                            var coursePlanLink = $('#navigation .sub-menu li a').filter(function(){

                                var data = $(this);
                                if(data.text().match("Kursplan")){
                                    var coursePlan = data.attr('href');

                                    Json[courseTitle].coursePlanLink = checkIfUndifined(coursePlan);
                                }
                            });

                            var courseInfo = $('.entry-content p').text();

                            Json[courseTitle].courseInfo = checkIfValidString(courseInfo);

                            var latestTitle = $('.entry-header .entry-title').first().text();

                            var publicher = $('.entry-header .entry-byline strong').first().text();

                            var publichedDate = $('.entry-header .entry-byline').first().text();

                            if(publichedDate == ''){
                                var dateResult = ['No Information'];
                            }
                            else{
                                var dateResult = publichedDate.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/);
                            }

                            Json[courseTitle].LatestNews = {

                                NewsTitle: checkIfValidString(latestTitle),
                                Publisher: checkIfValidString(publicher),
                                Date: dateResult[0]
                            }

                        }
                    });
                }
            });
            var newUrl = $('#pag-top .next');
            newUrl = newUrl.attr('href');

            if (newUrl !== undefined) {

                pageUrl = pageUrl + newUrl;

                pageScrape(pageUrl, Json, linkCount, callback);
            }
            else {

                var interval = setInterval(SaveToFile, 3000);
                    function SaveToFile () {

                        if (linkCount !== Object.keys(Json).length) {
                            return;
                        }
                        Json.NumberOfCourses = Object.keys(Json).length;
                        var milli = new Date().getTime();
                        Json.TimeStamp = milli;

                        fs.writeFile('CoursePress.json', JSON.stringify(Json, null, 4), function (err) {

                            callback(JSON.stringify(Json,null,4));
                            console.log('Saved to file');
                        });
                        clearInterval(interval);
                    }
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

function checkIfUndifined(data){

    if(data === undefined){
        return data = 'No information';
    }
    return data;
}

module.exports = router;

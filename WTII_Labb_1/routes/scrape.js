/**
 * Created by Latana on 2014-11-05.
 */
var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

    var url = 'http://coursepress.lnu.se/kurser/?bpage=1';
    pageScrape(url);
});

function pageScrape(url){

    var pageUrl = 'http://coursepress.lnu.se';
    request(url, function (error, response, html) {

        if (!error) {

            var $;
            $ = cheerio.load(html);

            $('.item-title a').filter(function () {

                var data = $(this);
                var name = data.html();
                var links = data.attr('href');
                console.log(links);
            });
            var newUrl = $('#pag-top .next');
            newUrl = newUrl.attr('href');

            if (newUrl !== undefined) {

                pageUrl = pageUrl + newUrl;
                pageScrape(pageUrl);
            }
        }
    });
}
module.exports = router;

const application = require("../models/application");

exports.index = function(req, res) {
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    } else {
      // If there are no errors, send the data to the browser as json
      res.json(found);
    }
  });
};

exports.scrape = function(req, res) {
  app.get("/scrape", function(req, res) {
    // Make a request for the news section of ycombinator
  // First, tell the console what server.js is doing
    console.log(
      "\n***********************************\n" +
        "Grabbing every Article Title and Description\n" +
        "from the NY Times homepage:" +
        "\n***********************************\n"
    );

    // Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
    request("https://www.nytimes.com/", function(error, response, html) {
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);

      // An empty array to save the data that we'll scrape
      var results = [];

      // With cheerio, find each p-tag with the "title" class
      // (i: iterator. element: the current element)
      $("article.story").each(function(i, element) {
        // Save the text of the element in a "title" variable
        var title = $(element).children("h2.story-heading").text().trim();
        var description = $(element).children("p.summary").text().trim();
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        if (title && description){
                  // Insert the data in the scrapedData db
          db.scrapedData.insert({
            title: title,
            description: description
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
        }
        // Save these results in an object that we'll push into the results array we defined earlier
      });

    res.send("Scrape Complete");
    });
  })
};

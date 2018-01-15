const express = require('express';)
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('views', path.join(__dirname, 'views'));

//set up handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: config.sessionKey, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(authCheck);

require('./routes')(app);

//Set up default mongoose connection
var configDB = require('./config/database');
mongoose.connect(configDB.url);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once("open", () => {
  console.log("Mongoose connection successful.");
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  })
});


// our module get's exported as app.
module.exports = app;



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
    if ($(element).children("p.summary").text()){
      results.push({ title: title, description: description });
    }  
    // Save these results in an object that we'll push into the results array we defined earlier
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});

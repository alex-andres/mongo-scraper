const saved = require("../models/saved");

exports.index = function(req, res) {
  saved.find()
    .where("saved")
    .equals(true)
    .then(function(dbSaved) {
      res.render("saved/saved", {
        layout: "main-saved",
        // trip: dbTrip
        saved: dbSaved
      });
    });
};

exports.createTrip = function(req, res) {
  // Add id from User onto req.body
  req.body.UserId = req.user.id;

  let newTrip = new saved(req.body);

  newTrip.save().then(function(dbPost) {
    res.json(dbPost);
  });
};

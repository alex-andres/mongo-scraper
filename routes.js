module.exports = (app)=>{

		// Our model controllers (rather than routes)
		var application = require('./routes/application');
		var saved = require('./routes/saved');

		app.use('/', application);
		app.use('/saved', saved);
		//other routes..
}
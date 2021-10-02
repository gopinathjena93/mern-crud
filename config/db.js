const mongoose = require('mongoose');

function connectDB() { 
	mongoose.connect('mongodb+srv://file-share:xb9LKiuBMZgZuscx@cluster0.hrjzu.mongodb.net/file-share?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	});

	const connection = mongoose.connection;
	connection.once('open',() => {
		console.log(`Mongo DB Database Connected`)
	}).catch(err => {
		console.log("Database connection Error");
	})
}	

module.exports = connectDB; 






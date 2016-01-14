var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	// username: {
	// 	type: String,
	// 	require: true,
	// 	unique: true,
	// 	dropDups: true
	// },
	email: {
		type: String,
		require: true,
		unique: true,
		dropDups: true
	}, 
	password: {
		type: String,
		require: true
	},
	points: {
		type: Number,
		default: 0
	},
	verified: {
		type: Boolean,
		default: false
	},
	latitude: {
		type: Number
	},
	longitude: {
		type: Number
	},
	created_at: {
		type: Date
	},
	updated_at: {
		type: Date
	}
});

userSchema.plugin(passportLocalMongoose);

userSchema.pre('save', function(next){
  var now = +new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;
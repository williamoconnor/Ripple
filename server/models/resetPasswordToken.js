var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var User = require('./user');

var resetSchema = new mongoose.Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		require: true,
		references: 'User'
	},
	token: {
		type: String,
		require: true
	},
	created_at: {
		type: Date
	},
	updated_at: {
		type: Date
	}
});

resetSchema.pre('save', function(next){
  var now = +new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

var ResetToken = mongoose.model('ResetToken', resetSchema);

module.exports = ResetToken;
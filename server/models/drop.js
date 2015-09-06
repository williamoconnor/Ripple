var mongoose = require('mongoose'),
	Schema = mongoose.Schema;;
var User = require('./user');

var dropSchema = new mongoose.Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		require: true,
		references: 'User'
	},
	stream_url: {
		type: String,
		require: true
	}, 
	soundcloud_track_id: {
		type: String,
		require: true
	},
	name: {
		type: String,
		require: true
	},
	artwork_url: {
		type: String
	},
	streamable: {
		type: Boolean,
		require: true
	},
	latitude: {
		type: Number,
		require: true
	},
	longitude: {
		type: Number,
		require: true
	},
	latitude_bottom: {
		type: Number,
		require: true
	},
	latitude_top: {
		type: Number,
		require: true
	},
	longitude_left: {
		type: Number,
		require: true
	},
	longitude_right: {
		type: Number,
		require: true
	},
	last_drop: {
		type: Schema.Types.ObjectId,
		references: 'Drop'
	},
	previous_dropper_ids: {
		type: [Schema.Types.ObjectId],
		require: true,
		references: 'User'
	},
	most_recent: {
		type: Boolean,
		require: true
	},
	created_at: {
		type: Date
	},
	updated_at: {
		type: Date
	}
});

var Drop = mongoose.model('Drop', dropSchema);

dropSchema.pre('save', function(next){
  var now = +new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

module.exports = Drop;
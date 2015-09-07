var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);

function encrypt (req, res, next) {
	if (req.body.confirmPassword && req.body.password != req.body.confirmPassword) {
		res.send("Passwords don't match");
	}
	else {
		req.body.password = bcrypt.hashSync(req.body.password, salt);
		if (req.body.newPassword) {
			req.body.newPassword = bcrypt.hashSync(req.body.newPassword, salt);
		}
		next();
	}
}

module.exports = encrypt;
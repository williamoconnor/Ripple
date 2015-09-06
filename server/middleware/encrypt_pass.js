var bcrypt = require('bcrypt-nodejs');

function encrypt (req, res, next) {
	if (req.body.confirmPassword && req.body.password != req.body.confirmPassword) {
		res.send("Passwords don't match");
	}
	else {
		req.body.password = bcrypt.hashSync(req.body.password);
		if (req.body.newPassword) {
			req.body.newPassword = bcrypt.hashSync(req.body.newPassword);
		}
		next();
	}
}

module.exports = encrypt;
var validator = require('email-validator');

function validate (req, res, next) {
	var valid = validator.validate(req.body.email);
	if (valid === true) {
		// check that it is .edu
		// var end = req.body.email.substr(req.body.email.length - 3);
		// if (end === 'edu') {
		// 	next();
		// }
		// else {
		// 	res.send('Invalid email. .edu address required');
		// }
		next();
	}
	else {
		res.send('Invalid email. Please provide a valid email address');
	}
}

module.exports = validate;
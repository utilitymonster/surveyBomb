var config = require('./config');
var crypto = require('crypto');

module.exports.obscure_password = function(password, salt){

	var iterations = config.iterations;
	var keylen = config.keylen;

	var buff = crypto.pbkdf2Sync(password, salt, iterations, keylen);
	var pw_crypt = Buffer(buff, 'binary').toString('base64');

	return pw_crypt;
}

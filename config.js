//Configuration Variable

var config = module.exports = {};
config.db_name = 'appSumo'; // database name
config.db_username = 'roots'; // your mysql username
config.db_password = 'root'; // your mysql password
config.port = 8000; 

//For Authentication. Change at own risk
config.iterations = 2500;
config.keylen = 512;
var Sequelize = require('sequelize');
var config = require('../config');

var username = config.db_username;
var password = config.db_password;
var db_name = config.db_name;
var sequelize = new Sequelize('mysql://'+username+':'+password+'@localhost/'+db_name);


var models = [
	'Admin',
	'Answer',
	'User',
	'Question',
	'QuestionOption'
	
];

models.forEach(function(model) {
	module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// describe relationships
(function(m) {

	m.Question.hasMany(m.QuestionOption);
	m.QuestionOption.belongsTo(m.Question);
	m.User.hasMany(m.Answer); 
	m.Answer.belongsTo(m.QuestionOption); 
	m.QuestionOption.hasMany(m.Answer);

})(module.exports);

// export connection
module.exports.sequelize = sequelize;
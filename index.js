var express = require('express');
var Sequelize = require('sequelize');
var formidable = require('formidable');
var Session = require('express-session');
var crypto = require('crypto');

var models = require('./models');
var config = require('./config');

var Answer = models.Answer;
var Admin = models.Admin;
var Question = models.Question;
var QuestionOption = models.QuestionOption;
var User = models.User;
var router = express.Router();

var iterations = 1000;
var keylen = 24; // bytes
var debug = false;

var app = express();

app.use(Session({
    secret: '3FA3-3A44-wfas3244',
    resave: true,
    saveUninitialized: true
}));

app.use(router);

app.use(express.static('js'));
app.use(express.static('css'));

function loadUser(req, res, next){

	if (req.session.user) { // User cookie already loaded
		next()
	}else{ // User cookie not loaded
		req.session.user = {};
		User.create().then(function(user){
			req.session.user = user.dataValues.id;
			next()
		});
	}

}

function restrict(req, res, next) {  // Function to restrict access
	if (req.session.admin || debug) {
    	next();
	} else {
    	req.session.error = 'Access denied!';
    	res.redirect('/login');
	}
}

var callback = function(err, key){
    var hexHash = Buffer(key, 'binary').toString('hex');
    
    User.findAll({where: {username: fields.username}}).then(function(user){
    	console.log(user);
    })
};

router.route('/') 
	
	.get(loadUser, function(req, res) { // Main page -- Ask a survey question
		
		res.on('error', function(error) {
			console.error(error);
		});

		res.sendFile(__dirname + '/views/index.html');
	})

	.post(function(req, res) {

		var form = new formidable.IncomingForm();

		form.parse(req, function(err, fields, files) {

			console.log(fields);
			var optionId = fields.option;
			QuestionOption.findOne({
				where: { id: optionId }
			}).then(function(this_option){
				console.log(this_option);
				Answer.create({userId: req.session.user}).then(function(answer){
					answer.setQuestionOption(this_option);
					res.redirect('/');
				})
			})
		});
	})

//Admin Restriction
app.get('/admin/*', restrict, function(req, res, next){
	next();
})

//Admin Dashboard
app.get('/admin/index', function(req, res){
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(__dirname + '/views/admin/index.html');
});

//Add or Edit Question
app.get('/admin/add/*', function(req, res){
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(__dirname + '/views/admin/add.html');
});


app.get('/logout', function (req, res) {
	req.session.destroy();
	res.redirect('/login');
});

app.get('/login', function(req, res){
	
	res.set('content-type','text/html');
	res.sendFile(__dirname + '/views/login.html');

})

app.post('/login', function(req, res){
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {

		var buff = crypto.pbkdf2Sync(fields.password, 'salt', iterations, keylen);
		var pw = Buffer(buff, 'binary').toString('hex');

		Admin.findOne({where: {name: fields.name, password: pw}}).then(function(admin){
			if(admin == undefined){
				res.redirect('login');
			}else{
				req.session.admin = {};
				req.session.admin = admin;
				res.redirect('/admin/index');
			}
		})

	});
})

//API

router.route('/api/user')

	.get(function(req, res){

		User.findAll({where: {id: req.session.user }, include: [{model: Answer, include: [{model: QuestionOption, include: [{model: Question}]}]}]}).then(function(user){
			if(user[0] == undefined){
				console.log('user not found');
			}else{

				var already_answered_question_ids = user[0].alreadyAnswered();
				var where = {};
				
				if(already_answered_question_ids.length > 0){
					where = {id:{not: already_answered_question_ids}};
				}

				Question.findAll({
					where: where, 
					order: [ Sequelize.fn( 'RAND' ),],
					include: {model: QuestionOption}
				}).then(function(questions){
    				user[0].dataValues.remainingQuestions = questions;
    				res.setHeader('Content-Type', 'application/json');
				    res.json(user);
    			})
			}
		})
	})

router.route('/api/questionOption/:id')
	.delete(function(req, res){
		QuestionOption.destroy({where: {id: req.params.id }},function(error,result){});
	})


router.route('/api/question')

	.post(function(req, res) {

		var form = new formidable.IncomingForm();

		form.parse(req, function(err, fields, files) {
			
			if(fields.id){ //Updating question and options
				Question.update(fields, { where: {id: fields.id} , include: [{model: QuestionOption}]}).then(function(){
					Question.findById(fields.id).then(function(question){
						for(i = 0; i < fields.questionOptions.length; i++){
							var qo = fields.questionOptions[i];

							if(qo.questionId == undefined){
								QuestionOption.create(qo).then(function(questionOption){
									questionOption.setQuestion(question);
								});		
							}else{
								QuestionOption.update({optionText: qo.optionText}, {where: {id: qo.id}});
							}
						}
					});
				})
			}else{ // Creating new question
				Question.create(fields, {include: [QuestionOption]});
			}
	    })
	})

	.get(function(req, res){

		Question.findAll({undefined, include: [{model: QuestionOption, include: [{model: Answer}]}]}).then(function(questions){
			for(k = 0; k < questions.length; k++){
				questions[k].calculateData();
			}
			res.send(questions);

		})
	})


router.route('/api/question/:id')

	.get(function(req, res){
		Question.findAll({where: {id: req.params.id }, include: [{model: QuestionOption}]}).then(function(question){
			res.send(question);
		})
	})

app.listen(config.port);


var sumoApp = angular.module('sumoApp', ['ngResource', 'ngRoute']);

sumoApp.config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
})



sumoApp.factory("User", function($resource) {
	var User = $resource('http://localhost:8000/api/user/:id', {id: '@id'}, {
		query: {
			method: 'GET',
			isArray: false,
			transformResponse: function(jsondata, header) {


				var data = angular.fromJson(jsondata);
				var users = {};
				users.list = [];

				angular.forEach(data, function(object){
					var temp = new User(object);
					
					users.list.push(temp);
				})


				return users;
			}
		}
	});

	return User;
});

sumoApp.factory("Question", function($resource, QuestionOption) {
	var Question = $resource('http://localhost:8000/api/question/:id', {id: '@id'}, {
		query: {
			method: 'GET',
			isArray: false,
			transformResponse: function(jsondata, header) {


				var data = angular.fromJson(jsondata);
				var questions = {};
				questions.list = [];

				angular.forEach(data, function(object){
					var temp = new Question(object);
					var list = [];
					angular.forEach(temp.questionOptions, function(qo){
						var this_question_option = new QuestionOption(qo);
						console.log(this_question_option);
						list.push(this_question_option);
					})
					temp.questionOptions = list;

					questions.list.push(temp);
				})

				return questions;
			}
		}
	});

	Question.prototype.newOption = function(){
		var temp = this;
		if(temp.questionOptions == undefined){
			temp.questionOptions = [];
		}
		var new_question_option = new QuestionOption();
		temp.questionOptions.push(new_question_option);
	}

	return Question;
});

sumoApp.factory("QuestionOption", function($resource) {
	var QuestionOption = $resource('http://localhost:8000/api/questionOption/:id', {id: '@id'}, {
		query: {
			method: 'GET',
			isArray: false,
			transformResponse: function(data, header) {

			}
		}
	});

	QuestionOption.prototype.delete = function(){
		var temp = this;
		temp.hide = true;
		temp.$delete();
	}


	return QuestionOption;
});
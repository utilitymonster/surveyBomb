module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('users', {
		ip: { type: DataTypes.STRING}
	}, {
		freezeTableName: true,
		associations: true,
		instanceMethods: {
    		alreadyAnswered : function() { 

    			var already_answered_question_ids = [];
    			var answers = this.answers;
    			for(i = 0; i < answers.length; i++){
    				var this_answer = answers[i];
    				already_answered_question_ids.push(this_answer.questionOption.questionId);
    			}

    			return already_answered_question_ids;

    		}
  		}
	});

	return User;

}
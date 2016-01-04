module.exports = function(sequelize, DataTypes) {

	return sequelize.define('questions', {
		question: { type: DataTypes.STRING },
	}, {
		freezeTableName: true,
		associations: true,
		instanceMethods: {
    		calculateData : function() {

    			var answersTotal = 0;
    			for(i = 0; i < this.questionOptions.length; i++){
    				var this_question_option = this.questionOptions[i];
    				answersTotal += this_question_option.answers.length;
    			}

    			for(i = 0; i < this.questionOptions.length; i++){
    				var this_question_option = this.questionOptions[i];
    				var answer_data = {
    					answers: this_question_option.answers.length,
    					total: answersTotal
    				};
    				this.questionOptions[i].dataValues.answer_data = answer_data;
    			}
    		}
  		}
	});
};
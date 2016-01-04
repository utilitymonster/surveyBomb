module.exports = function(sequelize, DataTypes) {

	return sequelize.define('questionOptions', {
		optionText: { type: DataTypes.STRING }
	}, {
	  freezeTableName: true
	});

};
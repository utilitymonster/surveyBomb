module.exports = function(sequelize, DataTypes) {

	return sequelize.define('answers', {}, {
		freezeTableName: true
	});

}
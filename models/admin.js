module.exports = function(sequelize, DataTypes) {

	return sequelize.define('admins', {
		name: { type: DataTypes.STRING },
		password: { type: DataTypes.STRING },
	}, {
  		freezeTableName: true
	});

}
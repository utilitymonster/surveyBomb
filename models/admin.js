module.exports = function(sequelize, DataTypes) {

	return sequelize.define('admins', {
		name: { type: DataTypes.STRING },
		password: { type: DataTypes.TEXT }, 
		salt: { type: DataTypes.TEXT } 
	}, {
  		freezeTableName: true
	});

}
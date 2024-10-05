//! npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string,username:string,password:string

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //^ Note that it's not necessary to define relationships here because the User model is on the 'one' side of the one-to-many relationships with other models in this database. The relationships (belongsTo) are already defined in the other model files. But it is good practice to define the relationships in both directions.
      User.hasMany(models.Spot, { foreignKey: 'ownerId' });
      User.hasMany(models.Booking, { foreignKey: 'userId' });
      User.hasMany(models.Review, { foreignKey: 'userId' });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

//! npx sequelize-cli model:generate --name Review --attributes userId:integer,spotId:integer,review:text,stars:integer

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, { foreignKey: 'userId' });
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
      Review.hasMany(models.Image, { foreignKey: 'reviewId' });
    }
  }
  Review.init({
    userId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER,
    review: DataTypes.TEXT,
    stars: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};

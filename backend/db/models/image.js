//! npx sequelize-cli model:generate --name Image --attributes spotId:integer,reviewId:integer,url:string,preview:boolean

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Spot, { foreignKey: 'spotId', allowNull: true });
      Image.belongsTo(models.Review, {foreignKey: 'ReviewId', allowNull: true})
    }
  }
  Image.init({
    spotId: DataTypes.INTEGER,
    reviewId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    preview: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};

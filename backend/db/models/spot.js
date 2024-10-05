//! npx sequelize-cli model:generate --name Spot --attributes ownerId:integer,address:string,city:string,state:string,country:string,lat:float,lng:float,name:string,description:text,price:float

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
      Spot.hasMany(models.Review, { foreignKey: 'spotId' });
      Spot.hasMany(models.Image, { foreignKey: 'spotId' });
    }

    // Calculate average rating
    async getAvgRating() {
      const reviews = await this.getReviews();
      if (!reviews.length) return null;

      const totalStars = reviews.reduce((acc, review) => acc + review.stars)
      return totalStars / reviews.length;
    }

    // fetch previewImage
    async getPreviewImage() {
      const images = await this.getImages({ where: { preview: true } });
      return images.length ? images[0] : null;
    }

    //^ Note that Sequelize provides built-in instancem ethods such as 'getReviews()' and 'getImages()' which are used in the methods defined above.
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

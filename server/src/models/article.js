"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      description: DataTypes.STRING,
      content: DataTypes.TEXT("long"),
      active: DataTypes.BOOLEAN,
      category_id: DataTypes.INTEGER,
      author_id: DataTypes.INTEGER,
      description_seo: DataTypes.STRING,
      title_seo: DataTypes.STRING,
      avatar: DataTypes.STRING,
      view: DataTypes.INTEGER,
      hot: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Article",
    }
  );
  return Article;
};

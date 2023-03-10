const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class ProductCategory extends Model {}

ProductCategory.init(
  { id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
    product_category_name: { 
      type: DataTypes.STRING(250), 
      allowNull: false,
    },
    product_category_image: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    product_category_gender_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'product_category_gender',
        key: 'id',
      },
  },
},
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_category',
  }
);

module.exports = ProductCategory;

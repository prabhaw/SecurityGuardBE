'use strict'
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('surcharge', {
    id: {
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    surcharge_hour: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.DATEONLY,
    },
  })
}

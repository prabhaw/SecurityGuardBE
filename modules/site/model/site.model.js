'use strict'
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'site',
    {
      id: {
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      acreage: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  )
}

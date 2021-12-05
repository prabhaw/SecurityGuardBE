'use strict'

module.exports = function (sequelize, DataTypes) {
  const Holiday = sequelize.define('holiday', {
    id: {
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    calendar_date: {
      type: DataTypes.DATEONLY,
    },
    name_holiday: {
      type: DataTypes.STRING(200),
    },
  })
  return Holiday
}

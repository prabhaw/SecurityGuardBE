'use strict'

module.exports = function (sequelize, DataTypes) {
  const Users = sequelize.define('user', {
    id: {
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      ser(val) {
        this.setDataValue('first_name', val.trim())
      },
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      set(val) {
        this.setDataValue('last_name', val.trim())
      },
    },

    password: {
      type: DataTypes.STRING(500),

      set(val) {
        this.setDataValue('password', val.trim())
      },
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      trim: true,
      unique: true,
      set(val) {
        this.setDataValue('email', val.toLowerCase().trim())
      },
    },
    role: {
      defaultValue: 'GUARD',
      type: DataTypes.ENUM('SUPERVISOR', 'GUARD', 'ADMIN'),
    },
    phone: {
      type: DataTypes.STRING(20),
    },
  })
  return Users
}

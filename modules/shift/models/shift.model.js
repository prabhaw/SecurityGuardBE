'use strict'

module.exports = function (sequelize, DataTypes) {
  const Shift = sequelize.define(
    'shift',
    {
      id: {
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      shift_number: {
        type: DataTypes.INTEGER(5),
      },
      start_time: {
        type: DataTypes.DATE,
      },
      end_time: {
        type: DataTypes.DATE,
      },
      shift_date: {
        type: DataTypes.DATEONLY,
      },
      user_id: {
        type: DataTypes.UUID,
      },
      is_holiday: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      on_leave: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      holiday_id: {
        type: DataTypes.UUID,
      },
      user_num: {
        type: DataTypes.INTEGER(5),
        defaultValue: false,
      },
      dayoff_id: {
        type: DataTypes.UUID,
      },

      site: {
        type: DataTypes.ENUM('A', 'B'),
      },
    },
    { underscored: true },
  )
  return Shift
}

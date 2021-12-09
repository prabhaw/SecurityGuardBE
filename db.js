'use strict'
const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'mysql',
  },
)

try {
  sequelize.authenticate()
  console.log('Connection to Database.')
} catch (error) {
  console.log('Unabel to connect to the database:', error)
}
const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.users = require('./modules/users/models/user.models')(sequelize, Sequelize)
db.shift = require('./modules/shift/models/shift.model')(sequelize, Sequelize)
db.holidays = require('./modules/holiday/model/holiday.model')(
  sequelize,
  Sequelize,
)
db.day_off = require('./modules/day_off/models/day_off.model')(
  sequelize,
  Sequelize,
)
db.surcharge = require('./modules/surcharge/surcharge.model')(
  sequelize,
  Sequelize,
)
db.shift.belongsTo(db.users)
db.users.hasMany(db.shift)
db.shift.belongsTo(db.holidays)
db.holidays.hasOne(db.shift)
db.shift.belongsTo(db.day_off)
db.day_off.hasMany(db.shift)
db.day_off.belongsTo(db.users)
db.users.hasOne(db.day_off)

module.exports = db

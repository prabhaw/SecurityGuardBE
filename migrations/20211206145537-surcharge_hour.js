'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('surcharges', {
      id: {
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      surcharge_hour: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      year: {
        type: Sequelize.DATEONLY,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      
    */
    return await queryInterface.dropTable('surcharges')
  },
}

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable(
      'dayoffs',
      {
        id: {
          defaultValue: Sequelize.UUID,
          type: Sequelize.UUID,
          allowNull: false,
          unique: true,
          primaryKey: true,
        },
        start_date: {
          type: Sequelize.DATEONLY,
        },
        end_date: {
          type: Sequelize.DATEONLY,
        },
        category: {
          type: Sequelize.STRING(200),
        },
        status: {
          type: Sequelize.STRING(200),
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,

          references: {
            model: 'users',
            key: 'id',
          },
        },
        accepted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
      },
      {
        underscored: true,
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return await queryInterface.dropTable('dayoffs')
  },
}

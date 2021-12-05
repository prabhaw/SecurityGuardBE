'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable(
      'shifts',
      {
        id: {
          defaultValue: Sequelize.UUID,
          type: Sequelize.UUID,
          allowNull: false,
          unique: true,
          primaryKey: true,
        },

        shift_number: {
          type: Sequelize.INTEGER(5),
        },
        start_time: {
          type: Sequelize.DATE,
        },
        end_time: {
          type: Sequelize.DATE,
        },
        shift_date: {
          type: Sequelize.DATEONLY,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,

          references: {
            model: 'users',
            key: 'id',
          },
        },
        holiday_id: {
          type: Sequelize.UUID,
          // allowNull: false,

          references: {
            model: 'holidays',
            key: 'id',
          },
        },
        dayoff_id: {
          type: Sequelize.UUID,
          references: {
            model: 'dayoffs',
            key: 'id',
          },
        },
        // holiday_id: {
        //   type: Sequelize.UUID,
        //   allowNull: false,
        //   references: {
        //     model: 'holidays',
        //     key: 'id',
        //   },
        // },
        site_id: {
          type: Sequelize.UUID,
        },
        is_holiday: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        user_num: {
          type: Sequelize.INTEGER(5),
        },
        on_leave: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        site: {
          type: Sequelize.ENUM('A', 'B'),
        },
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
      },
      { underscored: true },
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     *
     */
    return await queryInterface.dropTable('shifts')
  },
}

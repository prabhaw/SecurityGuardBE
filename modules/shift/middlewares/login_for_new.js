const Sequelize = require('sequelize')
const Op = Sequelize.Op
module.exports = function (data) {
  return {
    [Op.or]: [
      {
        [Op.and]: [
          { shift_date: data.shift_date },
          { shift_number: data.shift_number },
          {
            site_a_user1: data.site_a_user1 ? true : false,
          },
        ],
      },
      {
        [Op.and]: [
          { shift_date: data.shift_date },
          { shift_number: data.shift_number },
          {
            site_a_user2: data.site_a_user2 ? true : false,
          },
        ],
      },
      {
        [Op.and]: [
          { shift_date: data.shift_date },
          { shift_number: data.shift_number },
          {
            site_b_user1: data.site_b_user1 ? true : false,
          },
        ],
      },
      {
        [Op.and]: [
          { shift_date: data.shift_date },
          { shift_number: data.shift_number },
          {
            site_b_user2: data.site_b_user2 ? true : false,
          },
        ],
      },
    ],
  }
}

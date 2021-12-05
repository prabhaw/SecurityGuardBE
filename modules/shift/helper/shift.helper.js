const dayjs = require('dayjs')
module.exports = function (shift, ShiftDetail) {
  if (ShiftDetail.shift_number) {
    shift.shift_number = ShiftDetail.shift_number
  }

  if (parseInt(ShiftDetail.shift_number) === 1) {
    shift.start_time = dayjs(ShiftDetail.shift_date).add(6, 'hour').format()
    shift.end_time = dayjs(ShiftDetail.shift_date).add(14, 'hour').format()
  }
  if (parseInt(ShiftDetail.shift_number) === 2) {
    shift.start_time = dayjs(ShiftDetail.shift_date).add(14, 'hour').format()
    shift.end_time = dayjs(ShiftDetail.shift_date).add(22, 'hour').format()
  }
  if (parseInt(ShiftDetail.shift_number) === 3) {
    shift.start_time = dayjs(ShiftDetail.shift_date).add(22, 'hour').format()
    shift.end_time = dayjs(ShiftDetail.shift_date)
      .add(1, 'day')
      .add(6, 'hour')
      .format()
  }

  if (ShiftDetail.shift_date) {
    shift.shift_date = dayjs(ShiftDetail.shift_date).format('YYYY-MM-DD')
  }
  if (ShiftDetail.user_id) {
    shift.user_id = ShiftDetail.user_id
  }
  if (ShiftDetail.is_holiday || ShiftDetail.is_holiday === false) {
    shift.is_holiday = ShiftDetail.is_holiday
  }
  if (ShiftDetail.user_num) {
    shift.user_num = ShiftDetail.user_num
  }
  if (ShiftDetail.site) {
    shift.site = ShiftDetail.site
  }
  return shift
}

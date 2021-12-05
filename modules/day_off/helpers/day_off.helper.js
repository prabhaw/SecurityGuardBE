module.exports = function (dayOff, DetailsDayOff) {
  if (DetailsDayOff.start_date) {
    dayOff.start_date = DetailsDayOff.start_date
  }
  if (DetailsDayOff.end_date) {
    dayOff.end_date = DetailsDayOff.end_date
  }
  if (DetailsDayOff.category) {
    dayOff.category = DetailsDayOff.category
  }
  if (DetailsDayOff.status) {
    dayOff.status = DetailsDayOff.status
  }
  if (DetailsDayOff.user_id) {
    dayOff.user_id = DetailsDayOff.user_id
  }
  return dayOff
}

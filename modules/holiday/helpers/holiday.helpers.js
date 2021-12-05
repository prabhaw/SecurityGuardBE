module.exports = function (holiday, DetailsHoliday) {
  if (DetailsHoliday.calendar_date) {
    holiday.calendar_date = DetailsHoliday.calendar_date
  }
  if (DetailsHoliday.name_holiday) {
    holiday.name_holiday = DetailsHoliday.name_holiday
  }
  return holiday
}

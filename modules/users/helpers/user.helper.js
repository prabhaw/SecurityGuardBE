module.exports = function (user, userDetails) {
  if (userDetails.first_name) {
    user.first_name = userDetails.first_name
  }
  if (userDetails.last_name) {
    user.last_name = userDetails.last_name
  }
  if (userDetails.password) {
    user.password = userDetails.password
  }
  if (userDetails.email) {
    user.email = userDetails.email
  }
  if (userDetails.role) {
    user.role = userDetails.role
  }
  if (userDetails.phone) {
    user.phone = userDetails.phone
  }
  return user
}

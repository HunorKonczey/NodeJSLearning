const API_URL = "/api/"
const BANKS_URL = API_URL + "banks/"
const USER_BANKS_URL = BANKS_URL + "user/"
const TRANSACTION_URL = API_URL + "transactions/"
const STATIC_IMAGE_URL = API_URL + "uploads/banks"

module.exports = Object.freeze({
  MONGODB_URL: 'mongodb://localhost:27017/test',
  API_URL: API_URL,
  BANKS_URL: BANKS_URL,
  USERS_URL: API_URL + 'users/',
  TRANSACTION_URL: TRANSACTION_URL,
  USER_BANKS_URL: USER_BANKS_URL,
  STATIC_IMAGE_URL: STATIC_IMAGE_URL,
  SECRET_KEY: 'supetsecretkey,supetsecretkey,supetsecretkey:^#12'
})
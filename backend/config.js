/** Shared config for application. Can be required many places. */

require('dotenv');

const SECRET_KEY = process.env.SECRET_KEY || 'devsecretkey';

const PORT = +process.env.PORT || 3000;

const BCRYPT_WORK_FACTOR = 10;

const DB_URI = 
    process.env.NODE_ENV === 'test'
    ? 'postgresql:///wallstreetsim_test'
    : 'postgresql:///wallstreetsim'

module.exports = {
    BCRYPT_WORK_FACTOR,
    SECRET_KEY,
    PORT,
    DB_URI
};
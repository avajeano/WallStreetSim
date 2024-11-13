/** Shared config for application. Can be required many places. */

require('dotenv').config();

const PORT = +process.env.PORT || 3000;

const BCRYPT_WORK_FACTOR = 10;

const DB_URI = 
    process.env.NODE_ENV === 'test'
    ? 'postgresql:///wallstreetsim_test'
    : 'postgresql://postgres.klqvcaifsqtqftsqqiwi:databasesecretpassword1124@aws-0-us-west-1.pooler.supabase.com:6543/postgres'

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
    BCRYPT_WORK_FACTOR,
    SECRET_KEY,
    PORT,
    DB_URI
};
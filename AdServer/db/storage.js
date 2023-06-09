const SxtDBAdapter = require('../controllers/sxt-db-adapter')


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

let DBAdapter = null;
DBAdapter = new SxtDBAdapter();

module.exports = DBAdapter;
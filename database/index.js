const { Pool } = require("pg")
require("dotenv").config()
/* ***********
*   Connection Pool 
* SSL object needed for local testing of app 
* when using remote DB connection (lines 11 - 13)
* comment out for deployment
* ***********  */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

module.exports = pool;
require("dotenv").config();
const { Pool } = require("pg");

// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
// module.exports = new Pool({
//     host: process.env.HOST || "localhost", // or wherever the db is hosted
//     user: process.env.ROLE_NAME,
//     database: process.env.DATABASE,
//     password: process.env.ROLE_PASSWORD,
//     port: process.env.PORT || 5432, // The default port
// });

module.exports = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    // `postgresql://${process.env.ROLE_NAME}:${process.env.ROLE_PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`,
});

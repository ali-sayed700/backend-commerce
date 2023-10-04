// # mongoose
const mongoose = require("mongoose");

// # connected database
function DbConnection() {
  mongoose.connect(process.env.DB_URL).then((res) => {
    console.log(`DATABASE CONNECTED ${res.connection.host}`);
  });
  // .catch((err) => {
  //   console.log("DATABASE FAILED " + err);
  //   process.exit(1);
  // });
}

module.exports = DbConnection;

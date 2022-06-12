const express = require("express");
// const { open } = require("sqlite");
// const sqlite3 = require("sqlite3");
const path = require("path");

// const createAndAddDataToDatabase = require("./databaseData");

// let db;
// const dbPath = path.join(__dirname, "whatsapp.db");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

const initializeDBAndServer = async () => {
  try {
    // db = await open({
    //   filename: dbPath,
    //   driver: sqlite3.Database,
    // });

    console.log("DB connected...");
    app.listen(PORT, () => {
      console.log(`Server running at : http://localhost:${PORT}`);

      //   createAndAddDataToDatabase(db);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(-1);
  }
};

initializeDBAndServer();

app.get("/", (req, resp) => {
  resp.send({ hello: "Dammn Heroku is woking borrrr" });
});

const express = require("express");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Pusher = require("pusher");

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const createDatabaseAndData = require("./createDatabaseAndData.js");

let db;
const dbPath = path.join(__dirname, "whatsapp.db");

const pusher = new Pusher({
  appId: "1422273",
  key: "b56383faa5c5cb36c00f",
  secret: "5822e876b387c9f82540",
  cluster: "ap2",
  useTLS: true,
});

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
const PORT = process.env.PORT || 5000;

const initializeDBAndServer = async () => {
  try {
    db = await sqlite.open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    createDatabaseAndData(db);

    console.log("DB connected...");
    app.listen(PORT, () => {
      console.log(`Server running at : http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(-1);
  }
};

initializeDBAndServer();

// MIDDLE WARES
const authenticateAccessToken = (request, response, next) => {
  let jwtToken;
  const authHeaders = request.headers["authorization"];
  if (authHeaders !== undefined) {
    jwtToken = authHeaders.split(" ")[1];
  }

  if (jwtToken === undefined) {
    return response.status(401).send({ message: "No access" });
  }

  jwt.verify(jwtToken, "WHATSAPP", (err, user) => {
    if (err) {
      return response.status(401).send({ message: "No access" });
    } else {
      request.userDetails = user;
      next();
    }
  });
};

app.get("/", authenticateAccessToken, async (req, res) => {
  const getRoomsQuery = `
    SELECT 
        room_id AS roomId,
        room_name AS roomName
    FROM room;
    `;
  const rooms = await db.all(getRoomsQuery);
  res.send(rooms);
});

app.get(
  "/rooms/:roomId/messages",
  authenticateAccessToken,
  async (req, res) => {
    const { roomId } = req.params;
    const userId = req.userDetails.user_id;
    const getRoomQuery = `
        SELECT 
        room_id AS roomId,
        room_name AS roomName
    FROM room
    WHERE room_id == '${roomId}';
  `;
    const room = await db.get(getRoomQuery);

    const getMessagesQuery = `
                SELECT 
                message_id AS messageId,
                    message,
                    timestamp,
                    created_by AS createdBy,
                    name
                FROM message
                INNER JOIN user ON message.created_by == user.user_id
                WHERE room_id == '${roomId}'
                `;
    const messages = await db.all(getMessagesQuery);

    res.send({
      room,
      messages,
    });
  }
);

app.post(
  "/rooms/:roomId/messages/new",
  authenticateAccessToken,
  async (req, resp) => {
    const { message } = req.body;
    const { roomId } = req.params;

    const userId = req.userDetails.user_id;

    const insertMsgQuery = `
            INSERT INTO message(message, room_id, created_by)
            VALUES
                ('${message}', '${roomId}', '${userId}')
            `;
    const newMsg = await db.run(insertMsgQuery);

    const getMessageQuery = `
            SELECT 
            message_id AS messageId,
                message,
                timestamp,
                created_by AS createdBy,
                name
            FROM message
            INNER JOIN user ON message.created_by == user.user_id
            WHERE message_id == '${newMsg.lastID}'
            `;
    const lastMsg = await db.get(getMessageQuery);
    pusher.trigger("my-channel", "my-event", lastMsg);

    resp.send("Message Added");
  }
);

app.post("/users/new", async (req, res) => {
  const { username, password, name, profile } = req.body;

  const getUserQuery = `
    SELECT * FROM user WHERE username == '${username}'
    `;
  const dbUser = await db.get(getUserQuery);
  if (dbUser !== undefined) {
    return res.status(400).send({ message: "Username already exists" });
  }

  //   const hashedPassword = await bcrypt.hash(password, 10);
  const createUserQuery = `
          INSERT INTO user (name, profile, username, password)
          VALUES
              ('${name}', '${profile}', '${username}', '${password}')
          `;
  await db.run(createUserQuery);

  res.send({ message: "User Added" });
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;

  const selectUserQuery = `
    SELECT * FROM user WHERE username == '${username}'
  `;
  const dbUser = await db.get(selectUserQuery);

  if (dbUser === undefined) {
    return response.status(400).send({ message: "Invalid credentials" });
  }

  //   const isPasswordMatched = await bcrypt.compare(password, dbUser.password);

  const isPasswordMatched = password == dbUser.password;

  if (isPasswordMatched) {
    const payLoad = dbUser;
    const jwtToken = jwt.sign(payLoad, "WHATSAPP");

    return response.send({ jwtToken, userId: dbUser.user_id });
  } else {
    return response.status(400).send({ message: "Invalid credentials" });
  }
});

// Testing with initial app
app.get("/heroku", (req, resp) => {
  resp.send({ message: "Hello Heroku" });
});

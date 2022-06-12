const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const createAndAddDataToDatabase = require("./databaseData");

let db;
const dbPath = path.join(__dirname, "whatsapp.db");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("DB connected...");
    app.listen(PORT, () => {
      console.log(`Server running at : http://localhost:${PORT}`);

      createAndAddDataToDatabase(db);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(-1);
  }
};

initializeDBAndServer();

app.get("/heroku", (req, resp) => {
  resp.send({ hello: "Dammn Heroku is woking borrrr" });
});

app.get("/contacts", async (request, response) => {
  const user_id = 1;
  const getContactsQuery = `
    SELECT * FROM 
        user
    
        INNER JOIN contact 
        ON user.user_id == contact.contact_contact_id
    WHERE contact.contact_user_id == '${user_id}'
    
    `;

  const contacts = await db.all(getContactsQuery);
  response.send(contacts);
});

app.get("/contacts/:contactId", async (request, response) => {
  const userId = 1;
  const { contactId } = request.params;

  // validdate contact id
  // get contact id details
  // get messages list

  const selectUserQuery = `
    SELECT 
        user_id As userId,
        name,
        about,
        phone_number AS phoneNumber,
        profile_image As profileImage
    FROM user
        WHERE user_id == '${contactId}'
    `;
  const contact = await db.get(selectUserQuery);

  const getContactAndMyQuery = `
            SELECT 
                message_id AS messageId,
                message,
                date_time AS dateTime,
                (created_by == '${userId}') AS isUser
            FROM message
            WHERE created_by IN ('${userId}', '${contactId}')
            AND messaged_to IN ('${userId}', '${contactId}')
  `;

  const messages = await db.all(getContactAndMyQuery);

  response.send({ contact, messages });
});

app.post("/contacts/:contactId/", async (request, response) => {
  const userId = 1;
  const { contactId } = request.params;
  const { message } = request.body;

  if (message === undefined) {
    return response.status(400).send("Invalid message");
  }

  const createMessageQuery = `
    INSERT INTO message (message, created_by, messaged_to)
    VALUES
        ('${message}', '${userId}', '${contactId}')
    `;

  await db.run(createMessageQuery);
  return response.send("Message Added");
});

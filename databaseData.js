// users
const createUserTable = async (db) => {
  const createUserTableQuery = `
    CREATE TABLE user
    (   user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VAR(200),
        phone_number VAR(200) UNIQUE,
        about TEXT, 
        profile_image  TEXT
    )
    `;
  await db.run(createUserTableQuery);
  console.log("user table created");
};

const addUserData = async (db) => {
  const about = "Whatsapp Hey, I am using whatup";
  const profile_image =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhW0hzwECDKq0wfUqFADEJaNGESHQ8GRCJIg&usqp=CAU";
  const addUserDataQuery = `
    INSERT INTO user(name, phone_number, about, profile_image)
    VALUES
        ('naresh pp7', '12345', 'power with powerstar', '${profile_image}'),
        ('naa peru mukesh', '123456', '${about}', '${profile_image}'),
        ('9812345666', '123457', '${about}', '${profile_image}'),
        ('shaji', '123458', '${about}', '${profile_image}'),
        ('mahi', '123459', '${about}', '${profile_image}'),
        ('yash', '1234510', '${about}', '${profile_image}')
    `;
  db.run(addUserDataQuery);
  console.log("users addded");
};

// contacts
const createContactTable = async (db) => {
  const createTable = `
    CREATE TABLE contact (
        contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
        contact_user_id INT, 
        contact_contact_id INT)
    `;
  await db.run(createTable);
  console.log("Contact createed");
};

const addContactData = async (db) => {
  const addData = `
    INSERT INTO contact(contact_user_id , contact_contact_id)
    VALUES
        (1,2),
        (1,3),
        (1,4),
        (1,5)
    `;
  await db.run(addData);
  console.log("contact data added");
};

// createMessages
const createMessageTable = async (db) => {
  const createTableQuery = `
    CREATE TABLE message(
        message_id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        date_time DATETIME,
        created_by INTEGER NOT NULL,
        messaged_to INTEGER NOT NULL
    )
    `;
  await db.run(createTableQuery);
  console.log("message table created");
};

// add Messages
const addMessageData = async (db) => {
  const addMsgQuery = `
    INSERT INTO message(message, created_by, messaged_to)
    VALUES
        ("hii mawa ela unnav", 1, 2),
        ("rey mawa drink chddama", 1, 2),
        ("nee yabba reyy", 2, 1),
        ("fasfaffd", 1, 2),
        ("sadfa", 1, 2)
    `;
  await db.run(addMsgQuery);
  console.log("messaged data added");
};

// delete database;
const deleteDatabase = async (db) => {
  const deleteDatabaseQuery = `
    DROP TABLE user;
    Drop Table contact;
    `;

  await db.run(deleteDatabaseQuery);
  console.log("database delted");
};

const createAndAddDataToDatabase = async (db) => {
  //   createUserTable(db);
  //   createContactTable(db);
  //   addUserData(db);
  //   addContactData(db);
  //   deleteDatabase(db);
  //   createMessageTable(db);
  //   addMessageData(db);
};

module.exports = createAndAddDataToDatabase;

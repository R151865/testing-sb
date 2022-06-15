const createUserTable = async (db) => {
  const createUserTableQuery = `
    CREATE TABLE user (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        profile TEXT,
        username TEXT,
        password TEXT
    )
    `;
  await db.run(createUserTableQuery);
  console.log("user table created");
};

const insertUserData = async (db) => {
  const profile =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2-YsNuOMErx0pu9-ri-mrLK1SFTGL8LxAceTs6fKUDlgzImIcVdh3U3xDxwTKZz2FhTA&usqp=CAU";
  const insertUserDataQuery = `
    INSERT INTO user (name, profile, username, password)
    VALUES
        ('naresh', '${profile}', 'naresh', 'naresh'),
        ('shaji', '${profile}', 'shaji', 'shaji'),
        ('yash', '${profile}', 'yash', 'yash')
    
    `;
  await db.run(insertUserDataQuery);
  console.log("user data inserted");
};

const createRoomTable = async (db) => {
  const createRoomQuery = `
    CREATE TABLE room (
        room_id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_name TEXT,
        room_profile TEXT
    )
    `;
  await db.run(createRoomQuery);
  console.log("room Created");
};

const insertRoomData = async (db) => {
  const insertData = `
    INSERT INTO room(room_name)
    VALUES 
        ('Youth pp7'),
        ('Cricket Team'),
        ('Volley ball'),
        ('Chaddi gang')
    `;
  await db.run(insertData);
  console.log("data inserted into room");
};

const createMessageTable = async (db) => {
  const createMsgTable = `
    CREATE TABLE message(
        message_id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      
        room_id INTEGER NOT NULL,
        created_by INTEGER NOT NULL
    )
    `;
  await db.run(createMsgTable);
  console.log("message table created");
};

const insertMessages = async (db) => {
  const addMsgsDataQuery = `
    INSERT INTO message(message, room_id, created_by)
    VALUES
        ("heyyy text 1", 1, 2 ),
        ("heyyy text 2", 1, 1 ),
        ("heyyy text 3", 1, 3),
        ("heyyy tesxt 4", 2, 2),
        ("heyyy text 5", 3, 3)
    `;
  await db.run(addMsgsDataQuery);
  console.log("messages inserted");
};

const createDatabaseAndData = (db) => {
  //   createRoomTable(db);
  //   createUserTable(db);
  //   createMessageTable(db);
  //   insertRoomData(db);
  //   insertMessages(db);
  //   insertUserData(db);
};

module.exports = createDatabaseAndData;

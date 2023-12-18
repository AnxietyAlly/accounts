import Database from "better-sqlite3";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config({ path: "variables.env" });

const db = new Database(process.env.DB_PATH, { verbose: console.log });

function getToday() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  // This arrangement can be altered based on how we want the date's format to appear.
  let currentDate = `${day}-${month}-${year}`;
  console.log(currentDate); // "17-6-2022"
  return currentDate;
}

const tempResponse = {
  meta: {
    date: getToday(),
  },
  data: {
    message: "this route is not implemented yet",
  },
};

export async function getAllAccounts(req, res) {
  try {
    const stmnt = db.prepare("SELECT * FROM accounts");
    const rows = stmnt.all();
    const jsonToSend = {
      meta: {
        name: "Accounts",
        title: "All accounts",
        date: getToday(),
        originalUrl: `${req.originalUrl}`,
      },
      data: [],
    };
    for (let i = 0; i < rows.length; i++) {
      jsonToSend.data.push(`/accounts/id/${rows[i].id}`);
    }
    res.status(200).json(jsonToSend);
  } catch (err) {
    console.log(err);
  }
}

export async function getSingleAccount(req, res) {
  try {
    const params = [req.params.id];
    const stmnt = db.prepare(`SELECT * FROM accounts where id = ?`);
    const row = stmnt.get(params);
    const jsonToSend = {
      meta: {
        name: "Single account",
        title: "Specific account",
        date: getToday(),
        originalUrl: `${req.originalUrl}`,
      },
      data: row,
    };
    res.status(200).json(jsonToSend);
  } catch (err) {
    console.log(err);
  }
}

export async function getSingleAccountBasedOnEmail(req, res) {
  try {
    const params = [req.params.email];
    const stmnt = db.prepare(`SELECT * FROM accounts where email = ?`);
    const row = stmnt.get(params);

    const jsonToSend = {
      meta: {
        name: "Single account based on name",
        title: "Specific account based on name",
        date: getToday(),
        originalUrl: `${req.originalUrl}`,
      },
      data: row,
    };
    res.status(200).json(jsonToSend);
  } catch (err) {
    console.log(err);
  }
}

export async function makeNewAccount(req, res) {
  const body = req.body;

  const hashedPassword = await bcrypt.hash(body.password, 12);

  const stmnt = db.prepare(
    "INSERT INTO accounts (name, email, password) VALUES (?, ?, ?)"
  );
  if (
    !(
      body.name == null ||
      body.name == undefined ||
      body.email == null ||
      body.email == undefined ||
      body.password == null ||
      body.password == undefined
    )
  ) {
    if (!(body.name == "" || body.email == "" || body.password == "")) {
      try {
        stmnt.run(body.name, body.email, hashedPassword);
      } catch (err) {
        res.send(err);
      }
      res.send(
        `New row inserted with values name (${body.name}) and email (${body.email})`
      );
    } else {
      res.send("Values cannot be empty");
    }
  } else {
    res.send("One of the values was missing");
  }
}

export async function checkUserCredentials(name, email, password) {
  const sql = `
    select password
      from accounts
    where name = $name and email = $email
    `;
  const stmnt = db.prepare(sql);
  const row = stmnt.get({ name });
  if (row) {
    return bcrypt.compare(password, row.password);
  } else {
    // spend some time to "waste" some time
    // this makes brute forcing harder
    // could also do a timeout here
    await bcrypt.hash(password, 12);
    return false;
  }
}

// import bcrypt from 'bcrypt'
// import * as db from '../db'

async function getApiData(url) {
  try {
    let response = await fetch(url);
    let returnedResponse = await response.json();
    return returnedResponse;
  } catch (err) {
    console.error('Error: ', err);
  }
}

async function getAccounts() {
  let accountsFromDatabase = [];

  const accountLinksJSON = await getApiData(
    'http://localhost:3010/accountsApi/accounts'
  );

  const accountLinks = accountLinksJSON.data;

  for (let i = 0; i < accountLinks.length; i++) {
    const account = await getApiData(
      `http://localhost:3010/accountsApi${accountLinks[i]}`
    );

    accountsFromDatabase.push(account);
  }
  const allAccountsPromise = await Promise.all(accountsFromDatabase);
  // const questionPromises = questionLinks.map((link) =>
  // 	getApiData(`http://localhost:3010/questionnaireApi${link}`)
  // );
  return allAccountsPromise;
}

// const db = getAccounts();

// Example POST method implementation:
async function postData(url, data) {
  // Default options are marked with *
  
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "manual", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: new URLSearchParams(data)
  });
 
  return response.json(); // parses JSON response into native JavaScript objects
}

export async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 12);

  const dataForPost = {
    name: name,
    email: email,
    password: hashedPassword
  }
  console.log(dataForPost);
  postData("http://127.0.0.1:3010/accountsApi/accounts", dataForPost);

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
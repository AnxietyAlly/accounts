import bcrypt from 'bcrypt'

export async function createUser(name, email, password) {
    const sql = `
    insert into accounts (name, email, password)
    values ($name, $email, $password)
    `;

    const hashedPassword = await bcrypt.hash(password, 12);

    const stmnt = db.prepare(sql);
    stmnt.run({ name, email, password: hashedPassword });

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
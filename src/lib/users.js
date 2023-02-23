import bcrypt from 'bcrypt';
import xss from 'xss';
import { query } from './db.js';

const { BCRYPT_ROUNDS: bcryptRounds = 1 } = process.env;

export async function comparePasswords(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    console.error('Gat ekki borið saman lykilorð', e);
  }

  return false;
}

export async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  try {
    const result = await query(q, [username]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir notendnafni');
    return null;
  }

  return false;
}

export async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  try {
    const result = await query(q, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir id');
  }

  return null;
}

export async function userInEvent(name, event) {
  const q = `
    SELECT
      CASE WHEN EXISTS
        (SELECT *
        FROM registrations
        WHERE name = $1
          AND event = $2)
      THEN true
      ELSE false END`;

  const values = [name, event];
  const result = await query(q, values);

  return result.rows[0].case;
}

export async function createUser(name, username, password) {
   const hashedPassword = await bcrypt.hash(
    password,
    parseInt(bcryptRounds, 10)
   );

  const q = `
    INSERT INTO
      users (name, username, password)
    VALUES
      ($1, $2, $3)
    RETURNING *`;

  const values = [xss(name), xss(username), hashedPassword];
  const result = await query(q, values);

  if (result) {
    return result.rows[0];
  }

  console.warn('unable to create user');

  return false;
}

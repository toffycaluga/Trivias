import pg from 'pg'


const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'trivia',
  password: '1234',
  max: 12,
  min: 2,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 2000
})

export async function get_user(email) {
  const client = await pool.connect()
  if (!email) {
    const { rows } = await client.query({
      text: 'select * from users ',

    })
    client.release()
    // console.log('qui toy');
    return rows
  } else {
    const { rows } = await client.query({
      text: 'select * from users where email=$1',
      values: [email]
    })
    client.release()
    return rows[0]
  }
}

export async function create_user(name, email, password) {
  const client = await pool.connect()
  const user = await get_user();
  if (user.length == 0) {

    await client.query({
      text: `insert into users (name, email, password,es_admin) values ($1, $2, $3,'true')`,
      values: [name, email, password]
    })

    client.release()
  } else {

    await client.query({
      text: 'insert into users (name, email, password) values ($1, $2, $3)',
      values: [name, email, password]
    })

    client.release()
  }
}

export async function create_question(question) {
  const client = await pool.connect();
  await client.query({
    text: `insert into questions(question,correct,fake_1,fake_2) values ($1,$2,$3,$4) `,
    values: [question.pregunta, question.correcta, question.erronea1, question.erronea2]
  })
}

export async function get_random_questions() {
  const client = await pool.connect()
  const { rows } = await client.query('select * from questions order by random() limit 3')
  client.release()
  return rows
}

export async function insert_games(user_id, score) {
  const client = await pool.connect()
  await client.query({
    text: 'insert into games(user_id,score)values($1,$2)',
    values: [user_id, score]
  })
  client.release()
}


export async function consulta_respuesta(respuesta) {
  const client = await pool.connect()
  const { rows } = await client.query({
    text: 'select * from questions where correct=$1',
    values: [respuesta]
  })
  client.release()
  return rows
}

export async function get_games() {
  const client = await pool.connect();
  const { rows } = await client.query(`select users.id as id,name,score,gamedate from games join users on user_id=users.id order by  score desc;`)
  client.release()
  return rows
}
const { Pool, Client } = require('pg')

const connectionString = 'postgresql://bookstoreUser:bookstoreUser@bookstore-prod.cbaw0b5dcxjh.us-east-1.rds.amazonaws.com:5432/bookStore'

const pool = new Pool({
  connectionString,
})


const csv = require('fast-csv')

csv
  .parseFile('./import.csv', { headers: true, escape: '"' })
  .on('error', error => console.error(error))
  .on('data', (row) => {
    const qqq = `insert into Books values (${row.Id}, '${row.title}', '${row.description}', '${row.author}', '${row.tags}', ${row.created_at}, ${row.updated_at})`
    console.log(qqq)
    pool.query(qqq, (err, res) => {
      console.log(err, res)
      pool.end()
    })
  })
  .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));

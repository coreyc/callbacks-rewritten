const request = require('superagent')
const { Client } = require('pg')

const titles = ['Gullivers Travels', 'Gravitys Rainbow']

// loop over titles
// make request to openlib with book title
// get isbn from openlib
// add isbn number and book title to table

const getISBN = (bookTitle, callback) => {
  return request
    .get('http://openlibrary.org/search.json')
    .query({q: bookTitle})
    .end((err, res) => {
      if (err) return callback(new Error(`Error calling OpenLibrary: ${err}`))
      if (res.status === 200) {
        const parsed = JSON.parse(res.text)
        const first_isbn = parsed.docs[0].isbn[0]
        return callback(null, first_isbn)
      }
    }
  )
}

const getConnection = () => {
  return {
    host: 'localhost',
    database: 'books',
    password: null,
    port: 5432,
  }
}

const insert = (tableName, bookTitle, isbn, callback) => {
  const client = new Client(getConnection())
  client.connect()

  client.query(`INSERT INTO ${tableName} (bookTitle, isbn) VALUES ('${bookTitle}', '${isbn}');`, (err, res) => {
    if (err) callback(new Error(`Error inserting: ${err}`))
    else callback(null, res)
    client.end()
  })
}

// loop over titles
for (const bookTitle of titles) {
  // make request to openlib with book title
  // get isbn from openlib
  getISBN(bookTitle, (err, res) => {
    if (err) {
      console.log('Hit an error calling OpenLibrary API', err)
    } else {
      const isbn = res
      // add isbn number and book title to table
      insert('books', bookTitle, isbn, (err, res) => {
        if (err) {
          console.log('Hit an error inserting into table', err)
        } else {
          console.log(`${bookTitle}, ISBN: ${isbn} added to books table`)
        }
      })
    }
  })
}
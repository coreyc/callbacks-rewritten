const request = require('superagent')
const { Client } = require('pg')

const titles = ['Gullivers Travels', 'Gravitys Rainbow']

// loop over titles
// make request to openlib with book title
// get isbn from openlib
// add isbn number and book title to table

const getISBN = async (bookTitle) => {
  let response

  try {
    const apiResponse = await request
      .get('http://openlibrary.org/search.json')
      .query({q: bookTitle})
    
    const parsed = JSON.parse(apiResponse.text)
    response = parsed.docs[0].isbn[0]
  } catch(e) {
    response = new Error(`Error calling OpenLibrary: ${e}`)
  }

  return response
}

const getConnection = () => {
  return {
    host: 'localhost',
    database: 'books',
    password: null,
    port: 5432,
  }
}

const insert = async (tableName, bookTitle, isbn) => {
  const client = new Client(getConnection())
  await client.connect()

  let res
  
  try {
    await client.query(`INSERT INTO ${tableName} (bookTitle, isbn) VALUES ('${bookTitle}', '${isbn}');`)
  } catch(e) {
    res = new Error(`Error inserting: ${e}`)
  }

  await client.end()
  return res
}

const run = (async () => {
  titles.forEach(async bookTitle => {
    try {      
      // make request to openlib with book title
      // get isbn from openlib
      const isbn = await getISBN(bookTitle)

      // add isbn number and book title to table
      await insert('books', bookTitle, isbn)
      console.log(`${bookTitle}, ISBN: ${isbn} added to books table`)
    } catch(e) {
      throw new Error(e)
    }
  })
})()

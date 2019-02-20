const fs = require('fs')
const promisify = require('util').promisify

const request = require('superagent')

const inputdir = './files/'
const completeddir = './completed-asyncawait/'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

// read directory
// read each file
// get book title
// make request to openlib with book title
// get isbn from openlib
// add isbn prop and number to file
// save file to "completed" dir

const readJSONFile = async (filename) => {
  try {
    const content = await readFile(filename, 'utf8')
    return JSON.parse(content)
  } catch(e) {
    // could get err reading files, could get err parsing
    throw new Error(e)
  }
}

const getISBN = async (bookTitle) => {
  let response

  try {
    const apiResponse = await request
      .get('http://openlibrary.org/search.json')
      .query({q: bookTitle})
    
    const parsed = JSON.parse(apiResponse.text)
    response = parsed.docs[0].isbn[0]
  } catch(e) {
    response = e.status
  }

  return response
}

const writeJSONFile = async (filename, content) => {
  const json = JSON.stringify(content)

  try {
    await writeFile(filename, json)
  } catch(e) {
    throw new Error(e)
  }
}

const run = (async () => {
  // read directory
  let files

  try {
    files = await readdir(inputdir)
  } catch(e) {
    console.log(console.log(`Error reading directory ${inputdir}: ${e}`))
  }

  files.forEach(async filename => {
    try {
      // read each file
      const content = await readJSONFile(inputdir + filename)
      
      // make request to openlib with book title
      // get isbn from openlib
      const isbn = await getISBN(content.bookTitle)
      console.log('isbn:', isbn)

      // add isbn prop and number to file
      const isbnAdded = Object.assign({isbn: isbn}, content)

      // save file to "completed" dir
      await writeJSONFile(completeddir + filename, isbnAdded)
    } catch(e) {
      throw new Error(e)
    }
  })
})()

const fs = require('fs')
const request = require('superagent')

const inputdir = './files/'
const completeddir = './completed-callback/'

// read directory
fs.readdir(inputdir, (err, files) => {
  if (err) console.log(`Error reading directory ${inputdir}: ${err}`)
  else {
    files.forEach(filename => {
      // read each file
      readJSONFile(inputdir + filename, (err, content) => {
        if (err) console.log(`Error reading file ${filename}: ${err}`)
        else {
          // make request to openlib with book title
          // get isbn from openlib
          getISBN(content.bookTitle, (err, isbn) => {
            if (err) console.log(`Error calling openlib: ${err}`)
            
            // add isbn prop and number to file
            const isbnAdded = Object.assign({isbn: isbn}, content)

            // save file to "completed" dir          
            writeJSONFile(completeddir + filename, isbnAdded, (err, data) => {
              if (err) console.log(`Error writing file ${filename}: ${err}`)
              else {
                console.log(`${filename} processed and moved successfully`)
              }
            })
          })
        }
      })
    })
  }
})

const readJSONFile = (filename, callback) => {
  fs.readFile(filename, 'utf8', (err, content) => {
    if (err) return callback(err)
    else {
      let parsedJson
      let parseError
      
      try {
        parsedJson = JSON.parse(content)
      } catch(e) {
        parseError = e
      }

      return callback(parseError, parsedJson)      
    }
  })
}

const getISBN = (bookTitle, callback) => {
  return request
    .get('http://openlibrary.org/search.json')
    .query({q: bookTitle})
    .end((err, res) => {
      if (err) return callback(err)
      if (res.status === 200) {
        const parsed = JSON.parse(res.text)
        const first_isbn = parsed.docs[0].isbn[0]
        return callback(null, first_isbn)
      }
    }
  )
}

const writeJSONFile = (filename, content, callback) => {
  const json = JSON.stringify(content)

  fs.writeFile(filename, json, (err, data) => {
    if (err) return callback(err)
    else return callback(data)
  })
}
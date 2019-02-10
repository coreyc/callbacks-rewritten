const fs = require('fs')

const inputdir = './files/'
const completeddir = './completed/'

// read directory
// read each file
// add property: "processed", set as true
// save file to "completed" dir

// read directory
fs.readdir(inputdir, (err, files) => {
  if (err) console.log(`Error reading directory ${inputdir}: ${err}`)
  else {
    for (const filename of files) {
      // read each file
      readJSONFile(inputdir + filename, (err, content) => {
        if (err) {
          console.log(`Error reading file ${filename}: ${err}`)
        } else {
          // add property: "processed", set as true
          // save file to "completed" dir
          const modifiedContent = Object.assign({processed: true}, content)
          
          writeJSONFile(completeddir + filename, modifiedContent, (err, data) => {
            if (err) console.log(`Error writing file ${filename}: ${err}`)
            else {
              console.log(`${filename} processed and moved successfully`)
            }
          })
        }
      })
    }
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

const writeJSONFile = (filename, content, callback) => {
  const json = JSON.stringify(content)

  fs.writeFile(filename, json, (err, data) => {
    if (err) return callback(err)
    else return callback(data)
  })
}
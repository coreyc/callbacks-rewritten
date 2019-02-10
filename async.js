const fs = require('fs')
const promisify = require('util').promisify

const inputdir = './files/'
const completeddir = './completed-asyncawait/'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

// read directory
// read each file
// add property: "processed", set as true
// save file to "completed" dir

const readJSONFile = async (filename) => {
  try {
    const content = await readFile(filename, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    // could get err reading files, could get err parsing
    throw new Error(e)
  }
}

const writeJSONFile = async (filename, content) => {
  const json = JSON.stringify(content)

  try {
    await writeFile(filename, json)
  } catch (e) {
    throw new Error(e)
  }
}

const run = (async () => {
  // read directory
  let files

  try {
    files = await readdir(inputdir)
  } catch (e) {
    console.log(console.log(`Error reading directory ${inputdir}: ${e}`))
  }

  // looping through the files sequentially
  files.forEach(async filename => {
    // read each file
    try {
      const content = await readJSONFile(inputdir + filename)

      // add property: "processed", set as true
      const modifiedContent = Object.assign({processed: true}, content)

      await writeJSONFile(completeddir + filename, modifiedContent)
    } catch (e) {
      throw new Error(e)
    }
  })
})()

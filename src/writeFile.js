// const filePath = require('../files')
import * as fs from 'fs'
import * as PATH from 'path'
import * as srcUtils from './../src/utils'

//const { promisify } = require('util')
// const _ = require('lodash')

// @TODO i don't like this function name
/**
 * for makeReadable()
 * @param {Object} data a json object
 * */
const makeReadable = (data) => {
    var dataStr = JSON.stringify(data)

    const replaceList = [
      [ '/{"/g',  '{ "' ],
      [ '/{"/g',  '{ " ' ],
      [ '/},{/g', ' },\n{' ],
      [ '/":/g',  '": ' ],
      [ '/,"/g', ',\n "' ]
    ]

    replaceList.forEach((replacer) => {
      dataStr = dataStr.replace(replacer[0], replacer[1])
    })

    return dataStr
}

/**
 * Write in file
 * @param {String} path
 * @param {Object} data
 */
const writeFile = (path, data) => {
    var dataStr = makeReadable(data)
        //dataStr = '[' + dataStr + ']'
        //console.log(dataStr)

    fs.writeFile(path, dataStr, function(err) {
        if (err) {
          return console.log(err)
        }

        console.info(path + ' file generated successfully!')
    })
}



/**
 * readData()
 * @param {string} path
 * @param {string} file
 * */
 // @TODO if inside at this function we use path+file, maybe it's better to pass one variable?
const readData = (path, file) => {
  console.log(path + file);

  const data = fs.readFileSync(path + file);
  console.log(data);

  const fileData = JSON.parse(data);
  return fileData;
}

/**
 * @param {String} folderNamePath
 * @param {String} file
 * @param {Object} fileData
 * @param {var} flag
 * */
const saveFile = (folderNamePath, file, fileData, flag) => {
    var fileDataLength = fileData.length
    for (var i = 0; i < fileDataLength; i++) {
      var fileName = getFileName(file, fileData[i], flag, i)
      var elementPath = folderNamePath + '/' + fileName
      writeFile(elementPath, fileData[i])
    }
}

/**
 * @param {String} path
 * @param {String} file
 */
const makeFolder = (path, file) => {
  const suffix = '_elements'  
  var folderName = file.slice(0, -5) + suffix
  var folderNamePath = path + folderName
  // @TODO if we update our import - we'll be able to use just isDirectory()
  if (srcUtils.isDirectory(folderNamePath)) {
      fs.mkdirSync(folderNamePath)
  }
  return folderNamePath
}
// execute function
// splitObject()

/**
 * fixFileName()
 * @param {string} fileName
 */
const fixFileName = (fileName) => {
  fileName = fileName.replace(/ /g, '_') // Replace space with underscore
  fileName = fileName.toLowerCase() // Maintain Uniformity
  return fileName
}

/**
 * getFileName()
 * @param {string} file
 * @param {Object} fileData
 * @param {var} flag
 * @param {var} index
 */
const getFileName = (file, fileData, flag, index) => {
    var fileName
    if (flag === 1){
      // for example: 23-someJsonFile.json
      fileName = index + '-' + file
    } else {
      // for example: someValueOfName.json
      fileName = fileData.name + '.json'
    }

    fileName = fixFileName(fileName)
    return fileName
}


/**
 * For updateContent()
 * @param {var} content
 * @param {var} keys
 */
const updateContent = (content, keys) => {

  content.forEach((contentElem) => {
    contentElem.forEach((obj) => {
      keys.forEach((key) => {
        delete obj[key]
      })
    })
  })
  return content
}

export default {
  writeFile,
  test,
  splitObject,
  combineObject,
  makeReadable,
  readData
}

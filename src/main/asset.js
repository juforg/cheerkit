/**
 * @author juforg
 * @blog https://blog.appcity.vip
 */
import fs from 'fs'
import path from 'path'
const log = require('electron-log')
class Asset {
  getResourcesUri (sexs = ['all'], level = 'l1') {
    var resources = []
    for (var i in sexs) {
      resources = resources.concat(this.getImages(sexs[i], level))
    }
    log.info('random reses:', resources)
    return this.getRandomOne(resources)
  }

  // getImageUri (sex = 'all', level = 'l1') {
  //   // const type = this.getConfigType()
  //   // const images
  //   const images = this.getImages(sex, level)
  //   const image = this.getRandomOne(images)
  //   return image
  // }

  getImages (sex, level) {
    const dirPath = path.join(__static, sex, level)
    const files = this.readPathImage(sex, level, dirPath)
    return files
  }

  getRandomOne (images) {
    const n = Math.floor(Math.random() * images.length + 1) - 1
    return images[n]
  }

  readPathImage (sex, level, dirPath) {
    const files = []
    const result = fs.readdirSync(dirPath)
    result.forEach(function (item, index) {
      const stat = fs.lstatSync(path.join(dirPath, item))
      if (stat.isFile()) {
        files.push(path.join(sex, level, item))
      }
    })
    return files
  }
}
export default new Asset()

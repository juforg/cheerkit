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
      if (level === 'l4') {
        resources = resources.concat(this.getImages(sexs[i], 'l1'))
        resources = resources.concat(this.getImages(sexs[i], 'l2'))
        resources = resources.concat(this.getImages(sexs[i], 'l3'))
      } else {
        resources = resources.concat(this.getImages(sexs[i], level))
      }
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
      if (stat.isFile() && !item.startsWith('.')) {
        files.push(path.join(sex, level, item))
      }
    })
    return files
  }

  getImgSize (relurl) {
    var str = relurl
    var len = str.length
    var tmp1 = str.substr(str.lastIndexOf('_') + 1, len)
    var tmp2 = tmp1.substr(0, tmp1.lastIndexOf('.'))
    return tmp2.split('*')
  }
}
export default new Asset()

/**
 * @author juforg
 * @blog https://blog.appcity.vip
 */
import fs from 'fs'
import path from 'path'
const sizeOf = require('image-size')
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
    log.debug('random reses: %s , %s , %s', sexs, level, resources)
    return this.getRandomOne(resources)
  }

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
    var ret = { 'flag': true }
    var str = relurl
    var len = str.length
    if (str.indexOf('__') >= 0) {
      var tmp1 = str.substr(str.lastIndexOf('__') + 2, len)
      var tmp2 = tmp1.substr(0, tmp1.lastIndexOf('.'))
      var arry = tmp2.split('X')
      switch (arry.length) {
        case 0:
          var dimensions = sizeOf(path.join('static', relurl))
          ret.width = dimensions.width
          ret.height = dimensions.height
          break
        case 1:
          var tmp = arry[0]
          if (!isNaN(tmp)) {
            ret.duration = Number(tmp) * 1000
          }
          break
        case 2:
          ret.width = Number(arry[0])
          ret.height = Number(arry[1])
          break
        case 3:
          ret.width = Number(arry[0])
          ret.height = Number(arry[1])
          ret.duration = Number(arry[2]) * 1000
          break
      }
    } else {
      var dimen = sizeOf(path.join(__static, relurl))
      ret.width = dimen.width
      ret.height = dimen.height
    }
    if (ret.height > 800) {
      ret.width = Math.round(ret.height / 800 * ret.width)
      ret.height = 800
    }
    return ret
  }
}
export default new Asset()

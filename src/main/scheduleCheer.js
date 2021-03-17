'use strict'
import {scheduleJob, RecurrenceRule} from 'node-schedule'
import {ipcRenderer} from 'electron'
import logger from "electron-log"
import {createCheerWin} from './cheerWindow'


let rule
let job
let cheerWindow

function closeCheerWin(cheerWin){
  if(cheerWindow){
    logger.info('closeCheerWin')
    cheerWin.close()
  }else{
    logger.info('CheerWin already closed')
  }

}
export function cheerNow() {
  if(cheerWindow){
    logger.info('cheering')
    return
  }
  logger.info('starting cheer')
  createCheerWin().then(cheerWin => {
      cheerWindow = cheerWin
      cheerWin.on('closed', () => {
        cheerWindow = null
        logger.info('stoped cheer!')
      })
      // 为了防止闪烁，让画面准备好了再显示
      // 对于一个复杂的应用，ready-to-show 可能发出的太晚，会让应用感觉缓慢。 在这种情况下，建议立刻显示窗口，并使用接近应用程序背景的 backgroundColor
      // 请注意，即使是使用 ready-to-show 事件的应用程序，仍建议使用设置 backgroundColor 使应用程序感觉更原生。
      cheerWin.on('show', () => {
        logger.info('cheer win ready-to-show!')
        // cheerWin.show()
        ipcRenderer.send("cheerWin-ready")
      })
      setTimeout(closeCheerWin, 5000, cheerWin)
    }
  )

}

export function initSchedule(periodType) {
  logger.info('periodType: ' + periodType)
  if(job) job.cancel()
  switch(periodType){
    case 1:
      rule = '30 * * * * *'
      break;
    case 2:
      rule = '1 */2 * * *'
      break;
    case 3:
      rule = '1 */3 * * *'
      break;
    case 4:
      rule = '1 */4 * * *'
      break;
    case 6:
      rule = '1 */6 * * *'
      break;
    case 8:
      rule = '1 */8 * * *'
      break;
    default:
      rule = new RecurrenceRule()
      rule.minute = 59;
      rule.second = 59;
  }

  job = scheduleJob(rule, () => {
    cheerNow();
  });
}

export function stopSchedule() {
  if(job) job.cancel()
}


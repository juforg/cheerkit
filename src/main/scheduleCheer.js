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
        logger.info('clear cheer win obj!')
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
      rule = '59 59 * * * *'
      break;
    case 2:
      rule = '0 0 */2 * * *'
      break;
    case 3:
      rule = '0 0 */3 * * *'
      break;
    case 4:
      rule = '0 0 */4 * * *'
      break;
    case 6:
      rule = '0 0 */6 * * *'
      break;
    case 8:
      rule = '0 0 */8 * * *'
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


export const appMenu = {
  app: {
    about: '关于 %{appName}',
    services: {
      title: '服务'
    },
    hide: '隐藏 %{appName}',
    hideOthers: '隐藏其他',
    unhide: '全部显示',
    quit: '退出 %{appName}'
  },
  help: {
    title: '帮助',
    reportIssue: '报告问题',
    forceReload: '重新启动',
    toggleDevTools: '切换开发者工具'
  },
  tray: {
    openAtLogin: '开机启动',
    cheerNow: '立刻鼓励下！',
    targetsex: '喜好',
    targetsexSubs: {
      all: '通吃',
      male: '猿',
      female: '媛',
      favorite: '收藏夹'
    },
    cheerPeriod: '鼓励周期',
    cheerPeriodSubs: {
      hour1: '1小时',
      hour2: '2小时',
      hour4: '4小时',
      hour8: '8小时'
    },
    cheerLevel: '鼓励等级',
    cheerLevelSubs: {
      l1: 'l1',
      l2: 'l2',
      l3: 'l3',
      l4: '随机'
    },
    isFullScreen: '是否全屏',
    setLanguage: '设置语言',
    setLanguageSubs: {
      zhCN: '简体中文',
      zhTW: '繁体中文',
      cnUS: 'English'
    }
  },
  feedback: '反馈',
  checkUpdate: '检查更新',
  quit: '退出'
}

export default {
  help: {
    reportIssue: '报告问题',
    forceReload: '重新启动',
    toggleDevTools: '切换开发者工具'
  },
  webview: {
    contextMenu: {
      saveImageAs: '图片存储为...',
      copyImage: '复制图片',
      copyImageUrl: '复制图片地址'
    }
  },
  downloads: {
    state: {
      init: '初始化中',
      progressing: '下载中',
      cancelled: '已取消',
      completed: '已完成'
    }
  },
  navbar: {
    common: {
      options: {
        preferences: '设置',
        downloads: '下载',
        help: '帮助',
        lulumi: '关于 Lulumi'
      }
    }
  },
  notification: {
    update: {
      updateAvailable: '新版本，%{releaseName}，已经下载完毕。重启执行安装？'
    },
    permission: {
      request: {
        normal: '%{hostname} 要求 %{permission} 权限.',
        setLanguage: '%{hostname} 想要变更语言成 %{lang}（需重启）',
        permanent: 'Remember this decision',
        allow: '允许',
        deny: '拒绝'
      }
    }
  },
  lulumi: {
    aboutPage: {
      title: '关于'
    },
    downloadsPage: {
      title: '下载'
    },
    lulumiPage: {
      title: '关于 Lulumi'
    },
    preferencesPage: {
      tabConfigPage: {
        title: '设置／页面'
      },
      languagePage: {
        title: '设置／语言'
      },
      proxyPage: {
        title: '设置／代理'
      },
      authPage: {
        title: '设置／验证'
      }
    },
    languagePage: {
      title: '设置／语言'
    },
    proxyPage: {
      title: '设置／代理',
      pacScript: 'PAC',
      proxyRules: '规则',
      proxyBypassRules: '绕过规则'
    }
  }
}

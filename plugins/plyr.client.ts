import Plyr from 'plyr'

export default defineNuxtPlugin(() => {
  if (process.client) {
    // 将Plyr添加到全局window对象
    (window as any).Plyr = Plyr
  }
}) 
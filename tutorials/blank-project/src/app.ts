import {
  App,
  AppInterface,
  KJS,
  Logger
} from '@khanonjs/engine'

console.log('aki STARTING APP???')

@App({
  name: 'Khanon.js blank project',
  loopUpdate: {
    fps: 165
  }
})
export class LPWebsite extends AppInterface {
  onStart() {
    // Entrypoint of your application
    Logger.trace('App onStart')
  }

  onClose() {
    Logger.trace('App onClose')
  }

  onError(error?: string) {
    Logger.error('App onError:', error)
  }
}

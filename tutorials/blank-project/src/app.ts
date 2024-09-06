import {
  App,
  AppInterface,
  KJS,
  Logger
} from '@khanonjs/engine'

@App({
  name: 'Khanon.js blank project',
  loopUpdate: {
    fps: 165
  }
})
export class LPWebsite extends AppInterface {
  onStart() {
    // Entrypoint
    Logger.trace('App onStart')
  }

  onClose() {
    Logger.trace('App onClose')
  }

  onError(error?: string) {
    Logger.error('App onError:', error)
  }
}

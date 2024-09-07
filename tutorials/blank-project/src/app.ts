import {
  App,
  AppInterface,
  KJS,
  Logger
} from '@khanonjs/engine'

@App({
  name: 'Khanon.js blank project'
})
export class MyApp extends AppInterface {
  onStart() {
    // Entrypoint of your app
    Logger.trace('App onStart')
  }

  onClose() {
    Logger.trace('App onClose')
  }

  onError(error?: string) {
    Logger.error('App onError:', error)
  }
}

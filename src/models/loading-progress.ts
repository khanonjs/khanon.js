import { Observable } from '@babylonjs/core'

export class LoadingProgress<D = any> {
  /**
   * Progress factor (from 0 to 1)
   */
  progress: number = 0

  /**
   * Indicates if the loading have been completed
   */
  completed: boolean = false

  /**
   * Observable triggered on loading completed
   */
  onComplete: Observable<D | boolean> = new Observable<D | boolean>(undefined, true)

  /**
   * Observable triggered on loading error
   */
  onError: Observable<string> = new Observable<string>(undefined, true)

  /**
   * Observable triggered on loading progress (from 0 to 1)
   */
  onProgress: Observable<number> = new Observable<number>(undefined, true)

  /**
   * Notify error loading
   */
  error(error: any) {
    this.onError.notifyObservers(error)
  }

  /**
   * Sets current progress
   */
  setProgress(progres: number) {
    this.progress = progres
    this.onProgress.notifyObservers(this.progress)
  }

  /**
   * Set the loading progress to completed
   */
  complete(data?: D | boolean): LoadingProgress<D> {
    // Guarantees Observable.notifyIfTriggered will emit on add even if data is 'undefined'
    if (data === undefined) {
      data = true
    }
    this.progress = 1
    this.completed = true
    this.onComplete.notifyObservers(data)
    return this
  }
}

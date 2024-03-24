import { Observable } from '@babylonjs/core'

export class LoadingProgress<D = undefined> {
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
  onCompleted: Observable<D> = new Observable<D>()

  /**
   * Observable triggered on loading error
   */
  onError: Observable<string> = new Observable<string>()

  /**
   * Observable triggered on loading progress (from 0 to 1)
   */
  onProgress: Observable<number> = new Observable<number>()

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
  complete(data?: any) {
    this.progress = 1
    this.completed = true
    this.onCompleted.notifyObservers(data)
  }
}

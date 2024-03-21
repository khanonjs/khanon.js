import { Observable } from '@babylonjs/core'

export class LoadingProgress {
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
  onCompleted: Observable<void> = new Observable<void>()

  /**
   * Set the loading progress to completed
   */
  complete() {
    this.progress = 1
    this.completed = true
    this.onCompleted.notifyObservers()
  }
}

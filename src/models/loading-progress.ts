import { Observable } from '@babylonjs/core'

export interface LoadingProgress {
  /**
   * Progress factor (from 0 to 1)
   */
  progress: number

  /**
   * Indicates if the loading have been completed
   */
  completed: boolean

  /**
   * Observable triggered on loading completed
   */
  onCompleted: Observable<void>
}

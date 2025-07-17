import { Observable } from '@babylonjs/core/Misc/observable'

export class LoadingProgress<D = any> {
  private nodes: {
    completed: boolean,
    progress: number
  }[]

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
  onComplete: Observable<D>

  /**
   * Observable triggered on loading error
   */
  onError: Observable<string>

  /**
   * Observable triggered on loading progress (from 0 to 1)
   */
  onProgress: Observable<number>

  /**
   * Notify error loading
   */
  error(error: any): LoadingProgress<D>

  /**
   * Sets current progress
   */
  setProgress(progres: number): void

  /**
   * Sets the loading progress to completed
   */
  complete(data?: D | boolean): LoadingProgress<D>

  /**
   * Handles multiple LoadingProgress instances and behaves like all of them are one
   */
  fromNodes(progresses: LoadingProgress[]): LoadingProgress<D>
}

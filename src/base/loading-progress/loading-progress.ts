import * as BABYLON from '@babylonjs/core'

// TODO: Make it chainable?
export class LoadingProgress<D = any> {
  private nodes: {
    completed: boolean,
    progress: number
  }[] = []

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
  onComplete: BABYLON.Observable<D> = new BABYLON.Observable<D>(undefined, true)

  /**
   * Observable triggered on loading error
   */
  onError: BABYLON.Observable<string> = new BABYLON.Observable<string>(undefined, true)

  /**
   * Observable triggered on loading progress (from 0 to 1)
   */
  onProgress: BABYLON.Observable<number> = new BABYLON.Observable<number>(undefined, true)

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
   * Sets the loading progress to completed
   */
  complete(data?: D | boolean): LoadingProgress<D> {
    // Set true to guarantee Observable.notifyIfTriggered will emit (it doesn't emit if data is undefined)
    if (data === undefined) {
      data = true
    }
    this.setProgress(1)
    this.completed = true
    this.onComplete.notifyObservers(data as D)
    return this
  }

  /**
   * Handles multiple LoadingProgress instances and behaves like all of them are one
   */
  fromNodes(progresses: LoadingProgress[]): LoadingProgress<D> {
    if (progresses.length === 0) {
      this.complete()
    } else {
      progresses.forEach(progress => {
        const node = {
          completed: false,
          progress: 0
        }
        this.nodes.push(node)
      })
      progresses.forEach((progress, index) => {
        progress.onComplete.add(() => {
          this.nodes[index].completed = true
          if (!this.nodes.find(_node => !_node.completed)) {
            this.complete()
          }
        })
        progress.onError.add((error) => {
          this.error(error)
        })
        progress.onProgress.add((value: number) => {
          this.nodes[index].progress = value
          this.setProgress(this.nodes.reduce((acc, curr) => curr.progress < acc.progress ? curr : acc).progress)
        })
      })
    }
    return this
  }
}

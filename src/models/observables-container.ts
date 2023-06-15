import { Observable } from 'rxjs'

import * as Misc from '../misc'

/**
 * Store observables to share them between modules
 */
export class ObservablesContainer {
  observables: Misc.KeyValue<any, Observable<any>> = new Misc.KeyValue<any, Observable<any>>()

  add(id: any, observable: Observable<any>): void {
    this.observables.add(id, observable)
  }

  get(id: any): Observable<any> {
    return this.observables.get(id)
  }
}

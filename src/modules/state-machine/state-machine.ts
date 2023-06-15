import * as Misc from '../../misc'
import { Logger } from '../logger/logger'
import { State } from './state'

export class StateMachine {
  currentState: State<any>
  states: Misc.KeyValue<string, State<any>> = new Misc.KeyValue<string, State<any>>()

  registerState(state: State<any>): State<any> {
    this.states.add(state.id, state)
    return state
  }

  set(stateId: string): void {
    if (this.currentState) {
      this.currentState.end()
    }
    const nextState = this.get(stateId)
    this.currentState = nextState
    this.currentState.start(() => this.onEndState())
  }

  get(stateId: string): State<any> | undefined {
    const state = this.states.get(stateId)
    if (!state) {
      Logger.error('State not found:', stateId)
      return undefined
    }
    return state
  }

  onEndState(): void {
    this.currentState = undefined
  }

  isPlayingState(): boolean {
    return !!this.currentState
  }

  getCurrentState(): State<any> {
    return this.currentState
  }

  notify(id: any): void {
    if (this.currentState) {
      this.currentState.notify(id)
    }
  }

  notifyAll(id: any): void {
    this.states.getValues().forEach((state) => {
      state.notify(id)
    })
  }
}

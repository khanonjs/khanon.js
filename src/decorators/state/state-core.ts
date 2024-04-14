import { StateProps } from './state-props'

export abstract class StateCore {
  abstract props: StateProps
  abstract start(): void
  abstract end(): void
}

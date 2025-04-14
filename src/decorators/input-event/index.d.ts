import { InputEventIds } from './input-event-ids'

export type InputEventModifier = any

export { InputEventIds } from './input-event-ids'

export interface InputEventProps {
  /**
   * Input event id, defines what kind of user interaction this Input Event has.
   */
  id: InputEventIds
}

export declare function InputEvent(props: InputEventProps): any

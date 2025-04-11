import { InputEventArgData } from './input-event-arg-data'
import { InputEventIds } from './input-event-ids'

export type InputEventModifier = any

export { InputEventIds } from './input-event-ids'
export { InputEventArgData } from './input-event-arg-data'

export interface InputEventProps {
  /**
   * Input event id, defines what kind of user interaction this Input Event has.
   */
  id: InputEventIds

  /**
   * Modifier in case the Input Event Id needs more data to be identified.
   */
  modifier?: InputEventModifier

  /**
   * Argument data that will be passed to the method that is called when the Input Event is triggered.
   */
  argData?: InputEventArgData
}

export declare function InputEvent(props: InputEventProps): any

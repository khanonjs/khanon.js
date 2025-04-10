import { InputEventArgumentData } from './input-event-argument-data'
import { InputEventIds } from './input-event-ids'

export type InputEventModifier = any

export { InputEventIds } from './input-event-ids'
export { InputEventArgumentData } from './input-event-argument-data'

export interface InputEventProps {
  id: InputEventIds
  modifier?: InputEventModifier
  argumentData?: InputEventArgumentData
}

export declare function InputEvent(props: InputEventProps): any

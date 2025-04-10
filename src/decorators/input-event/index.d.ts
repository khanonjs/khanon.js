import { InputEventIds } from './input-event-ids'

export type InputEventData = any

export { InputEventIds } from './input-event-ids'

export interface InputEventProps {
  id: InputEventIds
  data?: InputEventData
}

export declare function InputEvent(props: InputEventProps): any

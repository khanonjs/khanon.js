import { InputEventIds } from './input-event-ids'

export type InputEventData = any

export interface InputEventProps {
  id: InputEventIds
  data: InputEventData
}

export declare function InputEvent(props: InputEventProps): any

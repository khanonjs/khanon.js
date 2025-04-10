import { InputEventArgumentData } from './input-event-argument-data'
import { InputEventIds } from './input-event-ids'
import { InputEventModifier } from './input-event-modifier'

export interface InputEventProps {
  id: InputEventIds
  modifier?: InputEventModifier
  argumentData?: InputEventArgumentData
}

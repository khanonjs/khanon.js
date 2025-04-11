import { InputEventArgData } from './input-event-arg-data'
import { InputEventIds } from './input-event-ids'
import { InputEventModifier } from './input-event-modifier'

export interface InputEventProps {
  id: InputEventIds
  modifier?: InputEventModifier
  argData?: InputEventArgData
}

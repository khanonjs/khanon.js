import { Observer } from '@babylonjs/core/Misc/observable'

import { InputEventProps } from '../../../decorators/input-event/input-event-props'

export interface MetadataInputEventDefinition {
  props: InputEventProps
  methodName: string
  observer?: Observer<any>
}

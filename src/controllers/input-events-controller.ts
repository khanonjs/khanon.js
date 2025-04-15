import * as BABYLON from '@babylonjs/core'

import { MetadataInputEventDefinition } from '../base/interfaces/metadata/metadata-input-event-definition'
import { InputEventIds } from '../decorators/input-event/input-event-ids'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { Logger } from '../modules/logger'

export class InputEventsController {
  static startInputEvent(definition: MetadataInputEventDefinition, context: any, scene: SceneInterface | null): void {
    switch (definition.props.id) {
    case InputEventIds.KEY_PRESS:
      definition.observer = scene?._$keyPress.add((event: KeyboardEvent) => context[definition.methodName](event))
      break
    case InputEventIds.KEY_UP:
      definition.observer = scene?._$keyUp.add((event: KeyboardEvent) => context[definition.methodName](event))
      break
    case InputEventIds.KEY_DOWN:
      definition.observer = scene?._$keyDown.add((event: KeyboardEvent) => context[definition.methodName](event))
      break
    case InputEventIds.TAP_DOWN:
    case InputEventIds.MOUSE_LEFT_DOWN:
      definition.observer = scene?._$pointerDown.add((event: BABYLON.IPointerEvent) => context[definition.methodName](event))
      break
    case InputEventIds.TAP_UP:
    case InputEventIds.MOUSE_LEFT_UP:
      definition.observer = scene?._$pointerUp.add((event: BABYLON.IPointerEvent) => context[definition.methodName](event))
      break
    case InputEventIds.MOUSE_MOVE:
      definition.observer = scene?._$pointerMove.add((event: BABYLON.IPointerEvent) => context[definition.methodName](event))
      break
    case InputEventIds.DRAG:
      definition.observer = scene?._$pointerDrag.add((event: BABYLON.IPointerEvent) => context[definition.methodName](event))
      break
    case InputEventIds.MOUSE_LEFT_PRESS:
    case InputEventIds.TAP_PRESS:
      definition.observer = scene?._$pointerPress.add((event: BABYLON.IPointerEvent) => context[definition.methodName](event))
      break
    }
  }

  static stopInputEvent(definition: MetadataInputEventDefinition, context: any, scene: SceneInterface | null): void {
    switch (definition.props.id) {
    case InputEventIds.KEY_PRESS:
      if (definition.observer) {
        scene?._$keyPress.remove(definition.observer)
      }
      break
    case InputEventIds.KEY_UP:
      if (definition.observer) {
        scene?._$keyUp.remove(definition.observer)
      }
      break
    case InputEventIds.KEY_DOWN:
      if (definition.observer) {
        scene?._$keyDown.remove(definition.observer)
      }
      break
    case InputEventIds.TAP_DOWN:
    case InputEventIds.MOUSE_LEFT_DOWN:
      if (definition.observer) {
        scene?._$pointerDown.remove(definition.observer)
      }
      break
    case InputEventIds.TAP_UP:
    case InputEventIds.MOUSE_LEFT_UP:
      if (definition.observer) {
        scene?._$pointerUp.remove(definition.observer)
      }
      break
    case InputEventIds.MOUSE_MOVE:
      if (definition.observer) {
        scene?._$pointerMove.remove(definition.observer)
      }
      break
    case InputEventIds.DRAG:
      if (definition.observer) {
        scene?._$pointerDrag.remove(definition.observer)
      }
      break
    case InputEventIds.MOUSE_LEFT_PRESS:
    case InputEventIds.TAP_PRESS:
      if (definition.observer) {
        scene?._$pointerPress.remove(definition.observer)
      }
      break
    }
  }
}

import * as BABYLON from '@babylonjs/core'

import { MetadataInputEventDefinition } from '../base/interfaces/metadata/metadata-input-event-definition'
import { InputEventArgData } from '../decorators/input-event/input-event-arg-data'
import { InputEventIds } from '../decorators/input-event/input-event-ids'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { Logger } from '../modules/logger'

export class InputEventsController {
  static startInputEvent(definition: MetadataInputEventDefinition, context: any, scene: SceneInterface | null): void {
    const callMethod = (event: any) => {
      // eslint-disable-next-line no-useless-call, prefer-spread
      context[definition.methodName].apply(context, definition.argMethod?.apply(this, [context, scene]) ?? [event])
    }
    const setArgMethod = () => {
      switch (definition.props.argData) {
      case InputEventArgData.POINTER_SCREEN:
        definition.argMethod = InputEventsController.argPointerScreen
        break
      }
    }
    switch (definition.props.id) {
    case InputEventIds.TAP_DOWN:
    case InputEventIds.MOUSE_LEFT_DOWN:
      setArgMethod()
      definition.observer = scene?._$pointerDown.add((ev: BABYLON.IPointerEvent) => callMethod(ev))
      break
    case InputEventIds.TAP_UP:
    case InputEventIds.MOUSE_LEFT_UP:
      setArgMethod()
      definition.observer = scene?._$pointerUp.add((ev: BABYLON.IPointerEvent) => callMethod(ev))
      break
    case InputEventIds.MOUSE_MOVE:
      setArgMethod()
      definition.observer = scene?._$pointerMove.add((ev: BABYLON.IPointerEvent) => callMethod(ev))
      break
    case InputEventIds.DRAG:
      setArgMethod()
      definition.observer = scene?._$pointerDrag.add((ev: BABYLON.IPointerEvent) => callMethod(ev))
      break
    }
  }

  static stopInputEvent(definition: MetadataInputEventDefinition, context: any, scene: SceneInterface | null): void {
    switch (definition.props.id) {
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
    }
  }

  /**
   * Argument methods.
   */
  private static argPointerScreen(context: any, scene: SceneInterface | null): any {
    return [scene?.babylon.scene.pointerX, scene?.babylon.scene.pointerY]
  }
}

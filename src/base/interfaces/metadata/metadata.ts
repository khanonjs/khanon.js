import { ActorActionConstructor } from '../../../decorators/actor/actor-action/actor-action-constructor'
import { InputEventIds } from '../../../decorators/input-event/input-event-ids'
import { InputEventModifier } from '../../../decorators/input-event/input-event-modifier'
import { SceneActionConstructor } from '../../../decorators/scene/scene-action/scene-action-constructor'
import { SceneInterface } from '../../../decorators/scene/scene-interface'
import { Logger } from '../../../modules/logger'
import { FlexId } from '../../../types/flex-id'
import { MetadataActionDefinition } from './metadata-action-definition'
import { MetadataInputEventDefinition } from './metadata-input-event-definition'
import { MetadataMeshDefinition } from './metadata-mesh-definition'
import { MetadataNotifierDefinition } from './metadata-notifier-definition'
import { MetadataParticleDefinition } from './metadata-particle-definition'
import { MetadataProps } from './metadata-props'
import { MetadataSpriteDefinition } from './metadata-sprite-definition'

export class Metadata<A extends ActorActionConstructor | SceneActionConstructor = any> {
  context: any
  scene: SceneInterface | null
  actions: MetadataActionDefinition<A>[] = []
  sprites: MetadataSpriteDefinition[] = []
  meshes: MetadataMeshDefinition[] = []
  particles: Set<MetadataParticleDefinition> = new Set<MetadataParticleDefinition>()
  notifiers: Map<FlexId, MetadataNotifierDefinition> = new Map<FlexId, MetadataNotifierDefinition>()
  inputEvents: Map<InputEventIds, Map<InputEventModifier, MetadataInputEventDefinition>> = new Map<InputEventIds, Map<InputEventModifier, MetadataInputEventDefinition>>()

  applyProps(_context: any, scene: SceneInterface | null): void {
    this.context = _context
    this.scene = scene
    this.actions.forEach(definition => {
      _context[definition.methodName] = definition.classDefinition
    })
    this.sprites.forEach(definition => {
      _context[definition.propertyName] = definition.classDefinition
    })
    this.meshes.forEach(definition => {
      _context[definition.propertyName] = definition.classDefinition
    })
  }

  /**
   * Returns the equivalent to the decorator props, that have been added through decorators
   */
  getProps(): MetadataProps<A> {
    return {
      actions: this.actions.map(definition => definition.classDefinition),
      sprites: this.sprites.map(definition => definition.classDefinition),
      meshes: this.meshes.map(definition => definition.classDefinition),
      particles: [...this.particles.values()].map(definition => definition.classDefinition)
    }
  }

  // TODO move Input event logic outside this class
  startInputEvents(): void {
    this.inputEvents.forEach(event => {
      event.forEach(definition => {
        switch (definition.props.id) {
        case InputEventIds.TAP_DOWN:
          definition.observer = this.scene?._$pointerDown.add(() => {
            this.context[definition.methodName]('hola')
          })
          break
        case InputEventIds.TAP_UP:
          definition.observer = this.scene?._$pointerUp.add(() => {
            this.context[definition.methodName]('hola')
          })
          break
        }
      })
    })
  }

  stopInputEvents(): void {
    this.inputEvents.forEach(event => {
      event.forEach(definition => {
        switch (definition.props.id) {
        case InputEventIds.TAP_DOWN:
          if (definition.observer) {
            this.scene?._$pointerDown.remove(definition.observer)
          }
          break
        case InputEventIds.TAP_UP:
          if (definition.observer) {
            this.scene?._$pointerUp.remove(definition.observer)
          }
          break
        }
      })
    })
  }
}

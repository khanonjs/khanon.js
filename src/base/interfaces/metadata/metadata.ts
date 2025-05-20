import { InputEventsController } from '../../../controllers'
import { ActorActionConstructor } from '../../../decorators/actor/actor-action/actor-action-constructor'
import { InputEventIds } from '../../../decorators/input-event/input-event-ids'
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
import { MetadataSoundDefinition } from './metadata-sound-definition'
import { MetadataSpriteDefinition } from './metadata-sprite-definition'

export class Metadata<A extends ActorActionConstructor | SceneActionConstructor = any> {
  context: any
  scene: SceneInterface | null
  sprites: MetadataSpriteDefinition[] = []
  meshes: MetadataMeshDefinition[] = []
  particles: Set<MetadataParticleDefinition> = new Set<MetadataParticleDefinition>()
  notifiers: Map<FlexId, MetadataNotifierDefinition> = new Map<FlexId, MetadataNotifierDefinition>()
  inputEvents: Map<InputEventIds, MetadataInputEventDefinition> = new Map<InputEventIds, MetadataInputEventDefinition>()
  sounds: MetadataSoundDefinition[] = []

  applyProps(_context: any, scene: SceneInterface | null): void {
    this.context = _context
    this.scene = scene
    this.sprites.forEach(definition => {
      _context[definition.propertyName] = definition.classDefinition
    })
    this.meshes.forEach(definition => {
      _context[definition.propertyName] = definition.classDefinition
    })
    this.sounds.forEach(definition => {
      _context[definition.propertyName] = definition.classDefinition
    })
  }

  /**
   * Returns the equivalent to the decorator props, that have been added through decorators
   */
  getProps(): MetadataProps<A> {
    return {
      sprites: this.sprites.map(definition => definition.classDefinition),
      meshes: this.meshes.map(definition => definition.classDefinition),
      particles: [...this.particles.values()].map(definition => definition.classDefinition),
      sounds: this.sounds.map(definition => definition.classDefinition)
    }
  }

  startInputEvents(): void {
    this.inputEvents.forEach(definition => {
      InputEventsController.startInputEvent(definition, this.context, this.scene)
    })
  }

  stopInputEvents(): void {
    this.inputEvents.forEach(definition => {
      InputEventsController.stopInputEvent(definition, this.context, this.scene)
    })
  }
}

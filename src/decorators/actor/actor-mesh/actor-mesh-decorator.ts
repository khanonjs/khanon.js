import 'reflect-metadata'

import {
  Mesh,
  MeshInterface
} from '../../../'
import { Logger } from '../../../modules/logger'
import { MeshProps } from '../../mesh/mesh-props'
import { ActorMetadata } from '../actor-metadata'

export function ActorSprite(props: MeshProps) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    @Mesh(props)
    class _meshInterface extends MeshInterface {}

    if (!Reflect.hasMetadata('metadata', target)) {
      Reflect.defineMetadata('metadata', new ActorMetadata(), target)
    }
    const metadata = Reflect.getMetadata('metadata', target) as ActorMetadata
    metadata.meshes.push({
      propertyName: propertyKey,
      classDefinition: _meshInterface
    })
  }
}

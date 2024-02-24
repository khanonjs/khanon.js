import { TileMapCore } from './tilemap-core'
import { TileMapInterface } from './tilemap-interface'
import { TileMapProps } from './tilemap-props'

export function TileMap(props: TileMapProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & TileMapCore & TileMapInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor {
      props = props
    }
    return _class
  }
}

import { TileMapCore } from './tilemap-core'
import { TileMapInterface } from './tilemap-interface'
import { TileMapProps } from './tilemap-props'
import { TileMapType } from './tilemap-type'

export function TileMap(props: TileMapProps): any {
  return function <T extends { new (...args: any[]): TileMapType }>(constructor: T & TileMapType, context: ClassDecoratorContext) {
    const _class = class extends constructor {
      props = props
    }
    return _class
  }
}

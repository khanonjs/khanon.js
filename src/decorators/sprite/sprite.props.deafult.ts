import { ExtractOptional } from '../../types'
import { SpriteProps } from './sprite-props'

export interface SpritePropsDefault extends ExtractOptional<SpriteProps> {
  maxAllowedSprites: number
}

export const spritePropsDefault: SpritePropsDefault = {
  maxAllowedSprites: 9999
}

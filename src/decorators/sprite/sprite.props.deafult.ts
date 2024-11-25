import { ExtractOptional } from '../../types/extract-optional'
import { SpriteProps } from './sprite-props'

export interface SpritePropsDefault extends ExtractOptional<SpriteProps> {
  maxAllowedSprites: number,
  invertY: boolean
}

export const spritePropsDefault: SpritePropsDefault = {
  maxAllowedSprites: 9999,
  invertY: true
}

import { SpriteAnimation } from './sprite-animation'

export interface SpriteProps {
  url?: string
  width: number
  height: number
  numFrames?: number
  animations?: SpriteAnimation[]
  noMipmap?: boolean
  invertY?: boolean
  samplingMode?: number
  cached?: boolean
  maxAllowedSprites?: number
}

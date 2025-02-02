import { SpriteAnimation } from './sprite-animation'

export interface SpriteProps {
  url?: string
  width: number
  height: number
  numFrames?: number
  animations?: SpriteAnimation[]
  noMipmap?: boolean
  invertY: boolean
  format?: number
  samplingMode?: number
  cached?: boolean
}

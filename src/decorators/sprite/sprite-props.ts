import { SpriteAnimation } from './sprite-animation'

export interface SpriteProps {
  url?: string
  width?: number
  height?: number
  cellWidth?: number
  cellHeight?: number
  numFrames?: number // 8a8f this property shouldn't be neccesary
  animations?: SpriteAnimation[]
  noMipmap?: boolean
  invertY: boolean
  format?: number
  samplingMode?: number
  cached?: boolean
}

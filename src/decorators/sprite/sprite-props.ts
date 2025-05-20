import { SpriteAnimation } from './sprite-animation'

export interface SpriteProps {
  url?: string
  width?: number
  height?: number
  cellWidth?: number
  cellHeight?: number
  numFrames?: number
  animations?: SpriteAnimation[]
  noMipmap?: boolean
  invertY: boolean
  format?: number
  samplingMode?: number
  renderingGroupId?: number
}

import { Rect } from './rect'

export interface DrawBlockProperties {
  fontName: string
  fontSize: number
  textColor: string
  fontStyle?: string
  bgColor?: string
  centerH?: boolean
  centerV?: boolean
  textureSize?: Rect
}

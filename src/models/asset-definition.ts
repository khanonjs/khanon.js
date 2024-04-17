import { AssetsEnum } from './asset-enum'

export interface AssetDefinition {
  url: string
  type: AssetsEnum
  cached: boolean
}

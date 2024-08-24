import { AssetType } from './asset-type'

export interface AssetDefinition {
  url: string
  type: AssetType
  cached: boolean
}

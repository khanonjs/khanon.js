import { AssetType } from './asset-type'

export interface AssetDefinition<D = any, U = string> {
  url: U
  type: AssetType
  data?: D
  cached: boolean
}

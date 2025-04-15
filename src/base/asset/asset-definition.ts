import { AssetType } from './asset-type'

export interface AssetDefinition<D = any> {
  url: string
  type: AssetType
  data?: D
  cached: boolean
}

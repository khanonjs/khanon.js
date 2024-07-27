import { MetadataNotifierDefinition } from '../../base'
import { FlexId } from '../../types'

export class AppMetadata {
  notifiers: Map<FlexId, MetadataNotifierDefinition> = new Map<FlexId, MetadataNotifierDefinition>()
}

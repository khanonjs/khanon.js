import { FlexId } from '../../types'

export abstract class Notificable {
  abstract notify(message: FlexId, ...args: any[]): void
}

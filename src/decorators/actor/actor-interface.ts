import { ActorComposition } from './actor-composition'

export class ActorInterface {
  onLoaded?(): void
  addComposition?(composition: () => ActorComposition): void
  setComposition?(id: string): void
}

export class ActorCompositionDefinition {
  constructor(private readonly id: string) {}

  add(object: any/* Mesh | Sprite */): void {
    console.log('aki ActorCompositionDefinition addMesh')
  }

  release(): void {
    console.log('aki ActorCompositionDefinition release')
  }
}

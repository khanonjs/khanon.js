export abstract class ActorInterface {
  /**
   * Private
   */
  compositions?: Map<string, () => any>

  /**
   * Public
  */
  abstract useComposition?<C = any>(id: string): C

  /**
   * User defined
   */
  abstract onLoaded?(): void
  abstract onSpawn?(): void
}

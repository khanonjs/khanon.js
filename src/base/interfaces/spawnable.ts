export abstract class Spawnable</* Instance type */I, /* spawn 'props' argument */ P = any> {
  abstract Instance: I
  abstract spawn(container?: any, props?: P): void
}

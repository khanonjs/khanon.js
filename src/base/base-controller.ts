export function BaseController<T>() {
  abstract class BaseController {
    protected static items: T[] = []

    static register(sprite: T) {
      this.items.push(sprite)
    }

    static get(constructor: T): T {
      return this.items.find(sprite => sprite instanceof (constructor as any))
    }
  }
  return BaseController
}

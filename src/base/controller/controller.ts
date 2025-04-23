export function Controller<C, I>() {
  abstract class BaseController {
    static items: Map<C, I> = new Map<C, I>()

    static register(cosnstructor: C, instance: I) {
      BaseController.items.set(cosnstructor, instance)
    }

    /**
     * @param constructor Constructor class to find and retrieve
     * @param useInstance If *true* use Spawnable Instance property to find the class (in case it is Spawnable), Otherwise will use the class itself for the instanceof comparison
     */
    static get<C>(constructor: C): C extends any[] ? I[] : I {
      if (Array.isArray(constructor)) {
        const arr: any[] = []
        constructor.forEach(cnst => {
          arr.push(BaseController.items.get(cnst as any) as any)
        })
        return arr as any
      } else {
        return BaseController.items.get(constructor as any) as any
      }
    }
  }
  return BaseController
}

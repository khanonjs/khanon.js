import { Core } from '../core'
import { Logger } from '../modules'
import { ExtractOptional } from '../types/extract-optional'

/**
 * Attach LoopUpdate in context if exists
 */
export function attachLoopUpdate(context: any): void {
  if (context.onLoopUpdate) {
    context.loopUpdate$ = Core.addLoopUpdateObserver(context.onLoopUpdate.bind(context))
  }
}

/**
 * Attach canvasResize in context if exists
 */
export function attachCanvasResize(context: any): void {
  if (context.onCanvasResize) {
    context.canvasResize$ = Core.addCanvasResizeObserver(context.onCanvasResize.bind(context))
  }
}

/**
 * Switch onLoopUpdate on/off
 */
export function switchLoopUpdate(value: boolean, context: any): void {
  if (value) {
    attachLoopUpdate(context)
  } else {
    removeLoopUpdate(context)
  }
}

/**
 * Removes LoopUpdate in context if exists
 */
export function removeLoopUpdate(context: any): void {
  if (context.loopUpdate$) {
    Core.removeLoopUpdateObserver(context.loopUpdate$)
    context.loopUpdate$ = undefined
  }
}

/**
 * Removes canvasResize in context if exists
 */
export function removeCanvasResize(context: any): void {
  if (context.canvasResize$) {
    Core.removeCanvasResizeObserver(context.canvasResize$)
    context.canvasResize$ = undefined
  }
}

/**
 * Invokes optional callback
 */
export function invokeCallback(func?: (...args: any[]) => void, context?: any, ...params: any[]) {
  if (func !== undefined) {
    func.apply(context, params as [])
  }
}

/**
 * Applies default configuration to the not setted properties of an object
 */
export function applyDefaults<O, D extends ExtractOptional<O>>(object: O, defaults: D): O & D {
  return {
    ...defaults,
    ...object
  }
}

/**
 * Returns a string from any kind of object.
 * Parse errors.
 * This method prevents circular references.
 */
export function objectToString(data: unknown, stringfy = true): string {
  function getCircularReplacer() {
    const ancestors = []
    return function (key: any, value: null) {
      if (typeof value !== 'object' || value === null) {
        return value
      }
      // `this` is the object that value is contained in,
      // i.e., its direct parent.
      // @ts-ignore
      while (ancestors.length > 0 && ancestors.at(-1) !== this) {
        ancestors.pop()
      }
      if (ancestors.includes(value)) {
        return '[Circular]'
      }
      ancestors.push(value)
      return value
    }
  }
  return data
    ? (data instanceof Error
      ? data.message
      : (typeof data === 'object' && stringfy
        ? JSON.stringify(data, getCircularReplacer())
        : data as string))
    : ''
}

/**
 * Removes duplicated items in 'Array' or first-Level 'Object' array
 */
export function removeArrayDuplicitiesInObject<T extends object>(values: T): T {
  function remove(vals: any): any {
    if (Array.isArray(vals)) {
      return Array.from(new Set(vals))
    } else {
      return vals
    }
  }
  if (values) {
    if (typeof values === 'object') {
      for (const [key, value] of Object.entries(values)) {
        values[key] = remove(value)
      }
      return values
    } else {
      Logger.error('Trying to remove array duplicities in a non-object variable.')
      return values
    }
  }
}

/**
 * Returns true if a class is the prototype of another child class.
 * E.g: isPrototypeOf(ActorInterface, SomeActorClass whom parent is ActorInterface) = true
 */
export function isPrototypeOf(_parent: object, _child: object): boolean {
  return Object.prototype.isPrototypeOf.call(_parent, _child)
}

/**
 * Spawn class from prototype
 */
export function cloneClass(_class: object) { // 8a8f eliminar
  return Object.assign(Object.create(Object.getPrototypeOf(_class)), _class)
}

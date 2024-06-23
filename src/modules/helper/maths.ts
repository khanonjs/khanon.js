export class Maths {
  static readonly MIN_VALUE = 0.00000001

  /**
   * Drag value from origin to target depending on a ratio (0 is 'origin', 1 is 'target')
   *
   * @param origin 'origin' value on scene
   * @param target 'target' value on scene
   * @param ratio From 0 to 1 from origin to target
   * @param ratioClampMin clamp min ratio
   * @param ratioClampMax clamp max ratio
   */
  static dragValue(ratio: number, origin: number, target: number, ratioClampMin: number = 0, ratioClampMax: number = 1): number {
    ratio = Maths.clamp(ratio, ratioClampMin, ratioClampMax)
    return origin + (target - origin) * ratio
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }

  static randomInt(minValue: number, maxValue: number): number {
    return Math.trunc(minValue + Math.random() * (maxValue - minValue + 0.9999999))
  }

  static increaseValue(from: number, to: number, speed: number, completed?: () => void): number {
    const complete = () => {
      if (completed) {
        completed()
      }
      return to
    }
    const dist = Math.abs(to - from)
    if (dist <= Maths.MIN_VALUE) {
      return complete()
    }
    if (to < from) {
      from -= speed
      if (from < to) {
        return complete()
      }
    } else {
      from += speed
      if (from > to) {
        return complete()
      }
    }
    return from
  }

  static increaseValueWithInertia(from: number, to: number, speed: number, acceleration: number = 1, completed?: () => void): number {
    function complete() {
      if (completed) {
        completed()
      }
      return to
    }
    const dist = Math.abs(to - from)
    if (dist <= 0.001) {
      return complete()
    }
    if (to < from) {
      from -= speed / (1 / (dist * acceleration))
      if (from < to) {
        return complete()
      }
    } else {
      from += speed / (1 / (dist * acceleration))
      if (from > to) {
        return complete()
      }
    }
    return from
  }

  static increaseVector(from: number[], to: number[], speed: number, completed?: () => void): number[] {
    const complete = () => {
      if (completed) {
        completed()
      }
      return to
    }
    const director = []
    for (let i = 0; i < from.length; i++) {
      director.push(to[i] - from[i])
    }
    let lengthPow2 = 0
    director.forEach((value) => (lengthPow2 += Math.pow(value, 2)))
    const length = Math.sqrt(lengthPow2)
    if (length < Maths.MIN_VALUE) {
      return complete()
    }
    const directorNormalized = director.map((value) => value / length)
    const result = []
    for (let i = 0; i < from.length; i++) {
      const resultValue = Maths.increaseValue(from[i], to[i], Math.abs(directorNormalized[i]) * speed)
      result.push(resultValue)
    }
    return result
  }

  static increaseVectorWithInertia(from: number[], to: number[], speed: number, acceleration: number = 1, completed?: () => void): number[] {
    const complete = () => {
      if (completed) {
        completed()
      }
      return to
    }
    const director = []
    for (let i = 0; i < from.length; i++) {
      director.push(to[i] - from[i])
    }
    let lengthPow2 = 0
    director.forEach((value) => (lengthPow2 += Math.pow(value, 2)))
    const length = Math.sqrt(lengthPow2)
    if (length < Maths.MIN_VALUE) {
      return complete()
    }
    const directorNormalized = director.map((value) => value / length)
    const result = []
    for (let i = 0; i < from.length; i++) {
      const resultValue = Maths.increaseValueWithInertia(from[i], to[i], Math.abs(directorNormalized[i]) * speed, acceleration)
      result.push(resultValue)
    }
    return result
  }
}

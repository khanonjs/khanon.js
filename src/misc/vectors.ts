import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { Maths } from './maths'

export class Vectors {
  /**
     * Drag point from origin to target depending on a ratio (0 is 'origin', 1 is 'target')
     *
     * @param origin Vector 'origin' position on scene
     * @param target Vector 'target' position on scene
     * @param ratio From 0 to 1 from origin to target
     * @param ratioClampMin clamp min ratio
     * @param ratioClampMax clamp max ratio
     */
  static dragPoint(ratio: number, origin: Vector3, target: Vector3, ratioClampMin: number = 0, ratioClampMax: number = 1): Vector3 {
    ratio = Maths.clamp(ratio, ratioClampMin, ratioClampMax)
    return origin.add(target.subtract(origin).scale(ratio))
  }

  static vectorialProjectionToLine(vector: Vector3, line: Vector3): Vector3 {
    return line.scale(Vector3.Dot(vector, line) / Vector3.Dot(line, line))
  }

  static scalarProjectionToLine(vector: Vector3, line: Vector3): number {
    // return vector.length() * this.angleBetweenLines(vector, line)
    return this.vectorialProjectionToLine(vector, line).length()
  }

  static vectorialProjectionToPlane(vector: Vector3, planeNormal: Vector3): Vector3 {
    return vector.subtract(Vectors.vectorialProjectionToLine(vector, planeNormal))
  }

  static scalarProjectionToPlane(vector: Vector3, line: Vector3): number {
    return this.vectorialProjectionToPlane(vector, line).length()
  }

  static angleBetweenLines(lineA: Vector3, lineB: Vector3): number {
    return Math.acos(Maths.clamp(Vector3.Dot(lineA, lineB) / (lineA.length() * lineB.length()), -1, 1))
  }

  static angleXBetweenLines(lineA: Vector3, lineB: Vector3): number {
    const angleA = Math.atan2(lineA.y, lineA.z)
    const angleB = Math.atan2(lineB.y, lineB.z)
    return angleA - angleB
  }

  static angleYBetweenLines(lineA: Vector3, lineB: Vector3): number {
    const angleA = Math.atan2(lineA.x, lineA.z)
    const angleB = Math.atan2(lineB.x, lineB.z)
    return angleA - angleB
  }

  static angleZBetweenLines(lineA: Vector3, lineB: Vector3): number {
    const angleA = Math.atan2(lineA.x, lineA.y)
    const angleB = Math.atan2(lineB.x, lineB.y)
    return angleA - angleB
  }
}

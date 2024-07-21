import * as BABYLON from '@babylonjs/core'

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
  static dragPoint(ratio: number, origin: BABYLON.Vector3, target: BABYLON.Vector3, ratioClampMin: number = 0, ratioClampMax: number = 1): BABYLON.Vector3 {
    ratio = Maths.clamp(ratio, ratioClampMin, ratioClampMax)
    return origin.add(target.subtract(origin).scale(ratio))
  }

  static vectorialProjectionToLine(vector: BABYLON.Vector3, line: BABYLON.Vector3): BABYLON.Vector3 {
    return line.scale(BABYLON.Vector3.Dot(vector, line) / BABYLON.Vector3.Dot(line, line))
  }

  static scalarProjectionToLine(vector: BABYLON.Vector3, line: BABYLON.Vector3): number {
    // return vector.length() * Vector.angleBetweenLines(vector, line);
    return Vectors.vectorialProjectionToLine(vector, line).length()
  }

  static vectorialProjectionToPlane(vector: BABYLON.Vector3, planeNormal: BABYLON.Vector3): BABYLON.Vector3 {
    return vector.subtract(Vectors.vectorialProjectionToLine(vector, planeNormal))
  }

  static scalarProjectionToPlane(vector: BABYLON.Vector3, line: BABYLON.Vector3): number {
    return Vectors.vectorialProjectionToPlane(vector, line).length()
  }

  static angleBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number {
    return Math.acos(Maths.clamp(BABYLON.Vector3.Dot(lineA, lineB) / (lineA.length() * lineB.length()), -1, 1))
  }

  static angleXBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number {
    const angleA = Math.atan2(lineA.y, lineA.z)
    const angleB = Math.atan2(lineB.y, lineB.z)
    return angleA - angleB
  }

  static angleYBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number {
    const angleA = Math.atan2(lineA.x, lineA.z)
    const angleB = Math.atan2(lineB.x, lineB.z)
    return angleA - angleB
  }

  static angleZBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number {
    const angleA = Math.atan2(lineA.x, lineA.y)
    const angleB = Math.atan2(lineB.x, lineB.y)
    return angleA - angleB
  }
}

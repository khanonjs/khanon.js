import { Vector3 } from '@babylonjs/core'

export declare namespace Helper {
  export namespace Arrays {
    function shuffle(arr: any[], startsOn?: number): void
    function clear(arr: any[]): void
  }

  export namespace Maths {
    function dragValue(ratio: number, origin: number, target: number, ratioClampMin?: number, ratioClampMax?: number): number
    function clamp(value: number, min: number, max: number): number
    function randomInt(minValue: number, maxValue: number): number
    function increaseValue(from: number, to: number, speed: number, completed?: () => void): number
    function increaseValueWithInertia(from: number, to: number, speed: number, acceleration?: number, completed?: () => void): number
    function increaseVector(from: number[], to: number[], speed: number, completed?: () => void): number[]
    function increaseVectorWithInertia(from: number[], to: number[], speed: number, acceleration?: number, completed?: () => void): number[]
  }

  export namespace Vectors {
    function dragPoint(ratio: number, origin: Vector3, target: Vector3, ratioClampMin?: number, ratioClampMax?: number): Vector3
    function vectorialProjectionToLine(vector: Vector3, line: Vector3): Vector3
    function scalarProjectionToLine(vector: Vector3, line: Vector3): number
    function vectorialProjectionToPlane(vector: Vector3, planeNormal: Vector3): Vector3
    function scalarProjectionToPlane(vector: Vector3, line: Vector3): number
    function angleBetweenLines(lineA: Vector3, lineB: Vector3): number
    function angleXBetweenLines(lineA: Vector3, lineB: Vector3): number
    function angleYBetweenLines(lineA: Vector3, lineB: Vector3): number
    function angleZBetweenLines(lineA: Vector3, lineB: Vector3): number
  }
}

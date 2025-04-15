import * as BABYLON from '@babylonjs/core'

// TODO meter esto en KJS

export declare namespace Helper {
  export namespace Arrays {
    function shuffle(arr: any[], startsOn?: number): void
    function clear(arr: any[]): void
  }

  export namespace Maths {
    const MIN_VALUE: number
    function dragValue(ratio: number, origin: number, target: number, ratioClampMin?: number, ratioClampMax?: number): number
    function clamp(value: number, min: number, max: number): number
    function randomInt(minValue: number, maxValue: number): number
    function increaseValue(from: number, to: number, speed: number, completed?: () => void): number
    function increaseValueWithInertia(from: number, to: number, speed: number, acceleration?: number, completed?: () => void): number
    function increaseVector(from: number[], to: number[], speed: number, completed?: () => void): number[]
    function increaseVectorWithInertia(from: number[], to: number[], speed: number, acceleration?: number, completed?: () => void): number[]
  }

  export namespace Vectors {
    function dragPoint(ratio: number, origin: BABYLON.Vector3, target: BABYLON.Vector3, ratioClampMin?: number, ratioClampMax?: number): BABYLON.Vector3
    function vectorialProjectionToLine(vector: BABYLON.Vector3, line: BABYLON.Vector3): BABYLON.Vector3
    function scalarProjectionToLine(vector: BABYLON.Vector3, line: BABYLON.Vector3): number
    function vectorialProjectionToPlane(vector: BABYLON.Vector3, planeNormal: BABYLON.Vector3): BABYLON.Vector3
    function scalarProjectionToPlane(vector: BABYLON.Vector3, line: BABYLON.Vector3): number
    function angleBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number
    function angleXBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number
    function angleYBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number
    function angleZBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number
  }
}

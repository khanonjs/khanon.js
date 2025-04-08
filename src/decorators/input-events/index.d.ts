import * as BABYLON from '@babylonjs/core'

export declare abstract class InputEventsInterface {

}

export type InputEventsConstructor = new () => InputEventsInterface

export interface InputEventsProps {

}

export declare function InputEvents(props?: InputEventsProps): any

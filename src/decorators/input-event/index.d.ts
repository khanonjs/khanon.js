/**
 * Id type for input events.
 */
export enum InputEventIds {
  /**
   * Key press event.
   */
  KEY_PRESS,

  /**
   * Key down event.
   */
  KEY_DOWN,

  /**
   * Key up event.
   */
  KEY_UP,

  /**
   * Mouse left button press event.
   */
  MOUSE_LEFT_PRESS,

  /**
   * Mouse left button down event.
   */
  MOUSE_LEFT_DOWN,

  /**
   * Mouse left button up event.
   */
  MOUSE_LEFT_UP,

  /**
   * Mouse move event.
   */
  MOUSE_MOVE,

  /**
   * Screen tap press event.
   */
  TAP_PRESS,

  /**
   * Screen tap down event.
   */
  TAP_DOWN,

  /**
   * Screen tap up event.
   */
  TAP_UP,

  /**
   * Screen drag event.
   */
  DRAG,
}

export interface InputEventProps {
  /**
   * Input event id, defines what kind of user interaction this Input Event has.
   */
  id: InputEventIds
}

export declare function InputEvent(props: InputEventProps): any

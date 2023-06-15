export enum MotionEndCriteria {
    /**
     * The motion ends when it reach the 'alphaEnd' value.
     */
    ALPHA_END,

    /**
     * Timeout, 'properties.endValue' is the timeout in Ms.
     */
    TIMEOUT,
}

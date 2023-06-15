export interface CoreProperties {
    /** Canvas HTML parent element */
    canvasParentHTMLElement?: HTMLElement
    /** FPS container HTML element */
    fpsContainer?: string
    /** Loop Update target FPS of the application */
    fps: number
    /** Critical error app callback */
    onAppError?: (errorMsg: string) => void
    /** Development mode */
    isDevelopmentMode?: boolean
}

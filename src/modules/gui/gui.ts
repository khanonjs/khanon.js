import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture'
import { Control } from '@babylonjs/gui/2D/controls/control'
import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock'

import { Scene } from '../scene/scene'

/**
 * Only one fullscreen GUI is allowed per scene
 */
export class GUI {
  private readonly babylonjs: AdvancedDynamicTexture

  constructor(private readonly scene: Scene) {
    this.babylonjs = AdvancedDynamicTexture.CreateFullscreenUI('GUI', true, scene.babylonjs)
  }

  newTextBlock(): TextBlock {
    const textBlock: TextBlock = new TextBlock()
    this.babylonjs.addControl(textBlock)
    return textBlock
  }

  removeControl(control: Control): void {
    this.babylonjs.removeControl(control)
  }
}

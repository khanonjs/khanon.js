import { Subject } from 'rxjs'

import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Scene as BabylonJsScene } from '@babylonjs/core/scene'

import * as Misc from '../../misc'
import { DisplayObject } from '../../models/display-object'
import { ObservablesContainer } from '../../models/observables-container'
import { ActionsManager } from '../actions/actions-manager'
import { AssetsManager } from '../assets-manager/assets-manager'
import { Logger } from '../logger/logger'
import { MeshAnimation } from '../mesh/mesh-animation'
import { ParticlesFactory } from '../particle/particles-factory'
import { ActorSimplePhysics } from '../physics/simple-physics/actor-simple-physics'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { StateMachine } from '../state-machine/state-machine'
import { ActorProperties } from './actor-properties'

export abstract class Actor {
  private displayObject: DisplayObject
  private readonly animations: Misc.KeyValue<number, SpriteAnimation | MeshAnimation> = new Misc.KeyValue<number, SpriteAnimation | MeshAnimation>()
  private readonly keyFramesSubjects: Misc.KeyValue<number, Subject<void>> = new Misc.KeyValue<number, Subject<void>>()

  readonly state: StateMachine = new StateMachine()
  readonly actions: ActionsManager<any> = new ActionsManager<Actor>()
  readonly physics: ActorSimplePhysics
  particles: ParticlesFactory
  protected sceneObservables: ObservablesContainer

  private removeCallback: () => void

  constructor(readonly name: string, protected readonly properties?: ActorProperties) {
    if (this.properties?.usePhysics) {
      this.physics = new ActorSimplePhysics()
    }
  }

    /**
     * To be implemented by app actor.
     * It will be invoked after scene loading.
     */
    abstract onInitialize(assetsManager: AssetsManager): void

    /**
     * Invoked on getDisplayObject from scene loading.
     * To be implemented by app actor.
     *
     * @param babylonJsScene
     */
    protected abstract createDisplayObject(babylonJsScene: BabylonJsScene): DisplayObject

    /**
     * To be implemented by generic actors (Actor2D, Actor3D,..).
     *
     * @param displayObject
     */
    protected abstract setDisplayObject(displayObject: DisplayObject): void

    /**
     * Child release, mainly assets
     */
    protected abstract onRelease(): void

    /**
     * Initialize actor
     *
     * @param assetsManager
     * @param removeCallback
     */
    initialize(assetsManager: AssetsManager, removeCallback: () => void): void {
      this.removeCallback = removeCallback
      this.onInitialize(assetsManager)
    }

    /**
     * Release
     */
    release(): void {
      this.state.currentState?.end()
      this.actions.stopAll()
      this.particles.release()
      this.physics?.release()
      this.displayObject.release()
      this.onRelease()
    }

    /**
     * Sets animation.
     * To be implemented by generic actors (Actor2D, Actor3D,..).
     *
     * @param name
     * @param loop
     * @param completed
     */
    abstract setAnimation(id: number, loopOverride?: boolean, completed?: () => void): void

    /**
     * Override on child to notify messages to this actor from outer scene
     *
     * @param id
     */
    notify(id: any): void {}

    /**
     * Create particles manager (needs some manager from Scene)
     *
     * @param babylonJsScene
     * @param spritesManager
     * @param meshesManager
     */
    createParticlesManager(babylonJsScene: BabylonJsScene, assetsManager: AssetsManager): void {
      this.particles = new ParticlesFactory(babylonJsScene, assetsManager, this.displayObject)
    }

    /**
     * Setup scene observables
     *
     * @param sceneObservables
     */
    setSceneObservables(sceneObservables: ObservablesContainer): void {
      this.sceneObservables = sceneObservables
    }

    /**
     * Adds an animation to the list.
     *
     * @param name
     * @param properties
     */
    addAnimation(id: number, animation: SpriteAnimation | MeshAnimation): void {
      this.animations.add(id, animation)
      if (animation.keyFrames) {
        animation.keyFrames.forEach((keyFrame) => {
          let keyFrameSubject: Subject<void> = this.keyFramesSubjects.get(keyFrame.id)
          if (!keyFrameSubject) {
            keyFrameSubject = this.keyFramesSubjects.add(keyFrame.id, new Subject<void>())
          }
          keyFrame.linkedSubject = keyFrameSubject
          keyFrame.timeouts = []
          keyFrame.frames.forEach((frame) => {
            keyFrame.timeouts.push((frame - animation.frameStart) * animation.delay)
          })
        })
      }
    }

    /**
     * Gets animation properties
     *
     * @param id
     * @returns
     */
    getAnimation<T = SpriteAnimation | MeshAnimation>(id: number): T {
      const animation = this.animations.get<T>(id)
      if (!animation) {
        Logger.error('Animation not found, ID:', id)
      }
      return animation
    }

    /**
     * Subscribe to a keyframe event on all animations
     *
     * @param animationId
     * @param keyFrameId
     * @returns
     */
    keyFrameSubject(keyFrameId: number): Subject<void> {
      return this.keyFramesSubjects.get(keyFrameId)
    }

    /**
     * Retrieves display object instance (not Mesh or Sprite).
     * To be used on scene loading.
     * Mesh or Sprite instances retrieving is implemented by generic actors (Actor2D, Actor3D,..).
     *
     * @param babylonJsScene
     * @returns
     */
    getDisplayObject(babylonJsScene?: BabylonJsScene): DisplayObject {
      if (!this.displayObject && babylonJsScene) {
        this.displayObject = this.createDisplayObject(babylonJsScene)
        this.setDisplayObject(this.displayObject)
        if (this.physics) {
          this.physics.start(this.displayObject)
        }
      }
      return this.displayObject
    }

    // ----------------------------
    //  Operators
    // ----------------------------

    get visible(): boolean {
      return this.displayObject.visible
    }

    set visible(visible: boolean) {
      this.displayObject.visible = visible
    }

    setPosition(position: Vector3): void {
      this.displayObject.setPosition(position)
    }

    setPositionFromFloats(x: number, y: number, z: number): void {
      this.displayObject.setPositionFromFloats(x, y, z)
    }

    incPosition(position: Vector3): void {
      this.displayObject.incX(position.x)
      this.displayObject.incY(position.y)
      this.displayObject.incZ(position.z)
    }

    incPositionFromFloats(x: number, y: number, z: number): void {
      this.displayObject.incX(x)
      this.displayObject.incY(y)
      this.displayObject.incZ(z)
    }

    getPosition(): Vector3 {
      return this.displayObject.getPosition()
    }

    setX(value: number): void {
      this.displayObject.setX(value)
    }

    incX(value: number): void {
      this.displayObject.incX(value)
    }

    getX(): number {
      return this.displayObject.getX()
    }

    setY(value: number): void {
      this.displayObject.setY(value)
    }

    incY(value: number): void {
      this.displayObject.incY(value)
    }

    getY(): number {
      return this.displayObject.getY()
    }

    setZ(value: number): void {
      this.displayObject.setZ(value)
    }

    incZ(value: number): void {
      this.displayObject.incZ(value)
    }

    getZ(): number {
      return this.displayObject.getZ()
    }

    setRotation(rotation: Vector3): void {
      this.displayObject.setRotation(rotation)
    }

    getRotation(): Vector3 {
      return this.displayObject.getRotation()
    }

    setScale(scale: number): void {
      this.displayObject.setScale(scale)
    }

    getScale(): number {
      return this.displayObject.getScale()
    }
}

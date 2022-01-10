import {experienceManagerComponent} from './scripts/experienceManager.js'
import {oneFingerRotateComponent} from './scripts/oneFingerRotate.js'
import {pinchScaleComponent} from './scripts/pinchScale.js'
import {gestureDetectorComponent} from './scripts/gesture-detector.js'
import {deviceSpawnComponent} from './scripts/deviceSpawn.js'
import {colorSelectorComponent} from './scripts/colorSelector.js'
import {animatorSelectorComponent} from './scripts/animationSelector.js'
import {cardCaptureComponent} from './scripts/cardCapture.js'
import {playVideoComponent} from './scripts/playVideo.js'
import {wallpaperChangeComponent} from './scripts/wallpaperChange.js'
import {mouseClickEventsComponent} from './scripts/mouseClickEvents.js'
import {twoFingerDragComponent} from './scripts/twoFingerDrag.js'
import {requireDataComponent} from './scripts/requireData.js'

AFRAME.registerComponent('experiencemanager', experienceManagerComponent())
AFRAME.registerComponent('one-finger-rotate', oneFingerRotateComponent())
AFRAME.registerComponent('pinch-scale', pinchScaleComponent())
AFRAME.registerComponent('gesture-detector', gestureDetectorComponent())
AFRAME.registerComponent('device-spawn', deviceSpawnComponent())
AFRAME.registerComponent('color-selector', colorSelectorComponent())
AFRAME.registerComponent('animation-selector', animatorSelectorComponent())
AFRAME.registerComponent('card-capture', cardCaptureComponent())
AFRAME.registerComponent('play-video', playVideoComponent())
AFRAME.registerComponent('wallpaper-change', wallpaperChangeComponent())
AFRAME.registerComponent('mouse-rotate', mouseClickEventsComponent())
AFRAME.registerComponent('two-finger-drag', twoFingerDragComponent())
AFRAME.registerComponent('requiredata', requireDataComponent())

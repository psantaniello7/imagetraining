const mouseClickEventsComponent = () => ({
  schema: {speed: {default: 4}},
  init() {
    const isTouchScreen = this.checkIfTouchScreen()
    this.ifMouseDown = false
    this.x_cord = 0
    this.y_cord = 0
    document.addEventListener('mousedown', this.OnDocumentMouseDown.bind(this))
    document.addEventListener('mouseup', this.OnDocumentMouseUp.bind(this))
    document.addEventListener('mousemove', this.OnDocumentMouseMove.bind(this))
    this.resetButton = document.getElementById('resetButton')
    this.playVideoButtonText = document.getElementById('playVideoButtonText')

  },

  OnDocumentMouseDown(event) {
    if (event.button === 0) {
      if (!event.shiftKey) {
        this.ifMouseDown = true
        this.x_cord = event.clientX
        this.y_cord = event.clientY
      }
    }
  },

  OnDocumentMouseUp() {
    this.ifMouseDown = false
  },

  OnDocumentMouseMove(event) {
    if (this.ifMouseDown) {
      const tempX = event.clientX - this.x_cord
      const tempY = event.clientY - this.y_cord
      if (Math.abs(tempY) < Math.abs(tempX)) {
        this.el.object3D.rotateY((tempX * this.data.speed) / 1000)
      } else {
        this.el.object3D.rotateX((tempY * this.data.speed) / 1000)
      }
      this.x_cord = event.clientX
      this.y_cord = event.clientY

      if (this.resetButton.style.display === 'none') {
        if (!this.playVideoButtonText.classList.contains('videoIsPlaying')) {
          if (!this.playVideoButtonText.classList.contains('inHand')){
            this.resetButton.style.display = 'block'
          }
        }
      }
    }
  },

  checkIfTouchScreen() {
    let touchScreen = false
    if ((navigator.appVersion.indexOf('Android') !== -1) || (navigator.appVersion.indexOf('like Mac') !== -1)) {
      touchScreen = true
    } else if ((navigator.appVersion.indexOf('Mac') !== -1) || (navigator.appVersion.indexOf('Win') !== -1) || (navigator.appVersion.indexOf('Linux') !== -1)) {
      touchScreen = false
    }
    return touchScreen
  },
})

AFRAME.registerComponent('mouse-control', {
  schema: {
    min: {default: 0.33},
    max: {default: 3},
    scale: {default: 0},
  },

  init() {
    const s = this.data.scale
    this.initialScale = (s && {x: s, y: s, z: s}) || this.el.object3D.scale.clone()
    this.scaleFactor = 1
    this.ifMouseDown = false
    this.x_cord = 0
    this.y_cord = 0
    this.shiftPressed = false

    document.addEventListener('mousedown', this.OnDocumentMouseDown.bind(this))
    document.addEventListener('mouseup', this.OnDocumentMouseUp.bind(this))
    document.addEventListener('mousemove', this.OnDocumentMouseMove.bind(this))
    document.addEventListener('wheel', this.onWheelScroll.bind(this))
    this.resetButton = document.getElementById('resetButton')
    this.playVideoButtonText = document.getElementById('playVideoButtonText')
  },

  OnDocumentMouseUp() {
    this.ifMouseDown = false
    this.shiftPressed = false
  },

  OnDocumentMouseDown(event) {
    this.ifMouseDown = true
    this.x_cord = event.clientX
    this.y_cord = event.clientY

    if (event.shiftKey) {
      this.shiftPressed = true
    }
  },

  onWheelScroll(event) {
    const delta = event.deltaY * -1
    this.scaleFactor *= 1 + delta / 500
    this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.min), this.data.max)
    this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x
    this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y
    this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z

    if (this.resetButton.style.display === 'none') {
      if (!this.playVideoButtonText.classList.contains('videoIsPlaying')) {
        if (!this.playVideoButtonText.classList.contains('inHand')){
          this.resetButton.style.display = 'block'
        }
      }
    }
  },

  OnDocumentMouseMove(event) {
    const desiredPosition = this.el.object3D.position
    if (this.ifMouseDown) {
      const tempX = event.clientX - this.x_cord
      const tempY = event.clientY - this.y_cord

      if (this.shiftPressed) {
        desiredPosition.x = this.el.object3D.position.x + tempX / 1000
        desiredPosition.y = this.el.object3D.position.y - tempY / 1000

        this.el.object3D.position.lerp(desiredPosition, 0.2)
      }
      this.x_cord = event.clientX
      this.y_cord = event.clientY

      if (this.resetButton.style.display === 'none') {
      if (!this.playVideoButtonText.classList.contains('videoIsPlaying')) {
        if (!this.playVideoButtonText.classList.contains('inHand')){
          this.resetButton.style.display = 'block'
        }
      }
    }
    }
  },
})

// AFRAME.registerComponent('one-finger-rotate', {
//   schema: {
//     factor: {default: 6},
//   },
//   init() {
//     this.handleEvent = this.handleEvent.bind(this)
//     this.el.sceneEl.addEventListener('onefingermove', this.handleEvent)
//     this.el.classList.add('cantap')

//     this.resetButton = document.getElementById('resetButton')
//   },
//   remove() {
//     this.el.sceneEl.removeEventListener('onefingermove', this.handleEvent)
//   },
//   handleEvent(event) {
//     this.el.object3D.rotation.y += event.detail.positionChange.x * this.data.factor
//     this.el.object3D.rotation.x += event.detail.positionChange.y * this.data.factor

//     if (this.resetButton !== null) {
//       if (this.resetButton.style.display === 'none') {
//         this.resetButton.style.display = 'block'
//       }
//     }
//   },
// })


AFRAME.registerComponent('two-finger-rotate', {
  schema: {
    factor: {default: 2},
  },
  init() {
    this.handleEvent = this.handleEvent.bind(this)
    this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
    this.el.classList.add('cantap')
  },
  // remove() {
  //   this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
  // },
  handleEvent(event) {
    this.el.object3D.position.x += event.detail.positionChange.x * this.data.factor
  },
})
export {mouseClickEventsComponent}

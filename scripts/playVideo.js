const playVideoComponent = () => ({
  schema: {
    deviceName: {type: 'string'},
    jsonData: {type: 'string'},
  },

  init() {
    this.jsonData = JSON.parse(this.data.jsonData)
    this.textureLoader = new THREE.TextureLoader()
    this.phone = document.getElementById(this.data.deviceName)
    this.expandUI = document.getElementById('expandContainer')
    this.expandButton = document.getElementById('expandButton')
    this.verizonLogo = document.getElementById('verizonLogo')
    this.playVideoButtonText = document.getElementById('playVideoButtonText')
    this.colorTextHolder = document.getElementById('colorText')
    this.inSpaceButton = document.getElementById('inSpaceButton')
    this.infoButton = document.getElementById('infoButton')
    this.resetButton = document.getElementById('resetButton')
    this.animations = this.jsonData.animations
    this.isTouchScreen = this.checkIfTouchScreen()
    this.animTime = 1500
    this.isVideoPlaying = false
    this.texture = null
    this.defaultRot = null
    this.rotatedRot = null
    this.resetButton.addEventListener('click', () => {
      if (!this.isVideoPlaying) {
        if (!this.isTouchScreen){
          this.el.setAttribute('rotation', '0 0 0')
        }
        else{
          this.el.setAttribute('rotation', '180 0 90')
        }

      }
    })
    this.vid = null
    this.createVideo()
    this.expandButton.addEventListener('click', () => {
      if (this.playVideoButtonText.classList.contains('videoIsPlaying')) {
        this.resetPhoneAfterVideo()
        this.playVideoButtonText.classList.remove('videoIsPlaying')
        this.isVideoPlaying = false
      }
    })

    this.checkPlatform()
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

  animateAndPlayVideo() {
    this.startPos = document.getElementById(this.data.deviceName).getAttribute('rotation')
    this.playVideoButtonText.addEventListener('click', () => {
      const device = document.getElementById(this.data.deviceName)
      this.resetButton.style.display = 'none'
      if (!this.playVideoButtonText.classList.contains('videoIsPlaying')) {

        if (this.inSpaceButton.classList.contains('active')) {
          device.setAttribute('animation__rotation', {
            property: 'rotation',
            dur: this.animTime,
            from: `${this.defaultRot}`,
            to: `${this.rotatedRot}`,
            easing: 'easeInOutCirc',
          })
          setTimeout(() => {
            device.removeAttribute('animation__rotation')
          }, this.animTime + 1)
        } else {
          const buttons = document.querySelectorAll('.flipButton')
          if (buttons.length > 0) {
            for (let i = 0; i < buttons.length; i++) {
              if (buttons[i].innerHTML === 'Front View') {
                const currentRotation = device.getAttribute('rotation')

                device.setAttribute('animation__rotation', {
                  property: 'rotation',
                  dur: this.animTime,
                  from: `0 ${currentRotation.y} 0`,
                  to: `0 ${currentRotation.y + 180} 0`,
                  easing: 'easeInOutCirc',
                })
                device.setAttribute('animation__transform', {
                  property: 'position',
                  dur: this.animTime / 2,
                  from: '0 0 0',
                  to: '0 0 .25',
                  easing: 'easeInOutCirc',
                })
                setTimeout(() => {
                  device.setAttribute('animation__transform', {
                    property: 'position',
                    dur: this.animTime / 2,
                    from: '0 0 .25',
                    to: '0 0 0',
                    easing: 'easeInOutCirc',
                  })
                }, this.animTime / 2)
                setTimeout(() => {
                  device.removeAttribute('animation__transform')
                  device.removeAttribute('animation__rotation')
                }, this.animTime + 1)
                buttons[i].innerHTML = 'Back View'
              }
            }
          }
        }
        this.playVideoAfterRotation()
        this.infoButton.classList.add('hide')
        this.infoButton.classList.remove('show')
      }
    })
  },
  playVideoAfterRotation() {
    const phone = document.getElementById(`${this.phone.id}`)
    const imgScn = phone.getObject3D('mesh').getObjectByName('BodyScreen')
    const obj = phone.getObject3D('mesh').getObjectByName('Screen')
    const texture = new THREE.VideoTexture(this.vid)
    imgScn.visible = false
    obj.visible = true

    obj.material.map = texture
    obj.material.map.flipY = false
    obj.material.map.repeat = {x: 1, y: 1}
    obj.material.map.wrapS = THREE.ClampToEdgeWrapping
    obj.material.map.wrapT = THREE.ClampToEdgeWrapping
    obj.material.map.center.set(0.5, 0.5)
    obj.material.map.rotation = THREE.MathUtils.degToRad(90)
    this.vid.play()
    this.UIAlterForVideo()
  },
  UIAlterForVideo() {
    this.expandUI.classList.remove('active')
    this.expandUI.classList.remove('inactive')
    this.expandButton.style.display = 'block'
    this.expandButton.classList.remove('active')
    this.playVideoButtonText.style.display = 'none'
    this.playVideoButtonText.classList.add('videoIsPlaying')
    this.isVideoPlaying = true
    const elements = document.querySelectorAll('.UIElement')
    if (elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none'
      }
    }
    this.verizonLogo.style.display = 'block'
  },
  UIResetAfterVideo() {
    this.expandButton.style.display = 'block'
    this.expandButton.classList.remove('active')
    this.playVideoButtonText.style.display = 'none'
  },
  resetPhoneAfterVideo() {
    const device = document.getElementById(this.data.deviceName)
    this.vid.pause()
    this.vid.currentTime = 0
    if (this.inSpaceButton.classList.contains('active')) {
      device.setAttribute('animation__rotation', {
        property: 'rotation',
        dur: this.animTime,
        from: `${this.rotatedRot}`,
        to: `${this.defaultRot}`,
        easing: 'easeInOutCirc',
      })

      setTimeout(() => {
        device.removeAttribute('animation__rotation')
      }, this.animTime + 1)
    }

    const phone = document.getElementById(`${this.phone.id}`)
    const imgScr = phone.getObject3D('mesh').getObjectByName('BodyScreen')
    const obj = phone.getObject3D('mesh').getObjectByName('Screen')
    obj.visible = false
    imgScr.visible = true
  },

  createVideo() {
    const scene = this.el.sceneEl
    this.vid = document.createElement('video')
    this.vid.id = 'videoSS'
    const videoSource = this.jsonData.promoVideo
    this.vid.setAttribute('src', `${videoSource}`)
    this.vid.setAttribute('crossorigin', 'anonymous')
    this.vid.setAttribute('controls', 'true')
    this.vid.setAttribute('webkit-playsinline', '')
    this.vid.setAttribute('playsinline', '')

    scene.appendChild(this.vid)
    this.vid.load()

    var isPlaying = true;
    this.vid.onplaying = function() {
        isPlaying = true;
    };
    this.vid.onpause = function() {
        isPlaying = false;
    };
    if (this.vid.paused && !isPlaying) {
        this.vid.play();
    }
    if (!this.vid.paused && isPlaying) {
        this.vid.pause();
    }
    this.vid.currentTime = 0
    this.vid.addEventListener('canplaythrough', () => {
      this.playVideoButtonText.classList.add('loaded')
      this.animateAndPlayVideo()
    })
  },

  checkPlatform() {
    const scene = document.querySelector('a-scene')
    let valid
    if ((navigator.appVersion.indexOf('Android') !== -1) || (navigator.appVersion.indexOf('like Mac') !== -1)) {
      this.defaultRot = '180 0 90'
      this.rotatedRot = '180 0 180'
    } else if ((navigator.appVersion.indexOf('Mac') !== -1) || (navigator.appVersion.indexOf('Win') !== -1) || (navigator.appVersion.indexOf('Linux') !== -1)) {
      this.defaultRot = '180 0 90'
      this.rotatedRot = '0 0 90'
    }
    return valid
  },
})
export {playVideoComponent}

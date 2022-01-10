
const experienceManagerComponent = () => ({
  schema: {
    deviceDataIn: {type: 'string'},
    testDataIn: {type: 'string'},
  },
  init: function () {
    this.deviceData = JSON.parse(this.data.deviceDataIn)
    this.testData = JSON.parse(this.data.testDataIn)
    const inTesting = false
    this.msgData = null

    this.isTouchScreen = this.checkIfTouchScreen()
    this.defaultPosition = new THREE.Vector3()
    this.getDefaultPos()
    this.lastKnownPosition = null
    this.defaultScale = null

    this.screenUI = document.getElementById('onScreenUIContainer')
    this.mainUI = document.getElementById('mainUIContainer')
    this.colorUI = document.getElementById('colorUIContainer')
    this.animateUI = document.getElementById('animateUIContainer')
    this.subMenu = document.getElementById('subMenuContainer')
    this.infoUI = document.getElementById('infoContainer')
    this.expandUI = document.getElementById('expandContainer')
    this.target = document.getElementById('target')
    this.resetButton = document.getElementById('resetButton')
    this.rescanIcon = document.getElementById('miniRescanButton')
    this.closeButton = document.getElementById('closeButton')
    this.whiteLine = document.getElementById('whiteLine')

    this.defaultInfo = document.getElementById('defaultInfo')
    this.inHandInfo = document.getElementById('inHandInfo')
    this.trainingInfo = document.getElementById('trainingInfo')
    this.continueButtonDefault = document.getElementById('continueButtonDefault')
    this.continueButtonInHand = document.getElementById('continueButtonInHand')
    this.helpBackgroundImage = document.getElementById('helpBackgroundImage')

    this.cardCaptureContainer = document.getElementById('cardCaptureContainer')
    this.confirmCardContainer = document.getElementById('confirmCardContainer')
    this.inHandButton = document.getElementById('inHandButton')
    this.inSpaceButton = document.getElementById('inSpaceButton')
    this.infoButton = document.getElementById('infoButton')
    this.verizonLogo = document.getElementById('verizonLogo')
    this.expandButton = document.getElementById('expandButton')
    this.flipButton = document.getElementById('flipButton')
    this.colorTextHolder = document.getElementById('colorText')
    this.infoText = document.getElementById('infoText')
    this.imageGroup = document.getElementById('image-group')
    this.flipBg = document.getElementById('flipBg')
    this.playVideoButtonText = document.getElementById('playVideoButtonText')
    this.infoText = document.getElementById('infoText')

    this.isColorMenuOpen = false
    this.isInHandOpen = false
    this.isAnimateMenuOpen = false
    this.deviceName = null
    this.selectedColor = null
    this.menuExpanded = false
    this.isInHand = false
    this.isHowToInHandDisplayFirstTime = true
    this.imageVisible = false

    this.isMenuClicked = false

    this.screenUI.style.display = 'block'
    this.mainUI.style.display = 'block'
    this.infoUI.style.display = 'block'
    this.expandUI.style.display = 'block'
    this.helpBackgroundImage.style.display = 'block'
    this.defaultInfo.style.display = 'block'
    this.inHandInfo.style.display = 'none'
    this.trainingInfo.style.display = 'none'
    this.resetButton.style.display = 'none'
    const deviceArray = []
    this.isLandscape = false
    this.isPortrait = false

    this.inHandButton.addEventListener('click', () => {
      if (this.isHowToInHandDisplayFirstTime) {
        this.isInHand = true
        this.showInfo()
        this.isHowToInHandDisplayFirstTime = false
      } else {
        if (!this.cardCaptureContainer.classList.contains('trainedImage')) {
          this.cardCaptureContainer.style.display = 'block'
        }

      }
      this.resetAndMinimizeMenu()
      this.showInHandRelatedUI()
    })

    this.inSpaceButton.addEventListener('click', () => {
      if (this.cardCaptureContainer.style.display === 'block') {
        this.cardCaptureContainer.style.display = 'none'
      }
      if (this.confirmCardContainer.style.display === 'block') {
        this.confirmCardContainer.style.display = 'none'
      }
      this.cardCaptureContainer.classList.remove('flash')
      if (this.infoText.style.display === 'block') {
        this.infoText.style.display = 'none'
      }
      this.resetAndMinimizeMenu()
      this.showInSpaceRelatedUI()
    })

    this.infoButton.addEventListener('click', () => {
      this.showInfo()
    })

    this.resetButton.addEventListener('click', () => {
      this.resetDevice()
    })

    this.expandButton.addEventListener('click', () => {
      this.expandMenu()
    })
    if (window.matchMedia('(orientation: portrait)').matches) {
    } else if (window.matchMedia('(orientation: landscape)').matches) {
    }
    window.addEventListener('resize', () => {
      if (window.matchMedia('(orientation: portrait)').matches) {
        this.verizonLogo.style.display = 'block'
        this.setPortraitUI()
      } else if (window.matchMedia('(orientation: landscape)').matches) {
        this.setLandscapeUI()
      }
    })

    if (inTesting) {
      this.msgData = this.testData
      this.loadColorMenu()
      this.showInSpaceRelatedUI()
      this.stuffToLoadAtStart()
      this.getDevice()
      this.spawnDevice(this.deviceName)
    } else {
      this.windowListener()
    }

    this.myEvent = new Event('resetAnim', {
      open: true,
      closed: false,
    })

    THREE.EventDispatcher.call(this.inHandButton)
    this.el.sceneEl.addEventListener('realityready', () => {
      // fade from black
      this.flipBg.classList.add('fade-out')
      setTimeout(() => {
        this.flipBg.classList.remove('fade-out')
        this.flipBg.style.opacity = 0
      }, 500)
    })
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

  setPortraitUI() {
    console.log("Setting styles")
    if (!this.isInHand) {
      this.colorUI.style.top = '15.5vmin'
      this.colorTextHolder.style.top = '35vmin'
    } else {
      this.colorUI.style.top = '15.5vmin'
      this.colorTextHolder.style.top = '36vmin'
    }
  },

  setLandscapeUI() {
    if (!this.isInHand) {
      this.colorUI.style.top = '15vmin'
      this.colorTextHolder.style.top = '35vmin'
    } else {
      this.colorUI.style.top = '15vmin'
      this.colorTextHolder.style.top = '35vmin'
    }
    if (this.expandUI.classList.contains('active')) {
      this.verizonLogo.style.display = 'none'
    }
  },

  stuffToLoadAtStart() {
    this.helpBackgroundImage.style.display = 'block'
    this.defaultInfo.style.display = 'block'
    this.infoUI.style.display = 'block'
    this.infoButton.style.display = 'none'
    this.inSpaceButton.style.display = 'none'
    this.inHandButton.style.display = 'none'
    this.whiteLine.style.display = 'none'
    this.colorTextHolder.style.display = 'none'
    this.resetButton.style.display = 'none'
    this.rescanIcon.style.display = 'none'

    this.continueButtonDefault.addEventListener('click', () => {
      this.infoUI.style.display = 'block'
      this.resetButton.style.display = 'none'
      this.screenUI.style.display = 'block'
      this.menuExpanded = false
      this.expandUI.classList.remove('active')
      this.expandUI.classList.remove('inactive')

      this.colorUI.classList.remove('close')
      this.colorUI.classList.remove('open')
      this.inSpaceButton.style.display = 'none'
      this.inHandButton.style.display = 'none'
      this.whiteLine.style.display = 'none'
      this.colorTextHolder.style.display = 'none'
      this.infoButton.style.display = 'none'
      this.playVideoButtonText.style.display = 'none'

      this.showUIElements(false)
      this.helpBackgroundImage.style.display = 'none'
      this.defaultInfo.style.display = 'none'
      const buttons = document.querySelectorAll('.flipButton, .animButton')
      if (buttons.length > 0) {
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].style.display = 'none'
        }
      }
    })
  },

  showInSpaceRelatedUI() {
    this.inSpaceButton.classList.add('active')
    this.inHandButton.classList.remove('active')
    this.expandUI.classList.add('inactive')
    this.infoButton.style.display = 'none'
    this.playVideoButtonText.style.display = 'none'
    this.expandButton.classList.add('inactive')
    this.expandButton.classList.remove('active')
    const buttons = document.querySelectorAll('.flipButton, .animButton')

    if (buttons.length > 0) {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.display = 'none'
      }
    }
    if (this.isInHand) {
      const device = document.querySelector(`#${this.deviceName}3D`)
      this.endInHand()
      device.setAttribute('rotation', '0 180 0')
      this.isInHand = false
      const elements = document.querySelectorAll('.UIElement')
      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = 'none'
        }
      }
      this.showUIElements(false)
    }
  },

  showInHandRelatedUI() {
    this.inSpaceButton.classList.remove('active')
    this.inHandButton.classList.add('active')
    if (this.isTouchScreen) {
      this.expandUI.classList.remove('partWayActive')
      this.expandUI.classList.remove('partWayInactive')
    }
    this.expandUI.classList.remove('active')
    this.expandUI.classList.add('inactive')
    this.infoButton.style.display = 'none'
    this.playVideoButtonText.style.display = 'none'
    this.expandButton.classList.add('inactive')
    this.expandButton.classList.remove('active')

    const buttons = document.querySelectorAll('.flipButton, .animButton')
    if (buttons.length > 0) {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.display = 'inline-block'
      }
    }
    const elements = document.querySelectorAll('.UIElement')
    if (elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none'
      }
    }
    this.showUIElements(false)
    const device = document.querySelector(`#${this.deviceName}3D`)
    this.startInHand()
    device.setAttribute('rotation', '0 0 0')
    this.isInHand = true

    this.setInHandColorButtonPosition()
  },

  setInSpaceColorButtonPosition() {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.colorUI.style.top = '15.5vmin'
      this.colorTextHolder.style.top = '35vmin'
    } else if (window.matchMedia('(orientation: landscape)').matches) {
      this.colorUI.style.top = '15vmin'
      this.colorTextHolder.style.top = '35vmin'
    }
  },

  setInHandColorButtonPosition() {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.colorUI.style.top = '15.5vmin'
      this.colorTextHolder.style.top = '36vmin'
    } else if (window.matchMedia('(orientation: landscape)').matches) {
      this.colorUI.style.top = '15vmin'
      this.colorTextHolder.style.top = '35vmin'
    }
  },

  activeMenu(button) {
    if (this.isColorMenuOpen) {
      this.inactiveMenu(button)
      this.isColorMenuOpen = false
      this.colorUI.classList.remove('open')
      this.colorUI.classList.add('close')
      this.subMenu.classList.remove('open')
      this.subMenu.classList.add('close')
      this.infoButton.classList.remove('open')
      this.infoButton.classList.add('close')
    } else {
      button.classList.add('active')
      this.isColorMenuOpen = true
      this.colorUI.classList.remove('close')
      this.colorUI.classList.add('open')
      this.subMenu.classList.remove('close')
      this.subMenu.classList.add('open')
      this.infoButton.classList.remove('close')
      this.infoButton.classList.add('open')
    }
  },

  loadColorMenu() {
    this.colorUI.classList.remove('close')
    this.colorUI.classList.add('open')
    this.subMenu.classList.remove('close')
    this.subMenu.classList.add('open')
  },

  toggleInHandMenu(button) {
    const device = document.querySelector(`#${this.deviceName}3D`)
    if (this.isInHandOpen) {
      this.inactiveMenu(button)
      this.isInHandOpen = false
      this.endInHand()
      device.setAttribute('rotation', '0 180 0')
    } else {
      button.classList.add('active')
      this.isInHandOpen = true
      this.startInHand()
      device.setAttribute('rotation', '0 180 0')
    }
  },

  inactiveMenu(button) {
    button.classList.remove('active')
  },

  spawnDevice(deviceName) {
    const devName = deviceName
    const ratingsContainer = document.createElement('a-entity')
    ratingsContainer.id = 'ratingsContainer'
    this.el.sceneEl.appendChild(ratingsContainer)

    const deviceContainer = document.createElement('a-entity')
    deviceContainer.id = 'deviceContainer'
    deviceContainer.setAttribute('device-spawn', {
      deviceName: `${deviceName}`,
      defaultColor: `${this.selectedColor}`,
    })
    this.el.sceneEl.appendChild(deviceContainer)
  },

  startInHand() {
    if (!this.isTouchScreen) {
    }
    document.getElementById('playVideoButtonText').classList.add('inHand')
    if (this.cardCaptureContainer.classList.contains('trainedImage')) {
      this.setImageTracking()
      this.imageGroup.setAttribute("visible", "true")
    } else {}
    this.resetDevice()
    const confirm = document.getElementById('confirmButton')
    const container = document.getElementById('deviceParent')
    const device = document.querySelector(`#${this.deviceName}3D`)
    const {bodyMesh} = JSON.parse(device.getAttribute('color-selector').jsonData)
    const targetMesh = bodyMesh
    const obj = device.getObject3D('mesh').getObjectByName('Body')
    const {material} = obj
    this.getProperties()
    const {target} = this

    device.flushToDOM()
    const copy = device.cloneNode()
    if (!this.isTouchScreen) {
      container.removeAttribute('mouse-control')
      copy.removeAttribute('mouse-rotate')
    } else {
      copy.removeAttribute('two-finger-drag')
      copy.removeAttribute('one-finger-rotate')
      copy.removeAttribute('pinch-scale')
    }

    copy.setAttribute('scale', '1 1 1')
    copy.setAttribute('position', '0 0 0')
    copy.setAttribute('rotation', '0 0 0')
    copy.removeAttribute('shadow')

      if (!this.cardCaptureContainer.classList.contains('trainedImage')) {
        copy.setAttribute('visible', false)
        confirm.addEventListener('click', () => {
          copy.setAttribute('visible', true)
        })
      } else {
        copy.setAttribute('visible', true)
      }


    target.appendChild(copy)

    device.parentNode.removeChild(device)



    const buttons = document.querySelectorAll('.flipButton')
    this.animateUI.classList.add('show')
    this.animateUI.classList.remove('hide')
    this.resetAndMinimizeMenu()
  },

  endInHand() {
    if (!this.isTouchScreen) {
    }
    this.removeImageTracking()
    this.rescanIcon.style.display = 'none'
    const device = document.querySelector(`#${this.deviceName}3D`)
    const {bodyMesh} = JSON.parse(device.getAttribute('color-selector').jsonData)
    const targetMesh = bodyMesh
    const obj = device.getObject3D('mesh').getObjectByName('Body')
    const {material} = obj
    const container = document.getElementById('deviceParent')
    const {target} = this
    device.flushToDOM()
    const copy = device.cloneNode()

    if (!this.isTouchScreen) {
      container.setAttribute('mouse-control', '')
      copy.setAttribute('mouse-rotate', '')
    } else {
      copy.setAttribute('two-finger-drag', '')
      copy.setAttribute('one-finger-rotate', '')
      copy.setAttribute('pinch-scale', '')
    }
    copy.setAttribute('scale', `${this.defaultScale}`)
    copy.setAttribute('position', '0 0 0')
    copy.setAttribute('rotation', '180 0 90')
    copy.setAttribute('shadow', 'receive: false')
    copy.setAttribute('visible', true)
    container.setAttribute('position', this.lastKnownPosition)
    container.appendChild(copy)
    device.parentNode.removeChild(device)
    this.animateUI.classList.add('hide')
    this.animateUI.classList.remove('show')
    this.resetAndMinimizeMenu()
    this.inHandButton.dispatchEvent(this.myEvent)
    this.playVideoButtonText.classList.remove('inHand')
    this.resetDevice()
  },

  showInfo() {

    let infoScreen
    let resetNeeded
    let continueButton
    if (this.isInHand) {
      infoScreen = this.inHandInfo
      continueButton = this.continueButtonInHand
      this.resetDevice()
    } else {
      infoScreen = this.defaultInfo
      continueButton = this.continueButtonDefault
    }

    if (this.resetButton.style.display === 'block') {
      resetNeeded = true
    } else {
      resetNeeded = false
    }

    this.inSpaceButton.style.display = 'none'
    this.inHandButton.style.display = 'none'
    this.whiteLine.style.display = 'none'
    this.colorTextHolder.style.display = 'none'
    this.infoButton.style.display = 'none'
    this.resetButton.style.display = 'none'
    this.screenUI.style.display = 'none'
    if (window.matchMedia('(orientation: landscape)').matches) {
      this.verizonLogo.style.display = 'block'
    }
    this.helpBackgroundImage.style.display = 'block'
    infoScreen.style.display = 'block'

    this.colorUI.classList.remove('close')
    this.colorUI.classList.remove('open')

    this.menuExpanded = false
    this.expandUI.classList.remove('active')
    this.expandUI.classList.remove('inactive')
    continueButton.addEventListener('click', () => {
      if (this.isHowToInHandDisplayFirstTime) {
        this.isHowToInHandDisplayFirstTime = false
      }
      if (continueButton === this.continueButtonInHand) {
        this.cardCaptureContainer.style.display = 'block'
      }
      this.screenUI.style.display = 'block'
      this.menuExpanded = false

      this.helpBackgroundImage.style.display = 'none'
      infoScreen.style.display = 'none'

      this.expandUI.classList.remove('active')
      this.expandUI.classList.remove('inactive')
      this.expandButton.classList.add('inactive')
      this.expandButton.classList.remove('active')
      const elements = document.querySelectorAll('.UIElement')
      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = 'none'
        }
      }
      if (this.isInHand) {
        const buttons = document.querySelectorAll('.flipButton, .animButton')
        if (buttons.length > 0) {
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.display = 'none'
          }
        }
      }
      this.showUIElements(false)
      if (resetNeeded) {
        if (this.isInHand){
          this.resetButton.style.display = 'none'
        }
        else{
          this.resetButton.style.display = 'block'

        }

      }
    })
  },

  resetDevice() {
    this.resetButton.style.display = 'none'
    const device = document.querySelector(`#${this.deviceName}3D`)
    const parent = document.querySelector('#deviceParent')
    parent.setAttribute('scale', '1 1 1')
    parent.setAttribute('position', `${this.defaultPosition.x} ${this.defaultPosition.y} ${this.defaultPosition.z}`)

    if (!this.isTouchScreen) {
      parent.removeAttribute('mouse-control')
      parent.setAttribute('mouse-control')
    } else {
      parent.removeAttribute('pinch-scale')
      parent.setAttribute('pinch-scale', '')
    }
    this.resetButton.style.display = 'none'
  },

  getDeviceName(msg) {
    const brand = msg.brandName
    const disName = msg.productDisplayName
    const name = disName.split(' ').join('')
    const selColor = msg.childSkus[0].color
    const color = selColor.split(' ').join('')
    const {deviceName} = this.deviceData.brands[brand][name]
    this.selectedColor = color

    return deviceName
  },

  expandMenu() {
    this.isMenuClicked = true
    if ((this.cardCaptureContainer.style.display === 'block' || this.confirmCardContainer.style.display === 'block') && this.isTouchScreen) {
      if (!this.expandUI.classList.contains('partWayActive')) {
         const elements = document.querySelectorAll('.UIElement')
        if (elements.length > 0) {
          for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'block'
          }
        }
        this.expandUI.classList.remove('inactive')
        this.expandUI.classList.remove('active')
        this.expandUI.classList.add('partWayActive')
        this.expandUI.classList.remove('partWayInactive')
        this.expandButton.classList.add('active')
        this.playVideoButtonText.style.display = 'none'
        this.infoButton.style.display = 'none'


        this.showUIElements(true)
        if (window.matchMedia('(orientation: landscape)').matches) {
          this.verizonLogo.style.display = 'none'
        }
      } else if (this.expandUI.classList.contains('partWayActive')) {
        this.expandUI.classList.remove('inactive')
        this.expandUI.classList.remove('active')
        this.expandUI.classList.add('partWayInactive')
        this.expandUI.classList.remove('partWayActive')
        this.expandButton.classList.remove('active')
        const elements = document.querySelectorAll('.UIElement')
        if (elements.length > 0) {
          for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none'
          }
        }
        this.showUIElements(true)
        if (window.matchMedia('(orientation: landscape)').matches) {
          this.verizonLogo.style.display = 'none'
        }
      }
    } else {
      if (!this.expandUI.classList.contains('active')) {
      this.colorUI.classList.remove('close')
      this.colorUI.classList.add('open')
      this.expandUI.classList.remove('partWayActive')
      this.expandUI.classList.remove('partWayInactive')
      this.expandUI.classList.add('active')
      this.expandUI.classList.remove('inactive')
      this.expandButton.classList.add('active')

      const elements = document.querySelectorAll('.UIElement')
      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = 'block'
        }
      }
      if (this.isInHand) {

          const buttons = document.querySelectorAll('.flipButton, .animButton')
          if (buttons.length > 0) {
            for (let i = 0; i < buttons.length; i++) {
              buttons[i].style.display = 'inline-block'
              if (buttons[i].id === 'openButton') {
                buttons[i].style.display = 'none'
              }
            }
          }

      }
      this.showUIElements(true)
      if (window.matchMedia('(orientation: landscape)').matches) {
        this.verizonLogo.style.display = 'none'
      }
    } else if (this.expandUI.classList.contains('active')) {
      this.colorUI.classList.remove('close')
      this.colorUI.classList.remove('open')
      this.expandUI.classList.add('inactive')
      this.expandUI.classList.remove('active')
      this.expandButton.classList.remove('active')

      const elements = document.querySelectorAll('.UIElement')
      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = 'none'
        }
      }
      if (this.isInHand) {

          const buttons = document.querySelectorAll('.flipButton, .animButton')
          if (buttons.length > 0) {
            for (let i = 0; i < buttons.length; i++) {
              buttons[i].style.display = 'none'
            }
          }

      }
      this.showUIElements(false)
      if (window.matchMedia('(orientation: landscape)').matches) {
        this.verizonLogo.style.display = 'block'
      }
    }
    }
  },

  showUIElements(show) {
    if (show === true) {
      this.inSpaceButton.classList.remove('hide')
      this.inSpaceButton.classList.add('show')
      this.inHandButton.classList.remove('hide')
      this.inHandButton.classList.add('show')
      this.whiteLine.classList.remove('hide')
      this.whiteLine.classList.add('show')
      this.colorTextHolder.classList.remove('hide')
      this.colorTextHolder.classList.add('show')
      this.infoButton.classList.remove('hide')
      this.infoButton.classList.add('show')
      this.playVideoButtonText.classList.remove('hide')
      this.playVideoButtonText.classList.add('show')
      if (this.isInHand) {
        const buttons = document.querySelectorAll('.flipButton, .animButton')
        if (buttons.length > 0) {
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('hide')
            buttons[i].classList.add('show')
          }
        }
      }
    } else {
      this.inSpaceButton.classList.remove('show')
      this.inSpaceButton.classList.add('hide')
      this.inHandButton.classList.remove('show')
      this.inHandButton.classList.add('hide')
      this.whiteLine.classList.remove('show')
      this.whiteLine.classList.add('hide')
      this.colorTextHolder.classList.remove('show')
      this.colorTextHolder.classList.add('hide')
      this.infoButton.classList.remove('show')
      this.infoButton.classList.add('hide')
      this.playVideoButtonText.classList.remove('show')
      this.playVideoButtonText.classList.add('hide')
      if (this.isInHand) {
        const buttons = document.querySelectorAll('.flipButton, .animButton')
        if (buttons.length > 0) {
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('show')
            buttons[i].classList.add('hide')
          }
        }
      }
    }
  },

  getDevice() {
    this.deviceName = this.getDeviceName(this.msgData)
  },

  windowListener() {

    const listen = (e) => {
      if (e.data.search('brand')) {
      this.msgData = JSON.parse(e.data)
      this.getDevice()
      this.spawnDevice(this.deviceName)
      this.loadColorMenu()
      this.showInSpaceRelatedUI()
      this.stuffToLoadAtStart()
      window.removeEventListener('message', (e) => { listen(e)})
      }

    }

    window.addEventListener('message', e => {
      listen(e)
    })

  },

  addXRWeb() {
    if (!this.isTouchScreen) {
      this.scene.removeAttribute('xrweb')
      XR8.XrController.configure({disableWorldTracking: true})
      this.scene.setAttribute('xrweb', {
        allowedDevices: 'any',
        mirroredDisplay: true,
      })
    }
  },

  getProperties() {
    const parent = document.getElementById('deviceParent').getObject3D('mesh')
    const position = new THREE.Vector3()
    position.getPositionFromMatrix(parent.matrixWorld)
    const scale = document.querySelector(`#${this.deviceName}3D`).getAttribute('scale')
    this.lastKnownPosition = `${position.x} ${position.y} ${position.z}`
    this.defaultScale = `${scale.x} ${scale.y} ${scale.z}`
  },

  getDefaultPos() {
    let position
    if (this.isTouchScreen) {
      this.defaultPosition = {x: 0, y: 0, z: 0}
    } else {
      this.defaultPosition = {x: 1.5, y: 0, z: 0}
    }
  },

  manageXRWeb(state) {
    this.flipBg.style.opacity = 1
    const scene = this.el.sceneEl

    if (state === 'start') {
      scene.removeAttribute('xrface')
      scene.setAttribute('xrweb', {
        mirroredDisplay: true,
        allowedDevices: 'any',
        disableWorldTracking: true,
      })
    } else if (state === 'end') {
      scene.removeAttribute('xrweb')
      scene.setAttribute('xrface', {
        mirroredDisplay: true,
        allowedDevices: 'any',
      })

      document.getElementById('camera').setAttribute('rotation', '0 0 0')
    }
  },

  resetAndMinimizeMenu() {
    this.expandUI.classList.remove('active')
    this.expandUI.classList.add('inactive')
    this.expandButton.classList.add('inactive')
    this.expandButton.classList.remove('active')
    this.menuExpanded = false
    this.playVideoButtonText.classList.remove('show')
    this.playVideoButtonText.classList.add('hide')
    this.infoButton.classList.remove('show')
    this.infoButton.classList.add('hide')
    this.inSpaceButton.classList.remove('show')
    this.inSpaceButton.classList.add('hide')
    this.inHandButton.classList.remove('show')
    this.inHandButton.classList.add('hide')
    this.whiteLine.classList.remove('show')
    this.whiteLine.classList.add('hide')
    this.colorTextHolder.classList.remove('show')
    this.colorTextHolder.classList.add('hide')
    this.resetButton.classList.remove('show')
    this.resetButton.classList.add('hide')

    this.inSpaceButton.style.display = 'none'
    this.inHandButton.style.display = 'none'
    this.whiteLine.style.display = 'none'

    this.colorUI.classList.remove('open')
    this.colorUI.classList.add('close')
    this.subMenu.classList.remove('open')
    this.subMenu.classList.add('close')

    if (!this.isInHand) {
      this.animateUI.classList.remove('show')
      this.animateUI.classList.add('hide')
    }
  },

  isVisible() {
    this.infoText.innerHTML = ''
    this.imageGroup.setAttribute("visible", "true")
    this.imageVisible = true
  },

  isNotVisible() {
    this.imageVisible = false
    this.infoText.innerHTML = 'Your image is out of view'
    setTimeout(() => {
      if (this.imageVisible === false) {
        this.imageGroup.setAttribute("visible", "false")
      }
    }, 500)
  },

  setImageTracking() {
    this.infoText.innerHTML = 'Your image is out of view'

    this.imageGroup.addEventListener("zappar-visible" , () => {
      this.isVisible()
    })

    this.imageGroup.addEventListener("zappar-notvisible", () => {
      this.isNotVisible()
    })
  },

  removeImageTracking() {
    this.infoText.innerHTML = ''
    this.imageGroup.removeEventListener('zappar-visible', () => {
      this.isVisible()
    })

    this.imageGroup.removeEventListener("zappar-notvisible", () => {
      this.isNotVisible()
    })
    this.imageGroup.setAttribute("visible", "false")
  },
})
export {experienceManagerComponent}


const deviceSpawnComponent = () => ({
  schema: {
    deviceName: {type: 'string'},
    defaultColor: {type: 'string'},
  },
  init: function () {
    var experienceManagerComponent = document.querySelector('a-scene').components.experiencemanager
    this.instantGroup = document.getElementById('instant-group')
    this.reticle = document.getElementById('reticle3D')
    this.deviceData = experienceManagerComponent.deviceData
    this.ratingsContainer = document.getElementById('ratingsContainer')
    this.currentRating = null
    const displayTime = 1
    this.jsonData = null
    this.deviceHeight = null
    this.calculateRating()
    this.deviceSrc = null
    this.animArray = null
    this.refineJson(this.data.deviceName)
    this.isDesktop = this.checkForDesktop()
    this.spawnDevice(this.data.deviceName)
  },


  spawnDevice(name) {
    this.instantGroup.setAttribute("zappar-instant", "placement-mode: false");
    const device = document.createElement('a-entity')
    const parent = document.createElement('a-entity')
    parent.id = 'deviceParent'
    device.id = `${this.data.deviceName}3D`
    const modelSource = `${this.deviceSrc}`
    if (this.isDesktop) {
      parent.setAttribute('position', '1.5 0 0')
      parent.setAttribute('mouse-control', '')
      device.setAttribute('scale', '0.5 0.5 0.5')
      device.setAttribute('mouse-rotate', '')

    } else {
      device.setAttribute('rotation', '180 0 90')
      parent.setAttribute('pinch-scale', '')
      device.setAttribute('scale', '1 1 1')
      device.setAttribute('one-finger-rotate', '')
      device.setAttribute('two-finger-drag', '')
    }
    this.el.appendChild(parent)
    parent.addEventListener('model-loaded', () => {
      this.testMesh(parent)
    })
    device.setAttribute('gltf-model', modelSource)
    device.setAttribute('position', '0 0 0')

    device.setAttribute('class', 'cantap')

    device.setAttribute('color', `${this.data.defaultColor}`)
    device.setAttribute('color-selector', {
      deviceName: `${device.id}`,
      jsonData: `${JSON.stringify(this.jsonData)}`,
    })
    device.setAttribute('play-video', {
      deviceName: `${device.id}`,
      jsonData: `${JSON.stringify(this.jsonData)}`,
    })

    device.setAttribute('wallpaper-change', {
      deviceName: `${device.id}`,
      jsonData: `${JSON.stringify(this.jsonData)}`,
    })
    device.setAttribute('shadow', 'receive: false')

    parent.appendChild(device)

    this.instantGroup.appendChild(parent)

    device.addEventListener('model-loaded', () => {
      device.setAttribute('animation-selector', {
        deviceName: `${device.id}`,
        jsonData: `${JSON.stringify(this.jsonData)}`,
      })
      this.setDevicePos()
      this.hideScreenMesh()
    })
  },

  calculateRating() {
    this.currentRating = 3
  },

  refineJson(device) {
    const json = this.deviceData
    for (const key in json) {
      const brands = json[key]
      for (const dev in brands) {
        const devices = brands[dev]
        for (const id in devices) {
          const devName = devices[id]
          if (this.data.deviceName === devName.deviceName) {
            this.jsonData = devName
            this.deviceSrc = this.jsonData.model3d
            this.animArray = this.jsonData.animations
          }
        }
      }
    }
  },

  setDevicePos() {
    const dev = document.getElementById(`${this.data.deviceName}3D`)
    const device = dev.getObject3D('mesh')
    const box = new THREE.Box3().setFromObject(device)
    this.deviceHeight = box.getSize().y / 15
    dev.setAttribute('position', `0 ${this.deviceHeight} 0`)
  },

  getHeight() {
    return devHeight
  },

  hideScreenMesh() {
    const phone = document.getElementById(`${this.data.deviceName}3D`)

    const obj = phone.getObject3D('mesh').getObjectByName('Screen')
    obj.visible = false
  },

  checkForDesktop() {
    const scene = document.querySelector('a-scene')

    let valid
    if ((navigator.appVersion.indexOf('Android') !== -1) || (navigator.appVersion.indexOf('like Mac') !== -1)) {
      valid = false
    } else if ((navigator.appVersion.indexOf('Mac') !== -1) || (navigator.appVersion.indexOf('Win') !== -1) || (navigator.appVersion.indexOf('Linux') !== -1)) {
      valid = true
    }
    return valid
  },

  testMesh(parent) {
    parent.setAttribute('geometry', {
      primitive: 'sphere',
      radius: .1,
    })
    if(parent.getObject3D('mesh')!=null)
      parent.getObject3D('mesh').visible = false
  },

})
export {deviceSpawnComponent}


const wallpaperChangeComponent = () => ({
  schema: {
    deviceName: {type: 'string'},
    jsonData: {type: 'string'},
  },

  init() {
    var experienceManagerComponent = document.querySelector('a-scene').components.experiencemanager
    this.deviceData = experienceManagerComponent.deviceData
    this.playVideoButtonText = document.getElementById('playVideoButtonText')

    this.jsonData = JSON.parse(this.data.jsonData)
    this.phone = document.getElementById(this.data.deviceName)
    this.canChange = true
    const texture = null
    this.texArray = []
    this.createTexArray()
    this.changeWallpaper()
  },

  changeWallpaper() {
    const phone = document.getElementById(`${this.phone.id}`)
    phone.setAttribute('class', 'cantap')
    let count = 0

    phone.addEventListener('click', () => {
      if (this.playVideoButtonText.classList.contains('videoIsPlaying')) {
        this.canChange = false
      } else {
        this.canChange = true

        const imgScn = phone.getObject3D('mesh').getObjectByName('BodyScreen')
        const obj = phone.getObject3D('mesh').getObjectByName('Screen')
        const texture = this.texArray[count]
        if (count === this.texArray.length) {
          count = 0
          imgScn.visible = true
        obj.visible = false
        } else {
          count += 1
          imgScn.visible = false
        obj.visible = true

        obj.material.map = texture
        obj.material.map.flipY = false
        obj.material.map.wrapS = THREE.ClampToEdgeWrapping
        obj.material.map.wrapT = THREE.ClampToEdgeWrapping
        obj.material.map.rotation = 0
        }
      }
    })
  },

  createTexArray() {
    let texture
    let material
    let materialArray = []
    const wallpaperTextures = this.deviceData.wallpapers

    for (let i = 0; i < wallpaperTextures.length; i++) {
      texture = `${wallpaperTextures[i]}`
      texture = new THREE.TextureLoader().load(texture)
      this.texArray.push(texture)
    }
  },
})
export {wallpaperChangeComponent}

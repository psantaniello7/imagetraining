const twoFingerDragComponent = () => ({
  schema: {
  	factor: {default: 3}
  },
  init: function () {
        this.handleEvent = this.handleEvent.bind(this)
        this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
        this.el.classList.add('cantap')
        this.resetButton = document.getElementById('resetButton')
        this.playVideoButtonText = document.getElementById('playVideoButtonText')

  },

  handleEvent(event) {
      this.el.object3D.position.z -= event.detail.positionChange.y * this.data.factor
      this.el.object3D.position.x += event.detail.positionChange.y * this.data.factor
      this.el.object3D.position.y -= event.detail.positionChange.x * this.data.factor
      if (this.resetButton.style.display === 'none') {
        if (!this.playVideoButtonText.classList.contains('videoIsPlaying')) {
          if (!this.playVideoButtonText.classList.contains('inHand')){
            this.resetButton.style.display = 'block'
          }
        }
      }
  },
})
export {twoFingerDragComponent}

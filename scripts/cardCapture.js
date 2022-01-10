const cardCaptureComponent = () => ({
  init() {
    const container = document.getElementById('cardCaptureContainer')
    const image = document.getElementById('cardCaptureImage')
    const cardAlign = document.getElementById('cardAlign')
    const nextButton = document.getElementById('nextButton')
    const imageTarget = document.getElementById('target')
    const confirmationContainer = document.getElementById('confirmCardContainer')
    const expandContainer = document.getElementById('expandContainer')
    this.confirmedImage = document.getElementById('cardImage')
    const greenBoundedBox = document.getElementById('greenBoundedBox')
    const rescanButton = document.getElementById('rescanButton')
    const rescanIcon = document.getElementById('miniRescanButton')
    const confirmButton = document.getElementById('confirmButton')
    const trainingInfo = document.getElementById('trainingInfo')
    this.infoText = document.getElementById('infoText')
    this.boundingBox = document.getElementById('boundedBox')
    this.imageGroup = document.getElementById('image-group')
    this.trainedImage = null
    this.boundingWidth = null
    this.boundingHeight = null
    this.imageVisible = false

    this.isVisible = this.isVisible.bind(this)
    this.isNotVisible = this.isNotVisible.bind(this)
    nextButton.addEventListener('click', () => {
      var scene = this.el
      document.getElementById('tempHolder').style.display = 'block'
      confirmButton.style.display = "none"
      rescanButton.style.display = "none"
      const topPos = document.getElementById('boundedBox').getBoundingClientRect().top
      const leftPos = document.getElementById('boundedBox').getBoundingClientRect().left
      document.getElementById('cropped').style.margin=`${topPos} 0px 0px ${leftPos}`
      const boxWidth = document.getElementById('boundedBox').offsetWidth
      const boxHeight = document.getElementById('boundedBox').offsetHeight
      document.getElementById('cropped').style.width = boxWidth
      document.getElementById('cropped').style.height = boxHeight
      document.getElementById('tempHolder').style.width = window.innerWidth;
      document.getElementById('tempHolder').style.height = window.innerHeight;
      console.log(window.innerWidth + " : " + window.innerHeight)

      document.getElementById('tempHolder').style.margin=`${-topPos} 0px 0px ${-leftPos}`


      var screenshot = scene.renderer.domElement.toDataURL('image/jpeg');
      document.getElementById('tempHolder').src = screenshot

      const addListeners = () => {
        this.addTrackingListeners()
      }

      document.getElementById('cardImage').src = "./assets/images/UI/Loader.gif"
      function b64toBlob(b64Data, contentType, sliceSize) {
          contentType = contentType || '';
          sliceSize = sliceSize || 512;

          var byteCharacters = atob(b64Data);
          var byteArrays = [];

          for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
              var slice = byteCharacters.slice(offset, offset + sliceSize);

              var byteNumbers = new Array(slice.length);
              for (var i = 0; i < slice.length; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
              }

              var byteArray = new Uint8Array(byteNumbers);

              byteArrays.push(byteArray);
          }

          var blob = new Blob(byteArrays, { type: contentType });
          return blob;
      }
      html2canvas(document.getElementById("boundedBox"), {
          letterRendering: 1,
          allowTaint: true,
          useCORS: true,
      })
      .then(function (canvas) {
          html2canvas(document.getElementById("cropped"), {
          letterRendering: 1,
          allowTaint: true,
          useCORS: true,

      })
        .then(function (canvas) {
            var updatedScreenshot = canvas.toDataURL('image/jpeg', 1.0);
            document.getElementById('cardImage').src = updatedScreenshot
            confirmButton.style.display = "block"
            rescanButton.style.display = "block"
            document.getElementById('tempHolder').removeAttribute('src')
            var ImageURL = updatedScreenshot
            // Split the base64 string in data and contentType
            var block = ImageURL.split(";");
            // Get the content type of the image
            var contentType = block[0].split(":")[1];// In this case "image/gif"
            // get the real base64 content of the file
            var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

            // Convert it to a blob to upload
            var blob = b64toBlob(realData, contentType);


            // Create a FormData and append the file with "image" as parameter name
            var formData = new FormData();
            formData.append("file", blob);
            async function trainImage() {

              const createNode = (elem) => {
                  return document.createElement(elem);
              };

              // append an element to parent
              const appendNode = (parent, elem) => {
                  parent.appendChild(elem);
              }
                axios.post("https://image-training-server.herokuapp.com/train_target", formData, {})
                // axios.post("https://localhost:4001/train_target", formData, {})
                    .then(res => {
                      if (res?.status === 200) {
                        if (res?.data?.data.data != null) {
                          var arrayBufferView = new Uint8Array(res.data.data.data)
                          var imageBlob = new Blob([arrayBufferView], { type: "zpt"})
                          const imageObjectURL = URL.createObjectURL(imageBlob)
                          document.getElementById('target-file').setAttribute('src', imageObjectURL)
                          document.getElementById('image-group').setAttribute('zappar-image', 'target: #target-file')
                          trainingInfo.style.display = 'none'
                          rescanIcon.style.display = 'block'
                          console.log('Trained image returned')
                          addListeners()
                        }
                      }
                    }).catch((err) => {
                        console.log(err)
                    });
            }
            trainImage();
        })
        .catch((e) => {
              console.log(e);
        })
      })
      .catch((e) => {
          console.log(e);
      });
      container.classList.add('flash')

      container.classList.remove('photo')
      container.style.display = 'none'
      confirmationContainer.style.display = 'block'
      if (this.infoText.style.display === 'none') {
        this.infoText.style.display = 'block'
      }
    })

    rescanButton.addEventListener('click', () => {
      container.classList.remove('flash')
      confirmationContainer.style.display = 'none'
      container.style.display = 'block'
      document.getElementById('cardImage').src = null
    })

    confirmButton.addEventListener('click', () => {
      container.classList.remove('flash')
      container.classList.add('trainedImage')
      confirmationContainer.style.display = 'none'
      trainingInfo.style.display = 'block'
      this.infoText.innerHTML = 'Training your image'
      this.imageGroup.setAttribute("visible", "false")
    })

    rescanIcon.addEventListener('click', () => {
      rescanIcon.style.display = 'none'
      this.imageGroup.setAttribute("visible", "false")
      this.removeTrackingListeners()
      container.classList.remove('trainedImage')
      container.style.display = 'block'
    })

    this.el.sceneEl.addEventListener('screenshotready', (e) => {
      container.classList.remove('flash')
      if (!e.detail) {
        return
      }
      image.src = `data:image/jpeg;base64,${e.detail}`
      const outputImageAspectRatio = 1.75
      const inputImage = new Image()
      const output = null

      inputImage.onload = () => {
        const inputWidth = inputImage.naturalWidth
        const inputHeight = inputImage.naturalHeight

        const inputImageAspectRatio = inputWidth / inputHeight

        const outputWidth = 336
        const outputHeight = 192
        const outputImage = document.createElement('canvas')

        outputImage.width = outputWidth
        outputImage.height = outputHeight

        const imageX = -1 * ((inputWidth / 2) - (outputWidth / 2))
        const imageY = -1 * ((inputHeight / 2) - (outputHeight / 2))

        const ctx = outputImage.getContext('2d')
        ctx.drawImage(inputImage, imageX, imageY)
        ctx.scale(3 / 4, 3 / 4)
        outputImage.classList.add('testing')
        const newImage = new Image()
        newImage.src = outputImage.toDataURL('image/png')

        this.addImageElement(newImage)
      }

      // start loading our image
      inputImage.src = image.src
      // If an error occurs while trying to take the screenshot, e.detail will be empty.
      // We could either retry or return control to the user

      // Show the photo
      // container.classList.add('photo')

      // this.addImageElement(image)
    })
  },

  spawnPhone(name, target) {
    const device = document.createElement('a-entity')
    device.id = `${this.data.deviceName}3D`

    device.setAttribute('gltf-model', `#${name}`)
    device.setAttribute('position', '0 0 0')
    device.setAttribute('scale', '.37 .37 .37')
    device.setAttribute('rotation', '0 0 0')
    device.setAttribute('class', 'cantap')
    target.appendChild(device)

    device.setAttribute('color', `${this.data.defaultColor}`)
    device.setAttribute('color-selector', {
      deviceName: `${device.id}`,
      jsonData: `${JSON.stringify(this.jsonData)}`,
    })
    device.setAttribute('play-video', {
      deviceName: `${device.id}`,
      jsonData: `${JSON.stringify(this.jsonData)}`,
    })

    device.addEventListener('model-loaded', () => {
      device.setAttribute('animation-selector', {
        deviceName: `${device.id}`,
        jsonData: `${JSON.stringify(this.jsonData)}`,
      })
    })
  },

  addImageElement(image) {
    const elem = this.confirmedImage
    elem.src = image.src
    elem.setAttribute('height', '200')
    elem.setAttribute('width', '350')
    // elem.setAttribute('alt', 'Flower')
    document.getElementById('confirmCardContainer').appendChild(elem)
  },

  setBoundDimensions() {
    this.boudingWidth = this.boundingBox.style.width
    this.boundingHeight = this.boundingBox.style.height
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

  addTrackingListeners() {
    this.infoText.innerHTML = 'Your image is out of view'
    this.imageGroup.addEventListener("zappar-visible" ,this.isVisible)
    this.imageGroup.addEventListener("zappar-notvisible", this.isNotVisible)
  },

  removeTrackingListeners() {
    this.infoText.innerHTML = ''
    this.imageGroup.removeEventListener("zappar-visible" , this.isVisible)
    this.imageGroup.removeEventListener("zappar-notvisible", this.isNotVisible)
  },
})

export {cardCaptureComponent}

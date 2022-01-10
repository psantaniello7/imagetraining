const INNER_FRAME_URL = '/indexExp.html'

const iphone12Button = document.getElementById('iphone12-button')
const iphone13Button = document.getElementById('iphone13-button')
const s21Button = document.getElementById('s21-button')
const zFlipButton = document.getElementById('z-flip-button')
const a02Button = document.getElementById('a02-button')
const a12Button = document.getElementById('a12-button')
const a42Button = document.getElementById('a42-button')
const pixel6Button = document.getElementById('pixelPro-button')

const closeButton = document.getElementById('stopBtn')
const iframe = document.getElementById('my-iframe')
const controls = document.getElementById('iframeControls')

var dataJson
var thismessage = null

//Uses URL parameters to auto-load AR i.e. QR from Bluejeans AR
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const device = urlParams.get('device')

createListeners()

function startAR(device) {
	let thismessage = JSON.stringify(dataJson)
	window.XRIFrame.registerXRIFrame('my-iframe')
	iframe.setAttribute('src', INNER_FRAME_URL)
	controls.style.display = 'block'
	iframe.addEventListener('load', function() {
    setTimeout(() => {
      iframe.contentWindow.postMessage(thismessage,'*')
      thismessage = null
    }, 1000)
  })

	toggleFullscreen()
}

function createListeners() {
	iphone12Button.addEventListener('click', () => {
		createData('iphone12')
	})

	iphone13Button.addEventListener('click', () => {
		createData('iphone13')
	})

	zFlipButton.addEventListener('click', () => {
		createData('z-flip')
	})

	s21Button.addEventListener('click', () => {
		createData('s21')
	})

	a02Button.addEventListener('click', () => {
		createData('a02')
	})

	a12Button.addEventListener('click', () => {
		createData('a12')
	})

	a42Button.addEventListener('click', () => {
		createData('a42')
	})

	pixel6Button.addEventListener('click', () => {
		createData('pixel6')
	})

	closeButton.addEventListener('click', ()=>{
		stopAR()
	})
}

const createData = (device) =>{
	fetch('start-data.json')
	.then(response => response.json())
	.then(json => saveData(json, device))
}

const saveData = (data, device) => {
	dataJson = data[device]
	startAR()
}

function toggleFullscreen() {
	document.getElementById('my-iframe').classList.remove('closed')
	document.getElementById('my-iframe').classList.toggle('fullscreen-iframe')
}

function stopAR() {
	window.XRIFrame.deregisterXRIFrame()
		iframe.classList.toggle('fullscreen-iframe')
		iframe.setAttribute('src', '')
		iframe.classList.add('closed')
		controls.style.display = 'none'
		thismessage = null
}

if (device != null) {
  console.log(device)
	createData(device)

} else {
  console.log('No Device Parameters Found')
}

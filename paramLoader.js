console.log('Parameter Loading Started')

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const device = urlParams.get('device')


if (device != null) {
  console.log(device)
} else {
  console.log('No Device Parameter Found')
}

import {MDCRipple} from '@material/ripple'
import {MDCTextField} from '@material/textfield'

const POLL_MS = 5000

if (window.location.pathname == '/') {
  const username = new MDCTextField(document.querySelector('.username'))
  new MDCRipple(document.querySelector('.next'))
  document.querySelector('.login').addEventListener('submit', () => {
    document.querySelector('.page-1').style.display = 'none'
    document.querySelector('.page-2').style.display = 'flex'
  })
  document.querySelector('.buzz').addEventListener('click', () => {
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.open('POST', `/buzz?player=${username.value}`, true)
    xmlHttp.send(username.value)
  })
} else if (window.location.pathname == '/scoreboard' || window.location.pathname == '/scoreboard.html') {
  const poll = () => {
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.open('GET', '/score', true)
    xmlHttp.responseType = 'json'
    var list = document.querySelector('.scoreboard')
    xmlHttp.onload = function() {
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
      Object.keys(this.response).sort((a, b) => this.response[b] - this.response[a]).forEach((key) => {
        var newListElement = document.createElement('li')
        newListElement.classList.add('mdc-list-item')
        var newLeftSpan = document.createElement('h3')
        newLeftSpan.classList.add('mdc-list-item__text')
        newLeftSpan.textContent = key
        var newRightSpan = document.createElement('h3')
        newRightSpan.classList.add('mdc-list-item__text')
        newRightSpan.textContent = this.response[key]
        newListElement.appendChild(newLeftSpan)
        newListElement.appendChild(newRightSpan)
        list.appendChild(newListElement)
      })
    }
    xmlHttp.send()
    setTimeout(poll, POLL_MS);
  }
  poll();
}

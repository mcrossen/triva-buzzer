import {MDCRipple} from '@material/ripple'
import {MDCTextField} from '@material/textfield'

const username = new MDCTextField(document.querySelector('.username'))
new MDCRipple(document.querySelector('.next'))

document.querySelector('.login').addEventListener('submit', () => {
  document.querySelector('.page-1').style.display = 'none';
  document.querySelector('.page-2').style.display = 'flex';
})

document.querySelector('.buzz').addEventListener('click', () => {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open('POST', `/buzz?player=${username.value}`, true);
  xmlHttp.send(username.value);
})

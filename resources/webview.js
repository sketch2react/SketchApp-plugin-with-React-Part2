import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

/* 
Boilerplate code
disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  window.postMessage('nativeLog', 'Called from the webview')
})

// call the wevbiew from the plugin
window.setRandomNumber = (randomNumber) => {
  document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
}*/

(() => {
  ReactDOM.render(<App />, document.getElementById('root'))
})()

window.sendData = (data) => {
  // create and dispatch the event including the data
  var event = new CustomEvent("send-data", {
    detail: {
      data
    }
  });
  window.dispatchEvent(event);  
  }

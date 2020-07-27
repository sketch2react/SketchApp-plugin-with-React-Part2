import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import sketch from 'sketch';

const webviewIdentifier = 'my-plugin.webview'

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 240,
    height: 180,
    alwaysOnTop: true,
    show: false
  }

  const browserWindow = new BrowserWindow(options)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  const webContents = browserWindow.webContents

  // Sends initial data to React UI when page has loaded
  webContents.on('did-finish-load', () => {
    let document = sketch.getSelectedDocument()
    var selectedLayers = document.selectedLayers

    if(selectedLayers.length > 0){
      // We will only pick the first layer in the selection
      let layer = selectedLayers.layers[0];
      let name = layer.name;

      webContents
      .executeJavaScript(`sendData('${name}')`)
      .catch(console.error)
    }
  })

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', s => {
    UI.message(s)
    webContents
      .executeJavaScript(`setRandomNumber(${Math.random()})`)
      .catch(console.error)
  })

  // add a handler for a call from web content's javascript
  webContents.on('setSelectionName', s => {
    //UI.message(s)
    let document = sketch.getSelectedDocument()
    let selectedLayers = document.selectedLayers // This also includes artboards

    if(selectedLayers.length > 0){
      // We will only pick the first layer in the selection
      let layer = selectedLayers.layers[0];
      layer.name = s;
    }
  })

  browserWindow.loadURL(require('../resources/webview.html'))
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}

export function onSelectionChange(context) {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    const webContents = existingWebview.webContents;
    const actionContext = context.actionContext;
    const newSelection = actionContext.newSelection; // This also includes artboards

    if(newSelection.length > 0){
      // We will only pick the first layer in the selection
      let layer = newSelection[0];
      let wrappedLayer = sketch.fromNative(layer);
      let name = wrappedLayer.name;
  
      webContents
      .executeJavaScript(`sendData('${name}')`)
      .catch(console.error)
    }
  }
}

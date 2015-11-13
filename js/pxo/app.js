import Router from './router'
import UIMediator from './ui_mediator'

export default class App {

    constructor() {
	const uiMediator = new UIMediator()
	this.uiMediator = uiMediator
	this.router = new Router({ uiMediator })
    }

    setupEnv() {
	global.document = window.document
	global.location = window.location
    }

    setupNativeMenu(gui) {
	const win = gui.Window.get()
	const nativeMenuBar = new gui.Menu({
	    type: "menubar"
	})
	if (process.platform === "darwin") {
	    nativeMenuBar.createMacBuiltin("Pixel Outliner");
	}
	win.menu = nativeMenuBar
    }

    setupNativeUI() {
	const gui = global.window.nwDispatcher.requireNwGui()
	this.setupNativeMenu(gui)
    }

    init() {
	this.setupEnv()
	this.setupNativeUI()
	this.router.init()
    }

}

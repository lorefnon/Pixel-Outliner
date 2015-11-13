import { find, include } from 'lodash'
import Router from './router'
import Aviator from 'aviator'
import UIMediator from './ui_mediator'
import jQuery from 'jQuery'

global.$ = global.jQuery = window.$ = window.jQuery = jQuery

export default class App {

    constructor() {
	const uiMediator = new UIMediator()
	this.uiMediator = uiMediator
	this.router = new Router({ uiMediator })
    }

    setupEnv() {
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

    showDevTools(gui) {
	gui
	    .Window
	    .get()
	    .showDevTools()
    }

    setupNativeUI() {
	const gui = global.window.nwDispatcher.requireNwGui()
	this.gui = gui
	this.setupNativeMenu(gui)
	if (include(gui.App.argv, '--dev')) {
	    this.showDevTools(gui)
	}
	this.openPassedFile(gui)
    }

    openPassedFile() {
	const filename = find(this.gui.App.argv, (i)=> i.match(/.pxo$/))
	if (! filename) return
	Aviator.navigate('/outlines/file', {
	    queryParams: { filename }
	})
    }

    init() {
	this.setupEnv()
	this.setupNativeUI()
	this.router.init()
	this.openPassedFile()
    }

}

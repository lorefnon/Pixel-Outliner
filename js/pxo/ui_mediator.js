import Splash from './views/splash'
import Outline from './views/outline'
import { each, isArray } from 'lodash'
import $ from 'jquery'

export default class UIMediator {

    constructor() {
	this.templates = {
	    primary: null,
	    auxiliary: []
	}
    }

    splash() {
	this.templates.primary = (new Splash()).renderTo('.pxo-app').setup()
    }

    notFound() {
	console.log('Not found')
    }

    newOutline() {
	this.teardownAll()
	this.template = (new Outline()).renderTo('.pxo-app').setup();
    }

    teardownAll() {
	this.teardown('primary')
	this.teardown('auxiliary')
    }

    teardown(key) {
	const tmpl = this.templates[key]
	if (! tmpl) return
	if (isArray(tmpl)) {
	    each(tmpl, (tmpl) => tmpl.teardown())
	} else {
	    tmpl.teardown()
	}
    }

}

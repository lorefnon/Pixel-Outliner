import Splash from './views/splash'
import Outline from './views/outline'
import PersistenceMediator from './persistence_mediator'
import { each, isArray } from 'lodash'
import $ from 'jquery'
import Aviator from 'aviator'

export default class UIMediator {

    constructor() {
	this.templates = {
	    primary: null,
	    auxiliary: []
	}
    }

    splash() {
	this.templates.primary = (new Splash())
	    .renderTo('.pxo-app')
	    .setup()
    }

    notFound() {
	console.log('Not found')
    }

    newOutline() {
	this.teardownAll()
	this.template = (new Outline())
	    .renderTo('.pxo-app')
	    .setup()
    }

    openOutline(params) {
	console.log('=> Open outline')
	const filename = params.queryParams.filename
	this.teardownAll()
	let data
	try {
	    data = this
		.persistenceMediator()
		.fetch(filename)

	    this.template = (new Outline({
		filename, data
	    })).renderTo('.pxo-app').setup()

	} catch (e) {
	    // window.alert(`Invalid or corrupted file : ${filename}`)
	    console.error(e)
	    Aviator.navigate('/')
	}
    }

    persistenceMediator() {
	return this._persistenceMediator = this._persistenceMediator ||
	    new PersistenceMediator()
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

import Aviator from 'aviator'

export default class Router {

    constructor(params) {
	this.uiMediator = params.uiMediator
    }

    configure() {
	Aviator.pushStateEnabled = false
	return this
    }

    defineRoutes() {
	Aviator.setRoutes({
	    target: this.uiMediator,
	    '/': 'splash',
	    '/outlines/new': 'newOutline',
	    notFound: 'notFound'
	})
	return this
    }

    dispatch() {
	Aviator.dispatch()
    }

    init() {
	this
	    .configure()
	    .defineRoutes()
	    .dispatch()
    }

}

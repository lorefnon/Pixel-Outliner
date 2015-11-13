import $ from 'jquery'
import Handlebars from 'handlebars'

import '../../../templates/partials'

export default class View {

    render() {
	return this.template()(
	    this.templateParams(), {
		partials: Handlebars.partials
	    }
	)
    }

    renderTo(el) {
	this.el = $(el)
	this.el.html(this.render())
	return this
    }

    setup() {
	this.setupEvents()
	return this
    }

    teardown() {
	this.teardownEvents()
	return this
    }

    setupEvents() {
    }

    teardownEvents() {
    }

    template() {
	throw new Error('SubClassResponsibilityError')
    }

    templateParams() {
	return {}
    }

}

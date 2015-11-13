import View from './view'
import $ from 'jquery'
import Aviator from 'aviator'

export default class Splash extends View {

    template() {
	return require('../../../templates/splash')
    }

    setupEvents() {
	$('.pxo-tgr-open-outline').on('click', () => this.triggerFileSelection())
	$('.pxo-tgr-new-outline').on('click', () => this.triggerOutlineCreation())
	$('.pxo-file-selection-input').on('change', () => this.triggerOutlineOpen())
    }

    teardownEvents() {
	$('.pxo-tgr-open-outline').off('click')
	$('.pxo-tgr-new-outline').off('click')
    }

    triggerFileSelection() {
	$('.pxo-file-selection-input').click()
    }

    triggerOutlineCreation() {
	Aviator.navigate('/outlines/new')
    }

    triggerOutlineOpen() {
	Aviator.navigate('/outlines/file', {
	    queryParams: {
		filename: $('.pxo-file-selection-input').val()
	    }
	})
    }

}

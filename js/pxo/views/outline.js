import View from './view'
import $ from 'jquery'

import kbTmpl from '../../../templates/key_bindings'
import nodeTmpl from '../../../templates/_node'

const KEY_CODES = {
    tab: 9,
    enter: 13,
    up: 38,
    down: 40
}

class Outline extends View {

    template() {
	return require('../../../templates/outline')
    }

    templateParams() {
	return {
	    tree: this.emptyTree()
	}
    }

    emptyNode() {
	return {
	    title: null,
	    children: []
	}
    }

    emptyTree() {
	return {
	    root: this.emptyNode()
	}
    }

    setupEvents() {
	this.el
	    .on('keydown', '.pxo-outline-title-entry', (e) => this.handleKeyDown(e))
	    .on('click', '.pxo-tgr-kb', (e)=> this.showKeyBindings(e))
    }

    showKeyBindings(e) {
	let kbView = $(kbTmpl())

	e.stopPropagation();
	e.preventDefault();

	$('body')
	    .append(kbView)
	    .one('click', ()=> kbView.remove())
    }

    handleKeyDown(e) {

	let handled = true

	if (e.which == KEY_CODES['enter']) {
	    this.handleEnter(e)
	} else if (e.which == KEY_CODES['tab']) {
	    if (e.shiftKey) {
		this.handleShiftTab(e)
	    } else {
		this.handleTab(e)
	    }
	} else if (e.which == KEY_CODES['up']) {
	    if (e.shiftKey) {
		this.handleShiftUp(e)

	    } else {
		this.handleUp(e)
	    }
	} else if (e.which == KEY_CODES['down']) {
	    if (e.shiftKey) {
		this.handleShiftDown(e)
	    } else {
		this.handleDown(e)
	    }
	} else {
	    handled = false
	}

	if (handled) {
	    e.stopPropagation()
	    e.preventDefault()
	}
    }


    nodeContaining(el) {
	return $(el).parent('.pxo-outline-node')
    }

    handleEnter(e) {
	this.injectNewNode($(e.target))
    }

    handleTab(e) {
	this.pushNodeForward(this.nodeContaining(e.target))
    }

    handleShiftTab(e) {
	this.pushNodeBack(this.nodeContaining(e.target))
    }

    handleUp(e) {
	this.focusPrevious(this.nodeContaining(e.target))
    }

    handleShiftUp(e) {
	this.insertBeforePrevious(this.nodeContaining(e.target))
    }

    handleShiftDown(e) {
	this.insertAfterNext(this.nodeContaining(e.target))
    }

    handleDown(e) {
	this.focusNext(this.nodeContaining(e.target))
    }

    focusOn(node) {
	node.find('.pxo-outline-title-entry').focus()
    }

    // TODO Optimize
    focusNext(node) {
	const nodes = this.allNodes()
	const idx = nodes.indexOf(node[0])
	if (nodes[idx+1]) $(nodes[idx+1]).find('.pxo-outline-title-entry').first().focus()
    }

    insertAfterNext(node) {
	node.insertAfter(node.next())
	this.focusOn(node)
    }

    insertBeforePrevious(node) {
	node.insertBefore(node.prev())
	this.focusOn(node)
    }

    allNodes() {
	return this.el.find('.pxo-outline-node').toArray()
    }

    // TODO Optimize
    focusPrevious(node) {
	const nodes = this.allNodes()
	const idx = nodes.indexOf(node[0])
	if (nodes[idx-1]) $(nodes[idx-1]).find('.pxo-outline-title-entry').first().focus()
    }

    pushNodeForward(node) {
	node.prev().children('.pxo-outline-tree-inner').append(node)
	this.focusOn(node)
    }

    pushNodeBack(node) {
	node.insertAfter(node.parents('.pxo-outline-tree-inner').first().parent('.pxo-outline-node'))
	this.focusOn(node)
    }

    injectNewNode(el) {
	const parent = el.parent()
	const newNode = $(nodeTmpl({
	    title: null,
	    children: []
	}))
	newNode.insertAfter(parent)
	this.focusOn(newNode)
    }

}

export default  Outline

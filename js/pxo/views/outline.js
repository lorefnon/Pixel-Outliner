import View from './view'
import $ from 'jquery'
import uuid from 'node-uuid'
import { map, isEmpty, isArray, each, extend } from 'lodash'
import fdialogs from 'node-webkit-fdialogs'
import PersistenceMediator from '../persistence_mediator'

// import 'jquery-ui/sortable'
//import '../../../../vendor/nested_sortable/nested_sortable'
import '../../../../vendor/jquery_sortable/jquery_sortable'

import kbTmpl from '../../../templates/key_bindings'
import nodeTmpl from '../../../templates/_node'

const KEY_CODES = {
    tab: 9,
    enter: 13,
    up: 38,
    down: 40
}

class Outline extends View {

    constructor(options) {
	super()
	if (options) {
	    this.filename = options.filename
	    this.data = options.data
	}
    }

    template() {
	return require('../../../templates/outline')
    }

    templateParams() {
	if (this.data) {
	    return {
		tree: {
		    roots: this.buildHierarchy()
		}
	    }
	} else {
	    return { tree: this.emptyTree() }
	}
    }

    buildHierarchy(ids) {
	if (! isArray(ids)) ids = this.data.rootIds
	return map(ids, (id) => {
	    return extend({}, {
		id: id,
		title: this.data.nodes[id].title,
		children: this.buildHierarchy(this.data.nodes[id].childIds)
	    })
	})
    }

    emptyNode() {
	return {
	    id: uuid.v4(),
	    title: null,
	    children: []
	}
    }

    emptyTree() {
	return {
	    roots: [this.emptyNode()]
	}
    }

    setupEvents() {
	this.el
	    .on('keydown', '.pxo-outline-title-entry', (e) => this.handleKeyDown(e))
	    .on('click', '.pxo-tgr-kb', (e)=> this.showKeyBindings(e))
	    .on('click', '.pxo-tgr-save', (e)=> this.save(e))
	    .on('click', '.pxo-node-collapser', (e) => this.toggleCollapsed(e))
	this.makeSortable()
    }

    makeSortable() {
	this.el.find('.pxo-outline-tree-top').sortable({
	    handle: '.pxo-node-zoom-thumb',
	    placeholderClass: 'pxo-outline-placeholder',
	    placeholder: '<li class="pxo-outline-placeholder placeholder"></li>'
	})
    }

    toggleCollapsed(e) {
	debugger
	this.nodeContaining(e.target).toggleClass('pxo-state-collapsed')
    }

    showKeyBindings(e) {
	let kbView = $(kbTmpl())

	e.stopPropagation();
	e.preventDefault();

	$('body')
	    .append(kbView)
	    .one('click', ()=> kbView.remove())
    }

    save(e) {
	const data = JSON.stringify(this.extractDataFromDom())
	if (this.filename) {
	    this.persistenceMediator().save(this.filename, data)
	} else {
	    var dialog = new fdialogs.FDialog({
		type: 'save',
		defaultSavePath: '~/Documents/Untitled.pxo'
	    })
	    const content = new Buffer(data, 'utf-8')
	    dialog.saveFile(content, (err, path) => {
		this.filename = path
	    })
	}
    }

    persistenceMediator() {
	return this._persistenceMediator = this._persistenceMediator ||
	    new PersistenceMediator()
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
	return $(el).parents('.pxo-outline-node').first()
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
	node.insertAfter(
	    node
		.parents('.pxo-outline-tree-inner')
		.first()
		.parent('.pxo-outline-node')
	)
	this.focusOn(node)
    }

    injectNewNode(el) {
	const parent = el.parent()
	const newNode = $(nodeTmpl(this.emptyNode()))
	newNode.insertAfter(parent)
	//this.makeSortable()
	this.focusOn(newNode)
    }

    extractDataFromDom() {
	let data = { nodes: {} }

	data.rootIds = this.el
	    .find('.pxo-outline-tree-top')
	    .children()
	    .map(function() {
		return $(this).data('id')
	    })
	    .toArray()

	this.el.find('.pxo-outline-node').map(function() {
	    const el = $(this)
	    const id = el.data('id')
	    if (isEmpty(id)) return
	    data.nodes[id] = {
		title: el.children('.pxo-outline-title-entry').html(),
		childIds: el
		    .children('.pxo-outline-tree')
		    .children('.pxo-outline-node')
		    .map(function() {
			return $(this).data('id')
		    })
		    .toArray()
	    }
	})

	return data;
    }

}

export default  Outline

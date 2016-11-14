/**
 * Input JSON and output formatted HTML
 */

'use strict'

/**
 * Dependencies
 */

const EventEmitter = require('events').EventEmitter
const uuid = require('node-uuid')
const $ = require('jquery')

/**
 * Constants
 */

const CLOSED = '<span class="open-bracket">...</span>'
const COMMA = '<span class="comma">,</span>'

/**
 * JSON Object view
 */

class JSONView extends EventEmitter {

  /**
   * Constructor
   *
   * @param {Object} options
   */

  constructor(options) {
    super()
    this.level = options.level || 1
    this.data = options.data
    this.type = getType(this.data)
    this.el = $(options.el)
    this.render()
  }

  /**
   * Render the JSON node
   */

  render() {
    let marker = this.level == 1 ? `data-output-id="${this.id}"` : ''
    let bracketId = `data-bracket-id="${uuid.v4()}"`
    let html = `
      <span class="node-container" ${marker}>
        <span class="node-top node-bracket" ${bracketId}/>
          <span class="node-content-wrapper">
            <ul class="node-body" />
          </cspan>
          <span class="node-bottom node-bracket" ${bracketId}/></span>`

    // Render HTML on page
    this.el.html(html)

    let selector = `[${bracketId}]`
    let self = this
    $(selector).hover(function() {
      let elements = [$(this), self.el.find(selector)]
      self.emit('bracket-hover', elements)
      console.log(elements)
    })

    // Easily access elements
    this.elements = {
      contentWrapper: this.el.find('.node-content-wrapper'),
      container: this.el.find('.node-container'),
      bottom: this.el.find('.node-bottom'),
      top: this.el.find('.node-top'),
      ul: this.el.find('.node-body')
    }

    // Render each child individually
    let brackets = this.getBrackets()
    this.elements.top.html(brackets.top)
    Object.keys(this.data).forEach((key, index, set) => {
      let last = index + 1 == set.length
      this.renderChild(key, last)
    })
    this.elements.bottom.html(brackets.bottom)
  }

  /**
   * Render children nodes
   *
   * @param {String} key
   * @param {Boolean} last
   */

  renderChild(key, last) {
    let val = this.data[key]
    let type = getType(val)
    let li = $('<li/>')
    let left = $('<span/>')
    let right = $('<span/>')
    if (this.type == 'object') {
      left.append(`${this.getLeaf(key, 'key', false)}: `)
    }
    left.append(right)
    li.append(left)
    this.elements.ul.append(li)
    if ('array' == type || 'object' == type) {
      new JSONView({
        level: this.level + 1,
        data: val,
        el: right
      })
    } else {
      right.append(this.getLeaf(val, type, last))
    }
  }

  /**
   * Returns leaf node (JSON value) HTML
   *
   * @param {String|Number|Boolean} val
   * @param {String} type
   * @param {Boolean} last
   * @return {String}
   */

  getLeaf(val, type, last) {
    let comma = last || type == 'key' ? '' : `${COMMA}`
    if (type == 'string') {
      val = `"${val}"`
    }
    return `<span class="${type}">${val}</span>${comma}`
  }

  /**
   * Get the brackets for the given view
   */

  getBrackets() {
    let top = 'array' == this.type ? '[' : '{'
    let bottom = 'array' == this.type ? ']' : '}'
    if (this.level > 1 && !this.last) {
      bottom += COMMA
    }
    return {
      bottom: bottom,
      closed: `${top}${CLOSED}${bottom}}`,
      top: top
    }
  }
}

/**
 * Determine the type of input
 *
 * @param {Unknown} input
 * @return {String} The determined type
 */

function getType(input) {
  if (input === null) return 'null'
  if (Array.isArray(input)) return 'array'
  return typeof input
}

/**
 * Exports
 */

module.exports = JSONView

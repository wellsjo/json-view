/**
 * Input JSON and output formatted HTML
 */

'use strict'

/**
 * Dependencies
 */

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

class JSONView {

  /**
   * Constructor
   *
   * @param {Object} options
   */

  constructor(options) {
    this.level = options.level || 1
    this.data = options.data
    this.type = getType(this.data)
    this.last = !!options.last
    this.id = options.id || null
    this.el = $(options.el)
    if (this.type == 'array') {
      this.size = this.data.length
    } else {
      this.size = Object.keys(this.data).length
    }
    this.render()
  }

  /**
   * Render the JSON node
   */

  render() {

    // Output id is to destroy instance, so only used on the top level
    let outputId = ''
    if (this.level == 1) {
      outputId = `data-output-id="${this.id}"`
    }

    // This ID is used for matching brackets
    let bracketId = uuid.v4()

    // JSON node html
    let html = `
      <span class="node-container" ${outputId}>
        <span class="node-top node-bracket" data-bracket-id="${bracketId}" />
          <span class="node-content-wrapper">
            <ul class="node-body" />
          </cspan>
          <span class="node-bottom node-bracket" data-bracket-id="${bracketId}" /></span>`

    // Render HTML on page
    this.el.html(html)

    // Easily access elements
    this.elements = {
      contentWrapper: this.el.find('.node-content-wrapper'),
      container: this.el.find('.node-container'),
      bottom: this.el.find('.node-bottom'),
      top: this.el.find('.node-top'),
      ul: this.el.find('.node-body')
    }

    // Place brackets
    let brackets = this.getBrackets()
    this.elements.top.html(brackets.top)
    Object.keys(this.data).forEach((key, index) => {
      let last = index + 1 == this.size
      this.renderChild(key, last)
    })
    this.elements.bottom.html(brackets.bottom)
  }

  /**
   * Render children nodes
   */

  renderChild(key, last) {
    let val = this.data[key]
    let type = getType(val)

    let li = $('<li/>')
    let left = $('<span/>')
    let right = $('<span/>')
    if (this.type == 'object') {
      let keyHTML = new Leaf({
        last: false,
        type: 'key',
        data: key
      }).html
      left.append(keyHTML + ': ')
    }

    left.append(right)
    li.append(left)
    this.elements.ul.append(li)

    let opts = {
      level: this.level + 1,
      type: type,
      last: last,
      data: val
    }

    let child
    if (null !== val && 'object' == typeof val) {
      opts.el = right
      child = new JSONView(opts)
    } else {
      child = new Leaf(opts)
      right.append(child.html)
    }
  }

  /**
   * Get the brackets for the given view
   */

  getBrackets() {
    let bottom = 'array' == this.type ? ']' : '}'
    if (this.level > 1 && !this.last) {
      bottom += COMMA
    }
    let top = 'array' == this.type ? '[' : '{'
    return {
      bottom: bottom,
      closed: `${top}${CLOSED}${bottom}}`,
      top: top
    }
  }
}

/**
 * Construct a leaf node
 *
 * Can be null, number, string, date, url
 */

class Leaf {

  /**
   * Constructor
   *
   * @param {Object} options
   */

  constructor(options) {
    let last = !!options.last
    let type = options.type
    let data = options.data

    // If this is the leaf element, don't show comma
    let comma = last || type == 'key' ? '' : `${COMMA}`

    // Quotes for strings
    if (type == 'string') {
      data = `"${data}"`
    }
    this.html = `<span class="${type}">${data}</span>${comma}`
  }
}

/**
 * Determine the type of input
 *
 * @param {Mixed} input
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

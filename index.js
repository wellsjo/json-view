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
 * JSON Object view
 */

class JSONView {

  /**
   * Constructor
   *
   * @param {Object} options
   * @param {Number} options.level
   * @param {Object} options.data
   * @param {Object} options.type
   * @param {Object} options.el The element to render on
   */

  constructor(options) {
    this.level = options.level || 1
    this.data = options.data
    this.last = options.last
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

    // Easily access elements
    this.elements = {
      bottom: this.el.find('.node-bottom'),
      top: this.el.find('.node-top'),
      ul: this.el.find('.node-body')
    }

    // Render each child individually
    let brackets = this.getBrackets()

    if (isEmpty(this.data)) {
      this.elements.ul.html(`${brackets.top}${brackets.bottom}`)
    } else {
      this.elements.top.html(brackets.top)
      Object.keys(this.data).forEach((key, index, set) => {
        let last = index + 1 == set.length
        this.renderChild(key, last)
      })
      this.elements.bottom.html(brackets.bottom)
    }
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
      if (isEmpty(val)) {
        right.append(this.getLeaf(val, type, last))
      } else {
        new JSONView({
          level: this.level + 1,
          last: last,
          data: val,
          el: right
        })
      }
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
    let comma = last || type == 'key' ? '' : ','
    if ('string' == type) {
      val = `"${val}"`
    }
    if ('array' == type) {
      val = '[]'
    }
    if ('object' == type) {
      val = '{}'
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
      bottom = bottom + ','
    }
    return {
      bottom: bottom,
      closed: `${top}${bottom}}`,
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
 * Determine if this (object or array) is empty
 */

function isEmpty(val) {
  let emptyArray = 'array' == getType(val) && val.length === 0
  let emptyObject = 'object' == getType(val) && Object.keys(val).length === 0
  return emptyArray || emptyObject
}

/**
 * Exports
 */

module.exports = JSONView

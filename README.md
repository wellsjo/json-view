# json-to-html
Render JSON output as HTML

Input a JSON object, and HTML is returned in a way that makes it easy to style/format.

# 
HTML
```html
<script src="/../build/json-to-html.js"></script>
<div id="output"></div>
```
JS
```javascript
const data = {
  hello: "world",
  values: [1, 2, 3]
}
const el = $('#output')
const html = new JSONView({
  data: data,
  el: el
})
```
Output (styled with CSS and rendered as HTML):    
![Demo](http://i.imgur.com/m9XMLVN.png)

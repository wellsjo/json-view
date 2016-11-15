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
const html = new JSONView({
  data: data,
  el: el
})
```

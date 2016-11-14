
BROWSERIFY := node_modules/.bin/browserify
WATCHIFY := node_modules/.bin/watchify
UGLIFY := node_modules/.bin/uglifyjs

GLOBAL_NAMESPACE := JSONView

build: build/json-to-html.js build/json-to-html.min.js

build/json-to-html.js: index.js node_modules
	mkdir -p build
	$(BROWSERIFY) index.js -o build/json-to-html.js -s $(GLOBAL_NAMESPACE) -t [ babelify --presets [ es2015 ] ] -v

build/json-to-html.min.js: build/json-to-html.js
	$(UGLIFY) --compress --mangle --output build/json-to-html.min.js -- build/json-to-html.js

watch: index.js build/json-to-html.js
	mkdir -p build
	$(WATCHIFY) index.js -o build/json-to-html.js -s $(GLOBAL_NAMESPACE) -t [ babelify --presets [ es2015 ] ] -v

node_modules: package.json
	npm install

clean:
	rm -rf build node_modules

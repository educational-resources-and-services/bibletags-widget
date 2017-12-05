const shell = require('shelljs')

shell.exec(`uglifyjs widget-script.js -c -m -o ./widget-script-builds/widget-script-${Date.now()}.js`)
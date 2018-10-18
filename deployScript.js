const shell = require('shelljs')

let envVariableDeclaration = ""

if(['production', 'staging'].includes(process.argv[2])) {
  envVariableDeclaration = `widget-script-${process.argv[2]}.js`
} else if(process.argv[2]) {
  console.log("Invald parameter. Must be `production` or `staging`. Eg. `npm run deploy -- production`\n")
  return
}

shell.exec(`uglifyjs ${envVariableDeclaration} widget-script.js -c -m -o ./widget-script-builds/widget-script-${Date.now()}.js`)
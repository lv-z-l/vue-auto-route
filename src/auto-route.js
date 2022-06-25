const fs = require('fs')
const glob = require('fast-glob')

const RegExp_Dir = /\/\S(\w|\d|-)*/g

async function generateRoute(dir, dest) {
  const files = await glob([`${dir}/**/*.vue`])
  const resRoute = []
  files.forEach(async file => {
    const match = file.match(RegExp_Dir)
    
    const path = match.length >=2 ? match[match.length - 2] : match[0]
    const componentText = "() => import('@" + file.replace('src', '') + "')"
    resRoute.push(`{
      path: '${path}',
      component: ${componentText}
    }`)
  })
  const destDir = dest.split('/')
  destDir.pop()
  fs.mkdirSync(destDir.join('/'), { recursive: true })
  fs.promises.writeFile(dest, `export default [${resRoute.join(',')}]`, {encoding: 'utf8', flag: 'as+'})
}


module.exports = {
  generateRoute
}
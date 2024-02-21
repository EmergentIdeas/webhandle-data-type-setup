#! /usr/bin/env node
import path from 'path'
import fs from 'fs'
import { spawnSync, spawn } from 'child_process'
import * as url from 'url';
import minimist from 'minimist'
import helpText from './help-text.mjs'
import sedReplacementSafe from './sed-replacement-safe.mjs'
import camelCase from './camel-case.mjs'
import cap from './cap.mjs'
import grepMatchingFiles from './grep-matching-files.mjs'

let argv = minimist(process.argv.slice(2));

if (!argv.d) {
	console.log(helpText)
	process.exit()
}

let dataTypeDashName = argv.d
let dataTypeCamelName = camelCase(dataTypeDashName)

const mkdir = spawnSync('mkdir', ['-p', 'public/css', 'public/js', 'public/img'])
console.log('creating directories')


function ensureObjectExists(parent, key) {
	if (!parent[key]) {
		parent[key] = {}
	}
	return parent[key]
}

function assignData(dest, src) {
	if (!dest || !src) {
		return
	}
	for (let key in src) {
		dest[key] = src[key]
	}
}


function replaceContent(search, replacement, fileName) {
	let args = ['-i', `s/${search}/${sedReplacementSafe(replacement)}/g`, fileName]
	console.log('sed ' + args.join(' '))
	spawnSync('sed', args)

}
function searchAndReplaceContent(cwd, subDirectory, search, replacement) {
	let files = grepMatchingFiles(cwd, subDirectory, search)
	for (let fileName of files) {
		replaceContent(search, replacement, fileName)
	}
}

let packageDir = url.fileURLToPath(new URL('.', import.meta.url))
packageDir = path.resolve(packageDir, '..')
let cwd = process.cwd()
// console.log('package dir: ' + packageDir)
// console.log('cwd: ' + cwd)
spawnSync('cp', ['-rn', path.resolve(packageDir, 'client-js'), path.resolve(cwd)])
spawnSync('cp', ['-rn', path.resolve(packageDir, 'server-js'), path.resolve(cwd)])
spawnSync('cp', ['-rn', path.resolve(packageDir, 'client-lib'), path.resolve(cwd)])
spawnSync('cp', ['-rn', path.resolve(packageDir, 'server-lib'), path.resolve(cwd)])
spawnSync('cp', ['-rn', path.resolve(packageDir, 'less'), path.resolve(cwd)])

spawnSync('cp', ['-rn', path.resolve(packageDir, 'views'), path.resolve(cwd)])
spawnSync('mv', [path.resolve(cwd, `views/data-type-name/data-type-name`), path.resolve(cwd, `views/data-type-name/${dataTypeDashName}`)])
spawnSync('mv', [path.resolve(cwd, `views/data-type-name`), path.resolve(cwd, `views/${dataTypeDashName}`)])



spawnSync('cp', ['-rn', path.resolve(packageDir, 'pages'), path.resolve(cwd)])
spawnSync('cp', ['-rn', path.resolve(packageDir, 'build'), path.resolve(cwd)])
spawnSync('cp', ['-rn', path.resolve(packageDir, 'test'), path.resolve(cwd)])
spawnSync('cp', ['-rn', path.resolve(packageDir, 'utils'), path.resolve(cwd)])
spawnSync('cp', ['-rn', path.resolve(packageDir, 'dev.config.cjs'), path.resolve(cwd)])
spawnSync('cp', ['-rn', path.resolve(packageDir, 'pages.webpack.cjs'), path.resolve(cwd)])
spawnSync('cp', ['-rn', path.resolve(packageDir, 'web-server.js'), path.resolve(cwd)])
spawnSync('cp', ['-rn', path.resolve(packageDir, 'dest-readme.md'), path.resolve(cwd, 'README.md')])
spawnSync('cp', ['-rn', path.resolve(packageDir, '.vscode'), path.resolve(cwd)])

spawnSync('mv', [path.resolve(cwd, `server-js/setups/enable-data-type-name.mjs`), path.resolve(cwd, `server-js/setups/enable-${dataTypeDashName}.mjs`)])
spawnSync('mv', [path.resolve(cwd, `server-lib/setups/enable-data-type-name.mjs`), path.resolve(cwd, `server-lib/setups/enable-${dataTypeDashName}.mjs`)])

let buildPackage = JSON.parse(fs.readFileSync(path.resolve(packageDir, 'package.json')).toString())
let destPackage = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json')).toString())
if (!destPackage.name) {
	destPackage.name = dataTypeDashName
}
let destPackageName = destPackage.name



ensureObjectExists(destPackage, 'devDependencies')
ensureObjectExists(destPackage, 'dependencies')
ensureObjectExists(destPackage, 'scripts')
ensureObjectExists(destPackage, 'browserify')

assignData(destPackage.devDependencies, buildPackage.devDependencies)

// This is on purpose assigning dependencies to dev dependencies so that they don't
// make it into a plugin
assignData(destPackage.devDependencies, buildPackage.dependencies)

assignData(destPackage.browserify, buildPackage.browserify)
assignData(destPackage.scripts, buildPackage.scripts)

destPackage.files = [
	"/client-lib",
	"/server-lib",
	"README.md",
	"/less/components.less",
	`views/${dataTypeDashName}`,
	"/public"
]
destPackage.main = 'server-lib/integrator.mjs'
destPackage.browser = 'client-lib/integrator.mjs'
destPackage.type = 'module'

delete destPackage.dependencies['webhandle-data-type-setup']

fs.writeFileSync(path.resolve(cwd, 'package.json'), JSON.stringify(destPackage, null, "\t"))
spawnSync('sed', ['-i', `s/change-me/${sedReplacementSafe(destPackageName)}/g`, 'dev.config.cjs'])

searchAndReplaceContent(cwd, 'less', 'data-type-name', dataTypeDashName)
searchAndReplaceContent(cwd, 'views', 'data-type-name', dataTypeDashName)
searchAndReplaceContent(cwd, 'client-js', 'data-type-name', dataTypeDashName)
searchAndReplaceContent(cwd, 'client-lib', 'data-type-name', dataTypeDashName)
searchAndReplaceContent(cwd, 'server-lib', 'data-type-name', dataTypeDashName)
searchAndReplaceContent(cwd, 'server-js', 'data-type-name', dataTypeDashName)

searchAndReplaceContent(cwd, 'server-lib', 'data-type-package-name', destPackageName)
searchAndReplaceContent(cwd, 'server-js', 'data-type-package-name', destPackageName)

searchAndReplaceContent(cwd, 'server-lib', 'dataTypeName', dataTypeCamelName)
searchAndReplaceContent(cwd, 'server-js', 'dataTypeName', dataTypeCamelName)
searchAndReplaceContent(cwd, 'server-lib', 'DataTypeName', cap(dataTypeCamelName))
searchAndReplaceContent(cwd, 'server-js', 'DataTypeName', cap(dataTypeCamelName))

replaceContent('data-type-name', dataTypeDashName, path.join(cwd, 'README.md'))
replaceContent('data-type-package-name', destPackageName, path.join(cwd, 'README.md'))
replaceContent('dataTypeName', dataTypeCamelName, path.join(cwd, 'README.md'))

const npmInstall = spawnSync('npm', ['install'])
const compileLess = spawnSync('npm', ['run', 'less-build'])
console.log('compiled less')
const compileJs = spawnSync('npm', ['run', 'client-js-build'])
console.log('compiled js')


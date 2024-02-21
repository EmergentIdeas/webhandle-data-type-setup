import webhandle from 'webhandle'
import express from 'express'
import path from 'path'

import DataTypeNameDreck from './dreck.mjs'
import allowGroup from 'webhandle-users/utils/allow-group.js'

import filog from 'filter-log'
let log = filog('data-type-name-integrator:')

import DataTypeNameDataService from './data-service.mjs'

let templatesAdded = false
let templates = {}

export default function integrate(dbName, options) {
	let opt = Object.assign({
		collectionName: 'dataTypeName',
		templateDir: 'node_modules/data-type-package-name/views',
		mountPoint: '/admin/data-type-name',
		allowedGroups: ['administrators']
	}, options || {})
	let collectionName = opt.collectionName


	// setup collections
	if (!webhandle.dbs[dbName].collections[collectionName]) {
		webhandle.dbs[dbName].collections[collectionName] = webhandle.dbs[dbName].db.collection(collectionName)
	}

	// Setup data service
	let dataService = new DataTypeNameDataService({
		collections: {
			default: webhandle.dbs[dbName].collections[collectionName]
		}
	})
	webhandle.services.dataTypeName = dataService


	// setup admin gui tools
	let dreck = new DataTypeNameDreck({
		dataService: dataService
	})

	let router = dreck.addToRouter(express.Router())
	
	if(opt.allowedGroups && opt.allowedGroups.length > 0) {
		let securedRouter = allowGroup(
			opt.allowedGroups,
			router
		)
		webhandle.routers.primary.use(opt.mountPoint, securedRouter)
	}
	else {
		// Use this for testing or when no group is needed to access
		webhandle.routers.primary.use(opt.mountPoint, router)
	}

	if(!templatesAdded) {
		templatesAdded = true

		// add templates directory
		if (opt.templateDir) {
			webhandle.addTemplateDir(path.join(webhandle.projectRoot, opt.templateDir))
		}

		// webhandle.templateLoaders.push((name, callback) => {
		// 	callback(templates[name])
		// })

	}
}

integrate.templates = templates

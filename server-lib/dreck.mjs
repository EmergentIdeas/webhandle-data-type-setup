import Dreck from 'dreck'
import addCallbackToPromise from 'add-callback-to-promise'

import simplePropertyInjector from 'dreck/binders/simple-property-injector.js'
import createValuedCheckboxInjector from 'dreck/binders/create-valued-checkbox-injector.js'

// import wh from 'webhandle'

export default class DataTypeNameDreck extends Dreck {
	constructor(options) {
		super(options)
		let curDreck = this
		Object.assign(this, 
			{
				templatePrefix: 'data-type-name/data-type-name/',
				locals: {
					pretemplate: 'app_pre',
					posttemplate: 'app_post'
				},
				injectors: [
					(req, focus, next) => {
						simplePropertyInjector(req, focus, curDreck.bannedInjectMembers, next)
					}
					, createValuedCheckboxInjector('groups')
				]
			},
			options
		)
	}
	addAdditionalFormInformation(focus, req, res, callback) {
		let p = new Promise(async (resolve, reject) => {
			// let groups = await wh.services.sponsorgroups.fetch()
			// res.locals.groups = groups
			resolve(focus)
		})
		
		return addCallbackToPromise(p, callback)
	}
}

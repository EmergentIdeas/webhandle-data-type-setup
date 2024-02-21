let initialized = false
import serverIntegrator from "../../server-lib/integrator.mjs"
export default function enableResourceArticles(dbName, options) {
	if (!initialized) {
		initialized = true
		serverIntegrator(dbName, options)
	}
}


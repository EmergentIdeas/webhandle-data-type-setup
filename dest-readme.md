# Add data-type-name to a webhandle environment

## Install

```
npm install data-type-package-name
```

Add to less: 
```
@import "../node_modules/data-type-package-name/less/components";
```

Add to client js:

```
let clientIntegrator = require('data-type-package-name').default
clientIntegrator()
```

Add to server js:
```
const serverIntegrator = (await import('data-type-package-name')).default
serverIntegrator(dbName)
```

By default, the urls are:

/admin/data-type-name

Services are:
- dataTypeName

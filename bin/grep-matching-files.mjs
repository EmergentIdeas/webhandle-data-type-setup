import {spawnSync} from 'child_process'
import path from 'path'

export default function grepMatchingFiles(cwd, subDirectory, search) {
	
	let result = spawnSync('grep', ['-Ril', search, path.join(cwd, subDirectory)])
	return result.stdout.toString().split('\n').filter(line => !!line)
}
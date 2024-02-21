export default function camelCaseFromDashed(s) {
	let result = ''
	s = s.replace(/_/g, '-')
	s = s.replace(/ /g, '-')
	let parts = s.split('-')
	result += parts.shift()
	while(parts.length > 0) {
		let part = parts.shift()
		result += (part.substring(0, 1).toUpperCase()) + part.substring(1)
	}
	return result
}
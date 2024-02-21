import cap from "./cap.mjs"

export default function camelCaseFromDashed(s) {
	let result = ''
	s = s.replace(/_/g, '-')
	s = s.replace(/ /g, '-')
	let parts = s.split('-')
	result += parts.shift()
	while(parts.length > 0) {
		let part = parts.shift()
		result += cap(part)
	}
	return result
}
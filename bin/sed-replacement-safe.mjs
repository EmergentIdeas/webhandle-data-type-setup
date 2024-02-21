export default function sedReplacementSafe(s) {
	return s.split('/').join('\\/')
}
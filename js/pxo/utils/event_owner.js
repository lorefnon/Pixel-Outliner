export default function eventOwner(target) {
    val = target.value
    target.value = function(e) {
	e.stopPropagation()
	e.preventDefault()
	val.apply(this, arguments)
    }
}

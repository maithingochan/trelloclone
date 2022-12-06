//onKeyDown
export const saveContentAfterPressEnter = ( e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    e.target.blur()
  }
}
// Select all inout value when click
export const selectAllInlineText = (poiterRef, e) => {
  poiterRef.current.style.cursor = 'none'
  e.target.focus()
  e.target.select()// boi den toan bo input document.execuCommend('selectAll', false, null)
}

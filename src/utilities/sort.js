
//array chung ta muon sort
// order la array chung ta muons sort theo nos
export const mapOrder = (array, order, key) => {
    array.sort((a, b) => ( 
        order.indexOf(a[key]) - order.indexOf(b[key])
    ))
    return array
}
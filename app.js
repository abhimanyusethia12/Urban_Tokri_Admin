//const db = firebase.firestore()
const form = document.querySelector('#add-product')
const productList = document.querySelector('#product-list')
const upd = document.querySelector('#update-product')

function renderProduct(doc){
    let li = document.createElement('li')
    let name = document.createElement('span')
    let source = document.createElement('span')
    let update = document.createElement('button')
    let cross = document.createElement('div')
    let quantity = document.createElement('span')
    let stock_status = document.createElement('span')
    let price_100g = document.createElement('span')
    let price_250g = document.createElement('span')
    let price_500g = document.createElement('span')

    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().name
    source.textContent = doc.data().source
    update.textContent = 'Update Product   '
    cross.textContent = 'x'
    quantity.textContent = 'quantity=' + doc.data().quantity
    stock_status.textContent = 'Product is in stock? =>' + doc.data().active
    price_100g.textContent = 'price: Rs'+ doc.data().price_100g + '/100grams'
    price_250g.textContent = 'Rs'+doc.data().price_250g + '/250grams'
    price_500g.textContent = 'Rs'+doc.data().price_500g + '/500grams'

    li.appendChild(name)
    li.appendChild(source)
    li.appendChild(cross) 
    li.appendChild(quantity)
    li.appendChild(stock_status)
    li.appendChild(price_100g)
    li.appendChild(price_250g)
    li.appendChild(price_500g)
    li.appendChild(update)

    productList.appendChild(li)

    //deleting data
    cross.addEventListener('click', (e)=>{
        e.stopPropagation()
        let id = e.target.parentElement.getAttribute('data-id')
        db.collection('products').doc(id).delete()
    })

    //updating data
    update.addEventListener('click', (e) =>{
        e.stopPropagation()
        let up_id = e.target.parentElement.getAttribute('data-id')
        update_product(up_id)
    })
}

function update_product(up_id){
    db.collection('products').doc(up_id).update({
        quantity : upd.up_quantity.value,
        active : upd.up_stock_status.value,
        price_100g : upd.up_price_100g.value,
        price_250g :upd.up_price_250g.value,
        price_500g :upd.up_price_500g.value 
    })
}

// db.collection('products').get().then((snapshot)=>{
//     snapshot.docs.forEach(doc => {
//         renderProduct(doc)
//     })
// })
//saving data
form.addEventListener('submit', (e)=>{
    e.preventDefault()
    db.collection('products').add({
        name : form.name.value,
        source : form.source.value,
        quantity : form.quantity.value,
        active : form.stock_status.value,
        price_100g : form.price_100g.value,
        price_250g : form.price_250g.value,
        price_500g : form.price_500g.value,

    })
    form.name.value = ''
    form.source.value = ''
    form.quantity.value = ''
    form.stock_status.value = ''
    form.price_100g.value = ''
    form.price_250g.value = ''
    form.price_500g.value = ''
 })

db.collection('products').orderBy('name').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderProduct(change.doc)
        } else if (change.type == 'removed'){
            let li = productList.querySelector('[data-id=' + change.doc.id +']');
            productList.removeChild(li);
        }
    })   
})
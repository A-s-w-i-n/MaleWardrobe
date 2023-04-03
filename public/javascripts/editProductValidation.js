function editVal() {
    var productname = document.submission.productname.value
    var category = document.submission.category.value
    var subCategory = document.submission.subcategory.value
    var price = document.submission.price.value
    var stock = document.submission.stock.value
    var brand = document.submission.stock.value
    var image = document.submission.image.value
    var discription = document.submission.discription.value

    let pass = document.getElementsByClassName("text-danger")
    const priceRegex = /^\d{0,8}(\.\d{1,4})?$/

    if (productname == "" && category == "" && subCategory == "" && price == "" && stock == "" && brand == "" && discription == "") {
        let i = 0
        while (i < pass.length) {
            pass[i].innerHTML = "please fill the field"
            i++
        }
        return false
    }
    if (productname == "") {
        pass[0].innerHTML = "Product name is empty"
        return false
    }
    if (productname.length < 4) {
        pass[0].innerHTML = "Product name should contain 4 letters"
        return false
    }
    if (category == "") {
        pass[1].innerHTML = "Select one category"
        return false
    }
    if (subCategory == "") {
        pass[2].innerHTML = "Select one sub category"
        return false
    }
    if (price == "") {
        pass[3].innerHTML = "Add price of the product"
        return false
    }
    if (priceRegex.test(price) == false) {
        pass[3].innerHTML = "Enter correct price"
        return false
    }
    if (stock == "") {
        pass[4].innerHTML = "Stock is required"
        return false

    }
    if (priceRegex.test(stock) == false) {
        pass[4].innerHTML = "Enter correct stock"
        return false
    }

    if (brand == "") {
        pass[5].innerHTML = "Brand is required"
        return false
    }
    if (discription == "") {
        pass[7].innerHTML = "Discription is required"
        return false
    }
    if (discription.length > 500) {
        pass[8].innerHTML = "Exeeded limit"
        return false
    }
    return true
}
function clearform() {
    let pass = document.getElementsByClassName("text-danger")
    let i = 0
    while (i < pass.length) {
        pass[i].innerHTML = ""
        i++
    }
}

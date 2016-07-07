
module.exports = {
    items: items,
    Item: Item,
    GetRandomItem: GetRandomItem,
}

var items = [{
    name: "gum"
}, {
    name: "eraser"
}, {
    name: "pen"
}, {
    name: "pencil"
}, {
    name: "glue"
}, {
    name: "tape"
}, {
    name: "windows"
}, {
    name: "mac"
}, {
    name: "htc"
}, {
    name: "furch"
}, {
    name: "taylor"
}, {
    name: "martin"
}, {
    name: "dcard"
}, {
    name: "somer"
}, {
    name: "vm5"
}, {
    name: "ntu"
}, {
    name: "google"
}, {
    name: "apple"
}, {
    name: "facebook"
}, {
    name: "instagram"
}]

function Item(name) {
    this.id = 0
    this.name = name
    this.ownerID = 0
    this.ownerName = ""
    this.createdAt = new Date().getTime()
    this.publishedAt = null
    this.price = 0
    this.published = false
    this.sold = false
}

function GetRandomItem(ownerID, ownerName) {
    index = Math.floor(Math.random() * 100) % items.length
    item =  new Item(items[index].name)
    item.ownerID = ownerID
    item.ownerName = ownerName
    return item
}

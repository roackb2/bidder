
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
    this.name = name
    this.owner = ""
    this.createdAt = new Date().getTime()
    this.price = 0
    this.published = false
    this.sold = false
}

function GetRandomItem() {
    index = Math.floor(Math.random() * 100) % items.length
    item =  new Item(items[index].name)
    return item
}

const express = require('express');
const mongoose = require('mongoose');
const _ = require("lodash")

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const dbUrl = "mongodb+srv://hematw:afghanistan@12@unity.bexrwac.mongodb.net/"

mongoose.connect(dbUrl)
    .then(() => console.log("Database Connected! 😉"))
    .catch((err) => console.log(err));

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Item = new mongoose.model("Item", itemsSchema);


const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const List = new mongoose.model("List", listSchema);

const defaultItems = [{
    name: "Add item with + button"
}]

app.get('/', (req, res) => {
    Item.find({}).then((items) => {
        res.render('list', { listTitle: "Today", newListItems: items });
    })
})

app.get("/favicon.ico", (req, res) => {
    res.redirect("/")
});

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    console.log(customListName);

    List.findOne({ name: customListName })
        .then((foundList) => {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })

                list.save();

                res.redirect("/" + customListName)
            } else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items })
            }
        })
})

app.post('/', (req, res) => {

    const itemName = req.body.newItem;
    const listTitle = req.body.listTitle;

    const item = new Item({
        name: itemName
    });

    if (listTitle === "Today") {
        item.save();
        res.redirect("/")
    } else {
        List.findOne({ name: listTitle })
            .then((foundList) => {
                if (foundList) {
                    foundList.items.push(item);

                    foundList.save();
                    console.log("list Added!");
                    res.redirect("/" + listTitle)
                }
            })
    }
})

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.id;
    const listTitle = req.body.listTitle;

    if (listTitle === "Today") {
        Item.findOneAndDelete({ _id: checkedItemId })
            .then(function (result) {
                console.log(result);
                res.redirect("/");
            })
    } else {
        List.findOneAndUpdate({ name: listTitle }, { $pull: { items: { _id: checkedItemId } } })
            .then((result) => console.log(result))
            .catch((err)=> console.log(err.message))
        res.redirect("/" + listTitle);
    }

})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
})
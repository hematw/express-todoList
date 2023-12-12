const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/test2")
    .then(() => console.log("Database Connected! 😉"))
    .catch((err) => console.log(err));

const ItemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Item = mongoose.model("item", ItemsSchema);


app.get('/', (req, res) => {
    let today = new Date().toDateString();

    const formErr = req.query.formErr || null;

    Item.find({}).then((items) => {
        res.render('list', { listTitle: today, newListItems: items, formErr });
    })
})

app.get("/:customListName", (req, res)=> {
    const customListName = req.params.customListName;
    console.log(customListName);
})

app.post('/', (req, res) => {

    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });

    item.save().then((result) => {
        res.redirect('/');
    }).catch((err) => {
        const formErr = err.message;
        res.redirect('/?formErr=' + formErr);
    });
})

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.id;

    Item.findOneAndDelete({ _id: checkedItemId })
        .then(function (result) {
            console.log(result);
        })

    res.redirect("/");
})

app.listen(3000, () => {
    console.log("Server is running");
})
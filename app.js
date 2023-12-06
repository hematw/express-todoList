const express = require('express');


const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

let items = [];
let workItems = [];
app.get('/', (req, res) => {
    let today = new Date();
    let currentDay = today.toDateString();

    res.render('list', { listTitle: currentDay, newListItems: items });
})

app.post('/', (req, res)=> {
    
    let newItem = req.body.item;
    let list = req.body.list;

    console.log(req.body);

    if(list === "Work") {
        workItems.push(newItem);
        res.redirect('/work');
    } else {
        items.push(newItem)
        res.redirect('/');
    }
})

app.get('/work', (req,res)=> {
    res.render('list', { listTitle: "Work list", newListItems: workItems })
})

app.listen(3000, () => {
    console.log("Server is running");
})
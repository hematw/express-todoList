const express = require('express');


const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

var items = [];
app.get('/', (req, res) => {
    var today = new Date();
    var currentDay = today.toDateString();

    // var day;
    // switch (currentDay) {
    //     case 0:
    //         day = 'Sunday';
    //         break;
    //     case 1:
    //         day = 'Monday';
    //         break;
    //     case 2:
    //         day = 'Tuesday';
    //         break;
    //     case 3:
    //         day = 'Wednesday';
    //         break;
    //     case 4:
    //         day = 'Thursday';
    //         break;
    //     case 5:
    //         day = 'Friday';
    //         break;
    //     case 6:
    //         day = 'Saturday';
    //         break;
    //     default:
    //         console.log("Erorr the weekday is :"+ date.getDay());
    // }

    res.render('list', { day: currentDay, newWorks: items });
})

app.post('/', (req, res)=> {
    
    var newWork = req.body.work;
    
    items.push(newWork)
    res.redirect('/');
})

app.listen(3000, () => {
    console.log("Server is running");
})
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


let Books = [
    {
        id: 1,
        Name: "History of Python",
        Description: "50 page book that tells the history of Python",
        Publish_date: "12.10.2003",
        Price: 20

    },
    {
        id: 2,
        Name: "History of Java",
        Description: "70 page book that tells the history of Java",
        Publish_date: "15.08.2021",
        Price: 30

    },
    {
        id: 3,
        Name: "UI/UX Design",
        Description: "50 page book that tells the history of UI/UX Design",
        Publish_date: "12.10.2020",
        Price: 25

    }
    
];

app.engine('handlebars',exphbs.engine({
    defaultLayout: 'main'
}));

app.set('view engine','handlebars');

app.get('/', (req,res) => {
   
    res.render('index', 
    { 
        title: 'Home',
    
    }
    );
});


app.get('/Books', (req,res) => {
    res.render('books',
    {
       title: "Books for sale!",
       books: Books
    }
    )
});
app.get("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = Books.find(book => book.id === id);
    if (book) {
        res.render('book1', {   
           title: "Book for sale!",
           book: book      
        });
    } else {
        res.status(404).json({ msg: "Book not found" });
    }
});
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = Books.find(book => book.id === id);
    if (book){
        res.json(book);
    }
   else {
        res.status(404).json({ msg: "Book not found" });
   }
   
});


app.get("/api/books", (req, res) => {
    
    res.status(200).json({status: "success", results: Books.length, data: Books});
});

app.delete("/api/books/:id", (req,res) =>{
    const id = Number(req.params.id);

    const book = Books.find(book => book.id === id);

    if(book){
        Books = Books.filter(book => book.id != id);
        res.status(200).json({ msg: "Book deleted" });
    }
    else {
        res.status(404).json({ msg: "Book not found" });
    }

  
});
app.post("/api/books", (req, res) => {
    const newId = Books[Books.length - 1].id + 1;

    const NewBook = {
        id: newId,
        Name: req.body.Name,
        Description: req.body.Description,
        Publish_date: req.body.Publish_date,
        Price: req.body.Price
    }

    Books.push(NewBook);
    res.location("http://localhost:3000/api/books/" + newId);
    res.status(201).json({ msg: "Book added", data: NewBook });

});
app.patch("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = Books.find(book => book.id === id);
    if (book) {
        book.Name = req.body.Name;
        book.Description = req.body.Description;
        book.Publish_date = req.body.Publish_date;
        book.Price = req.body.Price;
        res.status(200).json({ msg: "Book updated", data: book });
    } else {
        res.status(404).json({ msg: "book not found" });
    }
});



app.use(express.static('public'));

app.use((req,res,next) => {
    res.status(404).send("Sorry, no content here");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
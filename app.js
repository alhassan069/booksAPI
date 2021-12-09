const express = require("express");
const mongoose = require("mongoose");

const connect = () =>{
    mongoose.connect(" mongodb+srv://alhassan069:AtlasDb@cluster0.xcdqu.mongodb.net/books");
} 

const app = express();
app.use(express.json());

const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
}, {
    versionKey: false,
    timestamps: true,
});

const Section = mongoose.model("section", sectionSchema);


const authorSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
}, {
    versionKey: false,
    timestamps: true,
});

const Author = mongoose.model("author", authorSchema);

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    body: { type: String, required: true },
    checked: { type: Boolean, required: true },
    section: { // mongo id for a document in the user collection
        type: mongoose.Schema.Types.ObjectId,
        ref: "section",
        required: true
    },
    author_name: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "author",
        required: true,
    },]
}, {
    versionKey: false,
    timestamps: true,
});

const Book = mongoose.model("book", bookSchema);

// CRUD OPERATIONS ----section

app.post("/section", async (req, res) => {
    try {
        const section = await Section.create(req.body);

        return res.status(201).send(section);
    } catch (e) { // this e is called exception

        return res.status(500).json({ message: e.message, status: "failed" });
    }

});

app.get("/section", async (req,res) => {
    try {
        const section = await Section.find().lean().exec();

        return res.send({section});
    } 
    catch (e) {
        return res.status(500).json({message: e.message,status:"Failed"});
    }
})

app.get("/section/:id", async (req, res) => {
    try {
        const section = await Section.findById(req.params.id).lean().exec();

        return res.send(section);
    } catch (e) { // this e is called exception

        return res.status(500).json({ message: e.message, status: "failed" });
    }

});

app.delete("/section/:id", async (req, res) => {
    try {
        const tag = await Section.findByIdAndDelete(req.params.id).lean().exec();

        return res.status(200).send(tag);
    } catch (e) { // this e is called exception

        return res.status(500).json({ message: e.message, status: "failed" });
    }

});

// CRUD FOR AUTHOR

app.post("/author", async (req, res) => {
    try {
        const author = await Author.create(req.body);

        return res.status(201).send(author);
    } catch (e) { // this e is called exception

        return res.status(500).json({ message: e.message, status: "failed" });
    }

});

app.get("/author", async (req,res) => {
    try {
        const author = await Author.find().lean().exec();

        return res.send({author});
    } 
    catch (e) {
        return res.status(500).json({message: e.message,status:"Failed"});
    }
})

app.get("/author/:id", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id).lean().exec();

        return res.send(author);
    } catch (e) { // this e is called exception

        return res.status(500).json({ message: e.message, status: "failed" });
    }

});

app.delete("/author/:id", async (req, res) => {
    try {
        const tag = await Author.findByIdAndDelete(req.params.id).lean().exec();

        return res.status(200).send(tag);
    } catch (e) { // this e is called exception

        return res.status(500).json({ message: e.message, status: "failed" });
    }

});


// CRUD FOR Books

app.post("/book", async (req, res) => {
    try {
        const book = await Book.create(req.body);

        return res.status(201).send(book);
    } catch (e) { // this e is called exception

        return res.status(500).json({ message: e.message, status: "failed" });
    }

});

app.get("/book", async (req,res) => {
    try {
        const book = await Book.find().lean().exec();

        return res.send({book});
    } 
    catch (e) {
        return res.status(500).json({message: e.message,status:"Failed"});
    }
})

app.get("/book/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).lean().exec();

        return res.send(book);
    } catch (e) { // this e is called exception

        return res.status(500).json({ message: e.message, status: "failed" });
    }

});

app.delete("/book/:id", async (req, res) => {
    try {
        const tag = await Book.findByIdAndDelete(req.params.id).lean().exec();

        return res.status(200).send(tag);
    } catch (e) { // this e is called exception

        return res.status(500).json({ message: e.message, status: "failed" });
    }

});

// books that are checked out 

app.get("/checked", async (req,res) => {
    try {
        const book = await Book.find({checked:true}).lean().exec();

        return res.send({book});
    } 
    catch (e) {
        return res.status(500).json({message: e.message,status:"Failed"});
    }
})

// all books written by an author

app.get("/authorid/:id", async (req,res) => {
    try {
        const author = await Author.findById(req.params.id).lean().exec();
        const book = await Book.find({author_name:author._id}).lean().exec();

        return res.send({book});
    } 
    catch (e) {
        return res.status(500).json({message: e.message,status:"Failed"});
    }
})

// get all books in a section

app.get("/sectionid/:id", async (req,res) => {
    try {
        const section = await Section.findById(req.params.id).lean().exec();
        const book = await Book.find({section:section._id}).lean().exec();

        return res.send({book});
    } 
    catch (e) {
        return res.status(500).json({message: e.message,status:"Failed"});
    }
})

// find books in a section that are not checked out

app.get("/notchecked/:id", async (req,res) => {
    try {
        const section = await Section.findById(req.params.id).lean().exec();
        const book = await Book.find({section:section._id, checked:false}).lean().exec();
        // const notChecked = await Book.find({checked:false}).lean().exec();
        return res.send({book});
    } 
    catch (e) {
        return res.status(500).json({message: e.message,status:"Failed"});
    }
})

// find books of one author inside a section

app.get("/authorsection/:id/:ie", async (req,res) => {
    try {
        const section = await Section.findById(req.params.id).lean().exec();
        const author = await Author.findById(req.params.ie).lean().exec();
        const book = await Book.find({section:section._id, author_name:author._id}).lean().exec();
        // const notChecked = await Book.find({checked:false}).lean().exec();
        return res.send({book});
    } 
    catch (e) {
        return res.status(500).json({message: e.message,status:"Failed"});
    }
})


app.listen(3233, async function () {
    await connect();
    console.log("listening on port 3233")
});

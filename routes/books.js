
import express from 'express'
import BookData from '../models/Book.js'
import mongoose from 'mongoose';


const router = express.Router()

// localhost:5000/books

router.get('/',async (req, res)=>{
    try {
        const bookDatas =await BookData.find()
        console.log(bookDatas, "bookDatas")
        res.status(200).json(bookDatas)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post ("/", async (req,res) =>{

    const book = req.body

    const newBook = new BookData(book)
    console.log( newBook)
    try {
        await newBook.save()

        res.status(201).json(newBook)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.patch('/:id' ,async (req,res) =>{
    const {id: _id} = req.params
    const book = req.body

    if(!mongoose.Types.ObjectId.isValid (_id)) return res.status(500).send("No Book with that id")
 
        const updatedBook = await BookData.findByIdAndUpdate(_id,{...book,_id},  {new:true})

        res.json(updatedBook)

} )

router.delete('/:id', async (req, res) => {
    try {
      const {id} = req.params;
      if(!mongoose.Types.ObjectId.isValid (id)) return res.status(404).send("No Book with that id")
      await BookData.findByIdAndDelete(id);
      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete book', error });
    }
  });




// ----------------------------------------------------


router.patch('/:id/checkout', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
      const book = await BookData.findById(id);
      if (!book) return res.status(404).json({ message: 'Book Not Found' });
      if (!book.isAvailable) return res.status(400).json({ message: 'Book is already checked out' });

      book.isAvailable = false;
      book.checkedOutBy = userId;
      await book.save();

      res.status(200).json(book);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Check-in route
router.patch('/:id/checkin', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
      const book = await BookData.findById(id);
      if (!book) return res.status(404).json({ message: 'Book Not Found' });
      if (book.isAvailable) return res.status(400).json({ message: 'Book is already checked in' });
      if (book.checkedOutBy.toString() !== userId) return res.status(403).json({ message: 'Only the user who checked out the book can check it back in' });

      book.isAvailable = true;
      book.checkedOutBy = null;
      await book.save();

      res.status(200).json(book);
  } catch (error) {
      res.status(500).json({ message: error.message });
  } 
});




//  SEARCH

router.get('/search',async (req, res)=>{

  const {searchQuery} =req.query

  try {
      const title = new RegExp(searchQuery,'i')
      const books = await BookData.find({title} )
      
      res.status(200).json({data:books})
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

export default router
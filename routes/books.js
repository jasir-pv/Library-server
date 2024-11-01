
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

        // https://www.restapitutorial.com/httpstatuscodes.html

        res.status(201).json(newBook)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.patch('/:id' ,async (req,res) =>{
    const {id: _id} = req.params
    const book = req.body

    if(!mongoose.Types.ObjectId.isValid (_id)) return res.status(500).send("No Post with that id")
 
        const updatedBook = await BookData.findByIdAndUpdate(_id,{...book,_id},  {new:true})

        res.json(updatedBook)

} )

router.delete('/:id', async (req, res) => {
    try {
      const {id} = req.params;
      if(!mongoose.Types.ObjectId.isValid (id)) return res.status(404).send("No Post with that id")
      await BookData.findByIdAndDelete(id);
      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete book', error });
    }
  });


export default router;
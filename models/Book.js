

import mongoose from "mongoose"


const BookSchema = new mongoose.Schema(
    {
        title: {type:String},
        author: {type:String},
        category: {type:String},
        inStock:{type: Boolean,default:true},
        selectedFile:String,
        img:{type:String},
    },
    {timestamps:true}
)

const BookData =mongoose.model("Book", BookSchema)

export default BookData
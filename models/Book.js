

import mongoose from "mongoose"


const BookSchema = new mongoose.Schema(
    {
        title: {type:String},
        name: {type:String},
        author: {type:String},
        category: {type:String},
        isAvailable:{type: Boolean,default:true},
        checkedOutBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        selectedFile:String,
        img:{type:String},
    },
    {timestamps:true}
)

const BookData =mongoose.model("Book", BookSchema)

export default BookData
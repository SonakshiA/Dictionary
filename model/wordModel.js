const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const wordSchema = new Schema({
    word:{
        type:String,
        required:true
    },
    meaning:{
        type:String
    }
},{timestamps:true});

const Word = mongoose.model('Word',wordSchema);
module.exports = Word;
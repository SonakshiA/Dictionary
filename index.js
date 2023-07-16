require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Word = require('./model/wordModel.js');
const app = express();
let word = "";
let meaning = "";



mongoose.connect(process.env.dbURI).then(() => {
    console.log('DB connected');
    app.listen(3000);
})
app.set('view engine','ejs');


app.use(express.urlencoded({extended: true}));

app.get('/',async (req,res) => {
    await getData();
    console.log(word);
    console.log(meaning);   
    Word.find().then(result => {
        res.render('homepage',{word:word,meaning:meaning,words:result});
    })
})


app.get('/?',(req,res) => { //keeps redirecting to this for some reason so as a fallback
    res.redirect('/');
})

app.post('/post',(req,res) => {
    const w = new Word();
    w.word = word;
    w.meaning = meaning;
    w.save().then(() => res.redirect('/')).catch(() => console.log("error"));
})

app.get('/delete/:id',(req,res) => {
    const id = req.params.id;
    Word.findByIdAndDelete(id).then(() => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    })
})

async function getData() {
    const url =  'https://random-word-api.herokuapp.com/word?number=1';
    const response = await fetch(url);
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    for(let index = 0; index<jsonResponse.length; index++){
        word = (jsonResponse[index]).toUpperCase();
        await getInfo(jsonResponse[index]);
    }
} 

async function getInfo(word){
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`; //template string
    const response = await fetch(url);
    const jsonResponse = await response.json();
    meaning = jsonResponse[0]?.meanings[0].definitions[0].definition;
}


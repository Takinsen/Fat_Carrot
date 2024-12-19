import express from 'express';
const app = express();
app.use(express.static("public"));

//----------------------------------------------------------------//

const PORT = 80;

//----------------------------------------------------------------//

app.listen(PORT , (req , res)=>{

    console.log('Frontend Server is Ready!');
    console.log('Link : http://localhost:' + PORT);

})
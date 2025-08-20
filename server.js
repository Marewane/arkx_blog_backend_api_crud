const express = require('express');
const {query,validationResult,matchedData} = require('express-validator');
const app = express();

app.use(express.json());



app.get('/test',(req,res)=>{
    res.json({
        message:'This is test route'
    });
})

app.get('/hello', query('person').notEmpty().escape(), (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    console.log(data)
    return res.send(`Hello, ${data.person}!`);
  }

  res.send({ errors: result.array() });
});

app.listen(5000,()=>{
    console.log('this is the port 5000');
})
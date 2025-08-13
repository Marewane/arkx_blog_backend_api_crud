const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const articleRouter = require('./routes/postRoutes');

// global middleware
app.use(express.json());
app.use(cors());


// logging middleware
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
    next();
})



app.use('/api',articleRouter);

// non route exists
app.use((req,res,next)=>{
    let error = new Error("This route does not exists");
    error.status = 404;
    next(error);
})
// error handling middleware
app.use((err,req,res,next)=>{
    console.log("Error : ",err.message);
    res.status(err.status || 5000).json({
        error:err.message
    });
})

app.listen(port,()=>{
    console.log('server has been successfully connect on port 5000');
});

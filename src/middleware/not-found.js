function notFoundMiddleware(app){
    // non route exists
    app.use((req,res,next)=>{
        res.status(404).json({
            error:{
                message:"Route not found"
            }
        })
    })
}

module.exports = notFoundMiddleware;
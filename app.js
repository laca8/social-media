const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')
const app = express();
dotenv.config()
const dbUri = require('./config/db')
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
//db
dbUri()
// routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
//serve static assets in production
if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}else{
    app.get('/',(req,res)=>{
        res.send('api running...')
    })
}
const PORT = process.env.PORT || 5001
//serve static
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
})

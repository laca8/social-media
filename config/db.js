const mongoose = require('mongoose')
const config = require('config')
const dbUri = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            //useCreatendex: true,
            //useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true

        })
        console.log('db connect');
    } catch (err) {
        console.error(err.message);
        //exit process with failure
        process.exit(1)
    }
}
module.exports = dbUri

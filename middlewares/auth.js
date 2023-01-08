const jwt = require('jsonwebtoken');
const config = require('config')
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'not token, authorzied' })
    }
    try {
        const decoded = jwt.verify(token, 'laca88');
        req.user = decoded.user
        console.log(decoded)
        console.log(req.user);
        next()
    } catch (err) {
        console.error(err.message)
        res.status(401).json({ msg: 'token is not valid' })

    }
}
module.exports = auth;
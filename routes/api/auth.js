const express = require('express');
const auth = require('../../middlewares/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const config = require('config')
const jwt = require('jsonwebtoken')
const router = express.Router();
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json({ user })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')

    }
});
//login
router.post('/', [
    check('email', 'plz valid email').isEmail(),
    check('password', 'plz valid password').exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        const { email, password } = req.body
        try {
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'invalid credintaials' }] })

            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({ errors: [{ msg: 'password is not matched' }] })
            }
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, 'laca88', {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.json({ token })
            })
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error')
        }
    })
module.exports = router;
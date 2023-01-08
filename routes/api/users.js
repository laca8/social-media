const express = require('express');
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const User = require('../../models/User')
const config = require('config')
const jwt = require('jsonwebtoken')
const router = express.Router();
router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'plz enter valid email').isEmail(),
    check('password', 'password must be 6 charcters').isLength({ min: 6 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        const { name, email, password } = req.body;
        try {
            let user = await User.findOne({ email })
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'email is already exist' }] })
            }
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'

            })
            user = await new User({
                name,
                email,
                password,
                avatar
            })
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            const payload = {
                user: {
                    id: user.id
                }

            }
            jwt.sign(payload, 'laca88', {
                expiresIn: 36000
            }, (err, token) => {
                if (err) throw err;
                res.json({ token })
            })

        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error')
        }

    });
module.exports = router
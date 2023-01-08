const express = require('express');
const User = require('../../models/User')
const Profile = require('../../models/Profile');
const Post = require('../../models/Post')
const auth = require('../../middlewares/auth')
const { check, validationResult } = require('express-validator')
const router = express.Router();
//route  GET api/profile/me
//desc    get current user profile 
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
        if (!profile) {
            res.status(400).json({ msg: 'no profile for this user' })
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }
});
//route   Post api/profile
//desc    Create or Update user profile
router.post('/', [auth, [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty(),


]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;
        //build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (website) profileFields.website = website;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }
        //build social object 
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;
        try {
            let profile = await Profile.findOne({ user: req.user.id })
            if (profile) {
                //update
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                return res.json(profile);
            }
            profile = new Profile(profileFields)
            await profile.save()
            return res.json(profile)
        } catch (err) {
            console.error(err.message);
            console.log(err);
            res.status(500).send('server error')
        }

    }
)
//route   GET api/profile
//desc    get all profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message);
        console.log(err);
        res.status(500).send('server error')

    }
});
//route  GET api/profile/user/:user_id
//desc   get profile by id 
router.get('/user/:user_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(400).json({ msg: 'profile not found' })
        }
        res.json(profile)
    } catch (err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'profile not found' })

        }
        console.error(err.message);
        res.status(500).send('server error')
    }
});
//route delete api/profile
//desc  delete profile,user & posts
router.delete('/', auth, async (req, res) => {
    try {
        //remove posts
        await Post.deleteMany({ user: req.user.id })
        //remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        console.log(req.user.id)
        //remove user
        await User.findOneAndRemove({ _id: req.user.id })
        console.log(req.user.id)
        res.json({ msg: 'user deleted' })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')


    }
});
//route  put api/profile/experience
//desc   add experience 
router.put('/experience', [auth, [
    check('title', 'title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from is required').not().isEmpty(),
],
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        const { title, company, location, from, to, description, current } = req.body;
        const newExp = {
            company, title, location, from, to, description
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id })
            profile.experience.unshift(newExp)
            await profile.save()
            res.json(profile)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error')

        }

    }
)
//route  put api/profile/education
//desc   add education
router.put('/education', [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
    check('from', 'from is required').not().isEmpty(),
],
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        const { school, degree, fieldofstudy, from, to, description, current } = req.body;
        const newEdu = {
            school, degree, fieldofstudy, from, to, description
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id })
            profile.education.unshift(newEdu);
            await profile.save()
            res.json(profile)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error')

        }

    }
)
//route delete api/profile/experience/:exp_id
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1)
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
});
//route delet 6e1qe api/education/:edu_id
//desc  delete profile education
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
        profile.education.splice(removeIndex, 1);
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
})
module.exports = router;
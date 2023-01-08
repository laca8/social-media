const express = require('express');
const auth = require('../../middlewares/auth')
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')
const User = require('../../models/User');
const router = express.Router();
//route    post api/posts
//desc     create post
router.post('/', [auth, [
    check('text', 'text is required').not().isEmpty()

]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id)
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });
            const post = await newPost.save()
            res.json(post)
        } catch (err) {
            console.error(err.message)
            return res.status(500).send('server error')
        }
    }
)

//route   GET api/posts
//desc     get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('server error')
    }
})
//route   Get api/posts/:id
//desc    get post by id
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'post not found' })
        }
        res.json(post)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(500).json({ msg: 'post not found' })
        }
        return res.status(500).send('server error')
    }
})
//route  Delete api/posts/:id
//desc   delete post 
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'post not found' })
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'user not authorized' })
        }
        await post.remove()
        res.json({ msg: 'post deleted' })

    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(500).json({ msg: 'post not found' })
        }
        return res.status(500).send('server error')
    }
})
//route    put api/posts/like/:id
//desc     put like post 
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'post not found' })
        }
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(404).json({ msg: 'post is already like' })

        }
        const newLike = {
            user: req.user.id
        }
        post.likes.unshift(newLike)
        await post.save()
        res.json(post.likes)

    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(500).json({ msg: 'post not found' })
        }
        return res.status(500).send('server error')
    }
})
//route    put api/posts/unlike/:id
//desc     put unlike post
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(500).json({ msg: 'post not found' })
        }
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(401).json({ msg: 'post is already unlike' })
        }
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)
        await post.save()
        res.json(post.likes)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(500).json({ msg: 'post not found' })
        }
        return res.status(500).send('server error')
    }
})
//route   put /api/posts/comment/:id
//desc     add comment 
router.post('/comment/:postId', [auth,
    [
        check('text', 'text is required').not().isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id)
            const post = await Post.findById(req.params.postId)
            if (!post) {
                return res.status(500).json({ msg: 'post not found' })
            }
            const newComment = {
                text: req.body.text,
                user: req.user.id,
                name: user.name,
                avatar: user.avatar
            }
            post.comments.unshift(newComment)
            await post.save()
            res.json(post.comments)

        } catch (err) {
            console.error(err.message)
            if (err.kind == 'ObjectId') {
                return res.status(500).json({ msg: 'post not found' })
            }
            return res.status(500).send('server error')
            console.log(err);
        }

    }
)

//route   delete api/posts/comment/:id/:id
//desc    delete comment post 
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(500).json({ msg: 'post not found' })
        }
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        //check 
        if (!comment) {
            return res.status(404).json({ msg: 'comment is not found' })
        }
        //check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'user not authorized' })
        }
        //remove 
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
        post.comments.splice(removeIndex, 1)
        await post.save()
        return res.json(post.comments)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(500).json({ msg: 'post not found' })
        }
        return res.status(500).send('server error')
    }
})
module.exports = router;
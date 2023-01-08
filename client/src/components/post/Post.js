import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/spinner'
import { getPost } from '../../actions/post'
import PostItem from '../posts/PostItem'
import CommentPost from './CommentPost'
import commentItem from './commentItem'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { deleteComment } from '../../actions/post';
const Post = ({deleteComment, getPost, post: { post, loading, _id }, match ,auth,postId}) => {
    useEffect(() => {
        getPost(match.params.id)
    }, [getPost])
    return loading || post === null ? <Spinner /> : <Fragment>
        <Link to="/posts" className="btn">Back To Posts</Link>
        <PostItem post={post} showAction={false} />
        <CommentPost postId={post._id} />
        <div className="comments">
            {post.comments.map(comment => (
                <commentItem key={comment._id} comment={comment} postId={post._id} />
            ))}
        </div>
        <div className="comments">
            {post.comments.map(comment => (
                   <div class="post-form">
                   <div class="post bg-white p-1 my-1">
                       <div>
                           <Link to={`/profile/${comment.user}`}>
                               <img
                                   class="round-img"
                                   src={comment.avatar}
                                   alt=""
                               />
                               <h4>{comment.name}</h4>
                           </Link>
                       </div>
                       <div>
                           <p class="my-1">
                               {comment.text}
                           </p>
                           <p class="post-date">
                               Post on <Moment format="YYYY/MM/DD">{comment.date}</Moment>
                           </p>
           
                           {!auth.loading && comment.user === auth.user.user._id && (
                               <button onClick={e => deleteComment(match.params.id, comment._id)} type="button" className="btn btn-danger">
                                   <i className="fas fa-times"></i>
           
                               </button>
                           )}
           
                       </div>
                   </div>
               </div>
            ))}
        </div>
    </Fragment>
}
Post.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    postId: PropTypes.number.isRequired,

}
const mapStateToProps = state => ({
    post: state.post,
    auth: state.auth
});
export default connect(mapStateToProps, { deleteComment,getPost })(Post)
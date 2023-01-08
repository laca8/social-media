import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/spinner'
import Moment from 'react-moment'
import { getPosts } from '../../actions/post'
import { addLikes, removeLikes } from '../../actions/post'
import { deletePost } from '../../actions/post'
const PostItem = ({ auth, post: { _id, name, text, avatar, user, likes, comments, date }, addLikes, removeLikes, deletePost, showAction }) =>
(
    <Fragment>
        <div class="post bg-white p-1 my-1">
            <div>
                <Link to={`/profile/${user}`}>
                    <img
                        class="round-img"
                        src={avatar}
                        alt=""
                    />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p class="my-1">
                    {text}
                </p>
                <p class="post-date">
                    Post on <Moment format="YYYY/MM/DD">{date}</Moment>
                </p>
                {showAction && <Fragment>
                    <button type="button" onClick={e => addLikes(_id)} class="btn btn-light">
                        <i class="fas fa-thumbs-up"></i>
                        <span> {likes.length > 0 && (
                            <span>{likes.length}</span>
                        )}</span>

                    </button>
                    <button type="button" onClick={e => removeLikes(_id)} class="btn btn-light">
                        <i class="fas fa-thumbs-down"></i>
                    </button>
                    <Link to={`/posts/${_id}`} class="btn btn-primary">
                        Discussion {comments.length > 0 && (
                            <span class='comment-count'>{comments.length}</span>
                        )}

                    </Link>

                    {!auth.loading && user === auth.user.user._id && (
                        <button
                            type="button"
                            class="btn btn-danger"
                            onClick={e => deletePost(_id)}
                        >
                            <i class="fas fa-times"></i>
                        </button>
                    )}
                </Fragment>}


            </div>
        </div>
    </Fragment>
)
PostItem.defaultProps = {
    showAction: true
}
PostItem.propTypes = {
    addLikes: PropTypes.func.isRequired,
    removeLikes: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    deletePost: PropTypes.func.isRequired

}
const mapStateToProps = state => ({
    auth: state.auth,
});
export default connect(mapStateToProps, { getPosts, addLikes, removeLikes, deletePost })(PostItem)
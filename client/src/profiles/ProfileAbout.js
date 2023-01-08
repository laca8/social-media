import React, { Fragment } from "react";
import PropTypes from 'prop-types'
import auth from "../reducers/auth";
const ProfileAbout = ({ profile: { bio, skills, user: { name } } }) => <Fragment>
    <div class="profile-about bg-light p-2">
        {bio && (
            <Fragment>
                <h2 class="text-primary">{name.trim().split(' ')[0]}`s Bio</h2>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed
                    doloremque nesciunt, repellendus nostrum deleniti recusandae nobis
                    neque modi perspiciatis similique?
                </p>
            </Fragment>
        )}

        <div class="line"></div>
        <h2 class="text-primary">Skill Set</h2>
        <div class="skills">
            {skills.map((skill, index) => (
                <div div key={index} className="p-1" >
                    <i className="fas fa-check"></i> {skill}
                </div>
            ))}
        </div>
    </div>

</Fragment >
ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
    profile: auth.profile
})

export default ProfileAbout;

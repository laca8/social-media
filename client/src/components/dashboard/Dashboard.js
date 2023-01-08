import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { deleteAccount, getCurrentProfile } from '../../actions/profile.js';
import Spinner from '../layout/spinner.js';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardAction.js';
import Experience from './Experience.js';
import Education from './Education.js';
const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading }, profiles, deleteAccount }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile])
    return loading && profile === null ? (<Spinner />) : (<Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user">{' '}</i> Welcome  {user && user.user.name} </p>
        {profile !== null ? <Fragment><DashboardActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div className="my-2">
                <button className="btn btn-danger" onClick={() => deleteAccount()}>      <i className="fas fa-user-minus"></i> Delete My Account</button>

            </div>

        </Fragment> : <Fragment><p>
            You have not yet srtup a profile , please add some info
        </p>
            <Link to="/create-profile" className="btn btn-primary my-1">
                Create Profile
            </Link>
        </Fragment>}
    </Fragment>
    )
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profiles: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile,

})
export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
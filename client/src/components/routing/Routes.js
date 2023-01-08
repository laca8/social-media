
import React, { Fragment } from 'react'
import Register from '../auth/register'
import Login from '../auth/login'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Alert from '../layout/Alert'
import Dashboard from '../dashboard/Dashboard'
import CreateProfile from "../profile-form/CreateProfile";
import EditProfile from "../profile-form/EditProfile";
import PrivateRouting from '../routing/PrivateRouting';
import AddExperience from "../profile-form/AddExperience";
import AddEducation from "../profile-form/AddEducation";
import Profiles from '../../profiles/Profiles'
import Profile from '../../profiles/Profile'
import Posts from '../posts/Posts'
import Post from '../post/Post'
import NotFound from '../layout/NotFound'
const Routes = () => {
    return (
        <section className="container">
            <Alert />
            <Switch>
                <Route exact path='/register' component={Register} />
                <Route exact path='/login' component={Login} />
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/profile/:id" component={Profile} />
                <PrivateRouting exact path='/dashboard' component={Dashboard} />
                <PrivateRouting exact path='/create-profile' component={CreateProfile} />
                <PrivateRouting exact path='/edit-profile' component={EditProfile} />
                <PrivateRouting exact path='/add-experience' component={AddExperience} />
                <PrivateRouting exact path='/add-education' component={AddEducation} />
                <PrivateRouting exact path='/posts' component={Posts} />
                <PrivateRouting exact path='/posts/:id' component={Post} />
                <Route component={NotFound} />
            </Switch>
        </section>
    )
}
export default Routes

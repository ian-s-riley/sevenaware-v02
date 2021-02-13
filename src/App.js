import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { SignIn, SignUp, ConfirmSignUp } from 'aws-amplify-react';
import { ConfirmSignIn, ForgotPassword, RequireNewPassword, VerifyContact } from 'aws-amplify-react';

// core components
import Admin from "layouts/Admin.js";

function App() {    
  return (    
      <Switch>
        <Route path="/admin" component={Admin} />
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
  );
}

export default App;


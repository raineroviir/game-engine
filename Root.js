import React from 'react';

export default class Root extends React.Component {
  render() {
    return (
      <div>
        Hello World!
        <div className="action-button">
        <a href="/auth/facebook" className="btn btn-primary btn-lg"><i className="fa fa-facebook"></i> Sign in with Facebook</a>
        </div>
        <div className="fb-login-button" data-max-rows="1" data-size="xlarge" data-show-faces="false" data-auto-logout-link="true" onlogin="checkLoginState();"></div>
      </div>
    );
  }
}

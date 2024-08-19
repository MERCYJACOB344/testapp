import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { API, Auth } from 'aws-amplify';
import { useAppContext } from '../../lib/contextLib';
import { storeSession } from '../../lib/commonLib';
import { USER_ROLE } from '../../constants.jsx';

const Login = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [dismissingAlertShow, setDismissingAlertShow] = useState(false);
  const [alertVariant, setalertVariant] = useState('');
  const [alertMessage, setalertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnableLogin, setIsEnableLogin] = useState(false);
  const { userHasAuthenticated } = useAppContext();
  const { userEmail, setuserEmail } = useAppContext();
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    document.documentElement.setAttribute('data-placement', 'horizontal');
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setIsEnableLogin(true);
      await Auth.signIn(formData.email, formData.password);
      userHasAuthenticated(true);
      const user_Email = formData.email;
      setuserEmail(user_Email);

      let userObj = {
        role: USER_ROLE.User,
        email: user_Email,
        approved: true,
      };
      const loginState = { isAuthenticated: true, user_Email, userInfo: userObj };

      storeSession(loginState);

      
      const response = await fetch('https://wonderful-stone-07c1f4d1e.5.azurestaticapps.net/api//getUsersInfo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Response from Azure Function:', data);

      history.push('/dashboards');
    } catch (error) {
      console.error('Error:', error.message);
      setIsEnableLogin(false);
      setIsLoading(false);
      setDismissingAlertShow(true);
      setalertVariant("danger");
      setalertMessage(error.message);
    }
  };
  
  return (
    <div style={{ textAlign: '-webkit-center' }}>
      <div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 rounded">
        <div className="sw-lg-50 px-5">
          <div className="mb-5">
            <h2 className="cta-1 mb-0 text-primary">Welcome,</h2>
            <h2 className="cta-1 text-primary">let's get started!</h2>
          </div>
          
          <div className="mb-5">
            <p className="h6">Please use your credentials to login.</p>
            <p className="h6">
              If you are not a member, please <NavLink to="/registerpage">register</NavLink>.
            </p>
          </div>
          {dismissingAlertShow && (
            <Alert variant={alertVariant} onClose={() => setDismissingAlertShow(false)} dismissible>
              <strong>{alertMessage}</strong>
            </Alert>
          )}

          <div>
            <form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
              <div className="mb-3 filled form-group tooltip-end-top">
                <CsLineIcons icon="email" />
                <Form.Control
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>
              <div className="mb-3 filled form-group tooltip-end-top ">
                <CsLineIcons icon="lock-off" />
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                <NavLink className="text-small position-absolute t-3 e-3" to="/forgotpassword">
                  Forgot?
                </NavLink>
              </div>
              <Button size="lg" type="submit" disabled={isEnableLogin}>
                {isEnableLogin ? (
                  <div>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Logging In..
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

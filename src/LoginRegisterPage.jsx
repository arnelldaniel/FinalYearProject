import React, { useState } from 'react';
import { db } from './firebase';
import { setDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import './styles.css';

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Toggle password visibility for registration form
  const toggleRegisterPasswordVisibility = () => {
    setShowRegisterPassword(!showRegisterPassword);
  };

  // Toggle password visibility for login form
  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const handleRegister = async () => {
    if (!registerUsername || !registerPassword) {
      alert('Please fill in both username and password fields.');
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', registerUsername));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert('Username is already taken. Please choose another one.');
        return;
      }

      const userRef = doc(db, 'users', registerUsername);
      await setDoc(userRef, { username: registerUsername, password: registerPassword });
      alert('Registration successful');

      // Clear form after successful registration
      setRegisterUsername('');
      setRegisterPassword('');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', loginUsername));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('User not found');
      } else {
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          if (user.password === loginPassword) {
            alert('Login successful');
            localStorage.setItem('username', loginUsername);
            window.location.href = '/inventory';
          } else {
            alert('Incorrect password');
          }
        });
      }

      // Clear form after successful login
      setLoginUsername('');
      setLoginPassword('');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="login-register-page">
      <div className="container">
        {/* Conditional rendering: Register form or Login form */}
        {!isLogin ? (
          <div className="form-container" id="registerFormContainer">
            <h2>Register</h2>
            {/* Username input for registration */}
            <input
              type="text"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              placeholder="Username"
              required
            />
            {/* Password input with visibility toggle for registration */}
            <div className="password-input">
              <input
                type={showRegisterPassword ? 'text' : 'password'}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button onClick={toggleRegisterPasswordVisibility}>
                {showRegisterPassword ? 'Hide' : 'Show'} Password
              </button>
            </div>
            {/* Register button */}
            <button onClick={handleRegister}>Register</button>
            {/* Switch to Login form */}
            <div className="form-switch">
              <p>
                Already have an account?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(true);  // Switch to Login form
                  }}
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="form-container" id="loginFormContainer">
            <h2>Login</h2>
            {/* Username input for login */}
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              placeholder="Username"
              required
            />
            {/* Password input with visibility toggle for login */}
            <div className="password-input">
              <input
                type={showLoginPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button onClick={toggleLoginPasswordVisibility}>
                {showLoginPassword ? 'Hide' : 'Show'} Password
              </button>
            </div>
            {/* Login button */}
            <button onClick={handleLogin}>Login</button>
            {/* Switch to Register form */}
            <div className="form-switch">
              <p>
                Don’t have an account?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(false);  // Switch to Register form
                  }}
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginRegisterPage;

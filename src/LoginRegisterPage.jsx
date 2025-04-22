import React, { useState } from 'react';
import { auth, db } from './firebase';
import { setDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import './styles.css';

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleRegister = async () => {
    // Validate if both username and password are provided
    if (!registerUsername || !registerPassword) {
      alert('Please fill in both username and password fields.');
      return;
    }
  
    try {
      const userRef = doc(db, 'users', registerUsername);  // Create a document using the username as the ID
      await setDoc(userRef, { username: registerUsername, password: registerPassword });
      alert('Registration successful');
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
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="login-register-page">
      <div className="container">
        {!isLogin ? (
          <div className="form-container" id="registerFormContainer">
            <h2>Register</h2>
            <input
              type="text"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button onClick={handleRegister}>Register</button>
            <div className="form-switch">
              <p>
                Already have an account?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(true);
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
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button onClick={handleLogin}>Login</button>
            <div className="form-switch">
              <p>
                Don’t have an account?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(false);
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

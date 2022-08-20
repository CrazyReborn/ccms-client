import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CatImage from '../images/login-cat-1080.jpg';
import '../styles/Login.css';
import { changeFirstName, changeOrganization, changeRole, changeToken } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function sendLogin() {
    const body = JSON.stringify({username, password});
    fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
      },
      body: body,
    })
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem('access_token', data.access_token);
      dispatch(changeFirstName(data.firstName));
      dispatch(changeOrganization(data.organization));
      localStorage.setItem('orgId', data.organization);
      dispatch(changeRole(data.role));
      navigate('../');
    })
    .catch((err) => console.log(err));
  }

  function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    sendLogin();
  }

  return (
    <div className='login-main'>
      <div className='login-cat-container'>
        <img className='login-cat' src={CatImage} alt='a cat on a blue background' />
      </div>
      <section className='login-form-container'>
        <h1>Login</h1>
        <p>Don't have an account yet? Sign Up</p>
        <p></p>
        <form className='login-form' onSubmit={(e) => onSubmit(e)}>
          <label htmlFor='username'>
            Username
            <input type='text' id='username' onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label htmlFor='password'>
            Password
            <input type='password' id='password' onChange={(e) => setPassword(e.target.value)} />
          </label>
          <input type='submit' value={'Submit'} />
        </form>
      <div className='upsplash'>
      Photo by <a href="https://unsplash.com/@cedric_photography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Cédric VT </a> on 
         <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"> Unsplash</a>
      </div>
      </section>
    </div>
  )
}
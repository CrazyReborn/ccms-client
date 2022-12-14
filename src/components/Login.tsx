import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CatImage from '../images/login-cat-1080.jpg';
import '../styles/Login.css';
import { changeFirstName, changeOrganization, changeRole, changeToken } from '../features/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function sendLogin() {
    const body = JSON.stringify({username, password});
    return fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
      },
      body: body,
    })
    .then((res) => {
    if(res.status === 401) {
      throw new Error ('Wrong password or username');
    }
    return res.json();
    })
    .then((data) => {
      dispatch(changeToken(data.access_token));
      dispatch(changeFirstName(data.firstName));
      dispatch(changeOrganization(data.organization));
      dispatch(changeRole(data.role));
      navigate('../');
    })
    .catch((err) => console.log(err));
  }

  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    await sendLogin();
  }

  return (
    <div className='login-main'>
      <div className='login-cat-container'>
        <img className='login-cat' src={CatImage} alt='a cat on a blue background' />
      </div>
      <section className='login-form-container'>
        <h1>Login</h1>
        <p>Don't have an account yet? <Link className='link-general' to='/signup'>Sign Up</Link></p>
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
        C??dric VT </a> on 
         <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"> Unsplash</a>
      </div>
      </section>
    </div>
  )
}
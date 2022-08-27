import React, { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import CatImage from '../images/login-cat-1080.jpg';
import '../styles/Login.css';

export const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
  }

  return (
    <div className='login-main'>
      <div className='login-cat-container'>
        <img className='login-cat' src={CatImage} alt='a cat on a blue background' />
      </div>
      <section className='login-form-container'>
        <h1>Sign Up</h1>
        <p>Already have an account? <Link className='link-general' to='/login'>Login</Link></p>
        <form className='login-form' onSubmit={(e) => onSubmit(e)}>
          <div className='names'>
            <label htmlFor='first-name'>
              First name
              <input type='text' id='first-name' onChange={(e) => setFirstName(e.target.value)} />
            </label>
            <label htmlFor='last-name'>
              Last name
              <input type='text' id='last-name' onChange={(e) => setLastName(e.target.value)} />
            </label>
          </div>
          <label htmlFor='email'>
            Email
            <input type='email' id='email' onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label htmlFor='username'>
            Username
            <input type='text' id='username' onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label htmlFor='password'>
            Password
            <input type='password' id='password' onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label htmlFor='confirm-password'>
            Confirm assword
            <input type='password' id='confirm-password' onChange={(e) => setConfirmPassword(e.target.value)} />
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
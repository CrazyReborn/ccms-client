import React, { SyntheticEvent, useState } from 'react';
import CatImage from '../images/login-cat.jpg';

export const Login = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(username);
    console.log(password);
    console.log(confirmPassword);
  }

  return (
    <div className='login-main'>
      <img className='login-cat' src={CatImage} alt='a cat on a blue background' />
      <section className='login-form-container'>
        <h1>Sign Up</h1>
        <p>Already have an account? Sign In</p>
        <form className='login-form' onSubmit={(e) => onSubmit(e)}>
          <div id='names'>
            <label htmlFor='first-name'>
              First name
              <input type='text' id='first-name' onChange={(e) => setFirstName(e.target.value)} />
            </label>
            <label htmlFor='last-name'>
              Second name
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
          <button type='submit'>Submit</button>
        </form>
      </section>
    </div>
  )
}
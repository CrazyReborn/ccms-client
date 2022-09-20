import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import CatImage from '../images/login-cat-1080.jpg';
import '../styles/Login.css';

enum Mode {
  MEMBER = 'member',
  LEADER = 'leader',
}

export const SignUp = () => {
  const [mode, setMode] = useState<Mode>(Mode.MEMBER);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [orgId, setOrgId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ownerId, setOwnerId] = useState('');


  const [orgName, setOrgName] = useState('');

  const [loaded, setLoaded] = useState(false);
  const { token, organization } = useAppSelector((state) => state.user);

  // NOT DIMANIC, CHANGE LATER
  const [org, setOrg] = useState('630a2e1e45b5bbcbaf79ef9c');
  const navigate = useNavigate();

  function createUser() {
    const body = {
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
      organization: orgId,
      role: 'Caretaker',
    }
    fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    .then((res) => {
      if (res.status === 201) {
        navigate('../login');
      }
    })
    .catch((err) => console.log(err));
  }


  async function createOrg() {
    const body = {
      name: orgName,
      owner: ownerId,
      members: [],
    }
    fetch(`${process.env.REACT_APP_SERVER_URL}/organizations`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => setOrgId(data._id))
  }

  async function updateOwnerWithOrg() {
    const body = {
      organization: orgId,
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/${ownerId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    .then((res) => {
    if (res.status === 200) {
      navigate('../')
    }
    else {
      throw new Error(`Errors status: ${res.status}`)
    }
    })
  }

  function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    createUser();
  }

  return (
    <div className='login-main'>
      <div className='login-cat-container'>
        <img className='login-cat' src={CatImage} alt='a cat on a blue background' />
      </div>
      <section className='login-form-container'>
        <h1>Sign Up</h1>
        <p>Already have an account? <Link className='link-general' to='/login'>Login</Link></p>
        {
        mode === Mode.MEMBER &&
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
          <label htmlFor='org-id'>
              ID of the organization provided by the leader:
              <input type='text' id='org-id' onChange={(e) => setOrgId(e.target.value)} />
            </label>
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
        }
        {
        mode == Mode.LEADER &&
        <div className='leader-containers'>
        </div>
        }
      <div className='upsplash'>
      Photo by <a href="https://unsplash.com/@cedric_photography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Cédric VT </a> on 
         <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"> Unsplash</a>
      </div>
      </section>
    </div>
  )
}
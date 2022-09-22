import { response } from 'express';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { changeFirstName, changeOrganization, changeRole, changeToken } from '../features/userSlice';
import CatImage from '../images/login-cat-1080.jpg';
import '../styles/Login.css';

enum Mode {
  CARETAKER = 'Caretaker',
  LEADER = 'OrganizationLeader',
}

export const SignUp = () => {
  const [mode, setMode] = useState<Mode>(Mode.CARETAKER);

  //user data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [orgId, setOrgId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');

  //organization data


  const [orgName, setOrgName] = useState('');

  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const { organization } = useAppSelector((state) => state.user);

  // NOT DIMANIC, CHANGE LATER
  const [org, setOrg] = useState('630a2e1e45b5bbcbaf79ef9c');
  const navigate = useNavigate();

  async function createUser() {
    const organizationId = orgId === '' ? undefined : orgId;
    const body = {
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
      organization: organizationId,
      role: mode,
    }
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if(response.status === 201) {
      if(mode === Mode.CARETAKER) {
        navigate('../login');
      }
    }
    return response.json();
  }

  async function sendLogin() {
    const body = JSON.stringify({username, password});
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
        },
        body: body,
      });
      if (res.status === 401) {
        throw new Error('Wrong password or username');
      }
      const data = await res.json();

      dispatch(changeToken(data.access_token));
      dispatch(changeFirstName(data.firstName));
      dispatch(changeOrganization(data.organization));
      dispatch(changeRole(data.role));
      setToken(data.access_token);
      return data.access_token;
    } catch (err) {
      return console.log(err);
    }
  }

  async function createOrg(accessToken: string, id: string) {
    const body = {
      name: orgName,
      owner: id,
      members: [],
    };
    console.log(accessToken);
    console.log(body);
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/organizations`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body)
    });
   return response.json();
  }

  async function updateOwnerWithOrg(id: string, newOrgId: string) {
    const body = {
      organization: newOrgId,
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/${id}`, {
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
      navigate('../login')
    }
    else {
      throw new Error(`Errors status: ${res.status}`)
    }
    })
  }

  async function onSubmitMember(e: SyntheticEvent) {
    e.preventDefault();
    await createUser();
  }

  async function onSubmitLeader(e: SyntheticEvent) {
    e.preventDefault();
    const data = await createUser();
    setOwnerId(await data._id);
    const newToken = await sendLogin();
    const newOrg = await createOrg(newToken, data._id);
    setOrgId(newOrg._id);
    await updateOwnerWithOrg(data._id, newOrg._id);
  }

  return (
    <div className='login-main'>
      <div className='login-cat-container'>
        <img className='login-cat' src={CatImage} alt='a cat on a blue background' />
      </div>
      <section className='login-form-container'>
        <h1>Sign Up</h1>
        <p>Already have an account? <Link className='link-general' to='/login'>Login</Link></p>
        {mode === Mode.CARETAKER ? 
        <button onClick={() => setMode(Mode.LEADER)}>I am a leader</button>
        :
        <button onClick={() => setMode(Mode.CARETAKER)}>I am a caretaker</button>
      }
        <form className='login-form' onSubmit={(e) => mode === Mode.CARETAKER? onSubmitMember(e) : onSubmitLeader(e)}>
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
          {mode === Mode.LEADER ?
            <label htmlFor='org-name'>
              Name for your organization
              <input type='text' id='org-name' onChange={(e) => setOrgName(e.target.value)} />
            </label>
            :
            <label htmlFor='org-id'>
              ID of the organization(use '630a2e1e45b5bbcbaf79ef9c' for demo):
              <input type='text' id='org-id' onChange={(e) => setOrgId(e.target.value)} />
            </label>
            }
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
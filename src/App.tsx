import React, { useEffect, useState } from 'react';
import './App.css';
import { Outlet, useNavigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinnner';
import Navbar from './components/Navbar';
import { useAppSelector } from './app/hooks';

function App() {
  const navigate = useNavigate();
  const [err, setErr] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState('');

  const usr = useAppSelector((state) => state.user);
  const {token, firstName, organization} = usr;
  const [org, setOrg] = useState({});

  if(!token || token === '') {
    navigate('./login');
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/protected`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((res) => {
      if (res.status === 403) {
        navigate('./login')
      }
      else if (res.status === 401) {
        throw new Error('You do not have permission to access this data');
        
      }
      else if(res.status !== 200) {
        throw new Error(`An error occured. Code ${res.status}`);
      }
      return res.json();
    })
    .then((json) => setData(json.id))
    .catch((error: any) => {
      setErr(error);
      setLoaded(true);
    })
    fetch(`${process.env.REACT_APP_SERVER_URL}/organizations/${organization}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then((res) => {
      if(res.status === 401) {
        throw new Error('You do not have permission to access this data');
      }
      else if(res.status === 403) {
        navigate('./login')
      }
      if(res.status === 200) {
        return res.json();
      }
    })
    .then((data) => {
      setOrg(data);
    })
    .finally(() => setLoaded(true))
  }, [data, err]);

//Mock user and org
  const user = {
    firstName: 'Jeff',
    role: 'OrganizationLeader'
  }

  // const organization = {
  //   name: 'FlatBushCats',
  // }

  if(!loaded) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <div className='main-container'>
      <Navbar user={user} organization={organization}/>
      <Outlet></Outlet>
    </div>
  )
}

export default App;

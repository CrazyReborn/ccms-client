import React, { useEffect, useState } from 'react';
import './App.css';
import { Outlet, useNavigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinnner';
import Navbar from './components/Navbar';

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const [err, setErr] = useState(null);

  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState('');

  if(!token && typeof token == 'undefined') {
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
      if (res.status === 401 || res.status === 403) {
        navigate('./login')
      }
      else if(res.status !== 200) {
        throw new Error('Something went wrong. Try again');
      }

      return res.json();

    })
    .then((json) => setData(json.id))
    .catch((error: any) => {
      setErr(error);
      setLoaded(true);
    })
    .finally(() => setLoaded(true))
  }, [data, err]);

//Mock user and org
  const user = {
    firstName: 'Jeff',
    role: 'OrganizationLeader'
  }

  const organization = {
    name: 'FlatBushCats',
  }

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

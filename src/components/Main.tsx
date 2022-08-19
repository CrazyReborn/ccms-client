import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinnner";
import Navbar from "./Navbar";
import '../styles/Main.css';

export function Main() {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  if(!token && typeof token == 'undefined') {
    navigate('../login');
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/protected`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((res) => res.json())
    .then((json) => setData(json.id))
    .then(() => setLoaded(true))
    .catch((err) => console.log(err))
    .finally(() => setLoaded(true))
  }, [data]);

//Mock user and org
  const user = {
    firstName: 'Jeff',
    role: 'Volunteer'
  }

  const organization = {
    name: 'FlatBushCats',
  }

  if (loaded) {
    return (
      <div className='main-container'>
        <Navbar user={user} organization={organization}/>
        <p>main conponent</p>
      </div>
    )
  }
  else {
    return (
      <LoadingSpinner />
    )
  }
}
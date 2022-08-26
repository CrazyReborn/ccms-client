import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinnner";
import '../styles/ColoniesMini.css';

export default function ColoniesMini() {
  const [colonies, setColonies] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    if(!loaded) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/colonies`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      .then((res) => {
        if (res.status === 401) {
          return navigate('../login')
        }
        if (res.status === 403) {
          return console.log('You cant access this data')
        }
        return res.json()
      })
      .then((data) => {
        setColonies(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoaded(true));
    }
  })

  if(!loaded) {
    return (
      <div className='colonies-mini-container'>
        <LoadingSpinner />
      </div>
    )
  }
  return (
    <div className='colonies-mini-container'>
      <h2>Cat colonies</h2>
      {colonies.map((colony: any , index) => {
        return (
          <div key={`${colony['_id']}${index}`} className='colony-mini'>
            <p>{colony['name']}</p>
            <p>Cats: {colony['registeredCats'].length  === 0 ?  '0': colony['registeredCats'].length + 1}</p>
          </div>
        )
      })}
    </div>
  )
}
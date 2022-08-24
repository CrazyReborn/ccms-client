import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinnner";
import '../styles/Colonies.css';
import { useNavigate } from "react-router-dom";

export default function Colonies ({ mode, setSectors, setSectorsLoaded }: any) {
  const [colonies, setColonies] = useState([]);
  const token = localStorage.getItem('access_token');
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState('');
  const [active, setActive] =  useState({});
  const [showCreateColonyForm, setShowCreateColonyForm] = useState(false);
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
        createSectors(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoaded(true));
    }

  }, [loaded]);

  function createSectors(data: any[]) {
    const sectors: any[] = [];
    data.forEach((colony) => {
      const newSector = {
        location: colony['location'],
        radius: colony['radius'],
        name: colony['name'],
      }
      sectors.push(newSector);
    })
    console.log(sectors);
    setSectors(sectors);
    setSectorsLoaded(true);
  }

  if(!loaded) return ( <LoadingSpinner /> )

  if(mode === 'mini') {
    return (
    <div className={`colonies-container-mini`}>
      this is a mini container
    </div>
    )
  }

  return (
    <div className={`colonies-container-full`}>
      <div className='colonies-search-and-list'>
        <h1>Colonies</h1>
        <div className='search-and-create'>
          <input type='search' onChange={(e) => setFilter(e.target.value.toLowerCase())}/>
          {<input type='submit' value='Create new' onClick={() => setShowCreateColonyForm(true)}></input>}
        </div>
        {colonies.length === 0 ?
        <p className='no-users'>No colonies have been created yet</p>
        : 
        <ul className='colonies-list'>
          {colonies.map((colony, index) => {
            let name = '';
            if(filter === '') {
              return (
                <div key={`${colony['_id']}${index}`} className='individual-colony' onClick={(() => setActive(colony['_id']))}>
                  <p>Colonies named "{colony['name']}"</p>
                  <p>Population: {colony['size']}</p>
                </div>
              )
            }
            else {
              name = colony['name'];
              if(name.toLowerCase().includes(filter)) {
              return (
                <div key={`${colony['_id']}${index}`} className='individual-colony' onClick={(() => setActive(colony['_id']))}>
                  <p>Colonies named "{colony['name']}"</p>
                  <p>Population: {colony['size']}</p>
                </div>
              )
            }
          }
          })}
        </ul>
        }
      </div>
    </div>
  )
}
import { useState } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinnner';

export default function Map() {
  const [colonies, setColonies] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

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
    setSectors(sectors as never);
  }

  if (!loaded) {
    return <LoadingSpinner />
  }
  return (
      <div className='map-container'>
        <MapContainer center={[52.3849104, 16.8910757]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
            {sectors.map((sector, index) => {
              return (
                <Circle key={index + (Math.random() * 10)} center={sector['location']} radius={sector['radius']} >
                  <Popup>Colony {sector['name']}</Popup>
                </Circle>
              )
            })}
        </MapContainer>
      </div>
  )
}
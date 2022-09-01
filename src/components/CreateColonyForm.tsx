import React, { SyntheticEvent, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinnner";
import CloseIcon from '../images/icons/close_FILL0_wght400_GRAD0_opsz48.png';
import { Circle, MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useAppSelector } from "../app/hooks";

function TargetLocation({ setLocation }: any) {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setLocation([lat, lng]);
    }
  })
  return null;
}

export default function CreateColonyForm(props: any) {
  const { 
    showCreateColonyForm,
    setShowCreateColonyForm,
    setParentLoaded } = props;
  
  const [name, setName] = useState('');
  const [size, setSize] = useState(0);
  const [caretakers, setCaretaker] = useState([] as string[]);
  const [location, setLocation] = useState([0, 0]);
  const [radius, setRadius] = useState(0);

  const [users, setUsers] = useState([]);

  const { token } = useAppSelector((state) => state.user);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(!loaded && showCreateColonyForm) {
      //fetch users for the thing
      fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        return res.json();
      })
      .then((json) => setUsers(json))
      .catch((err) => console.log(err))
      .finally(() => setLoaded(true));
    }
  }, [showCreateColonyForm])

  function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if(location[0] == 0 || location[1] == 1) {
      throw new Error('Wrong location');
    }
    sendForm();
    setParentLoaded(false);
  }

  function sendForm() {
    const body = {
      name,
      size,
      caretakers,
      location,
      radius,
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/colonies`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    .then((res) => {
      return res.json();
    })
    .then(() => {
      setShowCreateColonyForm(false);
      setParentLoaded(false);
    })
    .catch((err) => console.log(err));
  }
  
  function handleCheck(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      const newCaretakers: string[] = caretakers;
      const value: string = e.target.value;
      newCaretakers.push(value);
      setCaretaker(newCaretakers);
    } else {
      const newCaretakers: string[] = caretakers;
      const value: string = e.target.value;
      const index = newCaretakers.findIndex((id) => id === value);
      newCaretakers.splice(index, 1);
      setCaretaker(newCaretakers);
    }
  }

  if(!showCreateColonyForm) return null;
  if(!loaded && showCreateColonyForm) {
    return ReactDOM.createPortal(
      <LoadingSpinner />
      ,
      document.getElementById('portal')!,
    )
  };
  return ReactDOM.createPortal(
    <div className='task-form-container'>
      <form className='task-form' onSubmit={(e) => onSubmit(e)}>
        <div className='controls'>
          <h2>Create new colony</h2>
          <button className='close-form-btn' onClick={() => setShowCreateColonyForm(false)}>
            <img src={CloseIcon} alt='Close icon' />
          </button>
        </div>
        <label htmlFor='name'>
          Name
          <input id='name' required={true} type='text' onChange={(e) => setName(e.target.value)}/>
        </label>
        <div className='controls'>
          <label htmlFor='size'>
            Size
            <input id='size' required={true} type='number' onChange={(e) => { setSize(+e.target.value) }}/>
          </label>
          <fieldset>
            <legend>Assign caretakers</legend>
              {users.length > 0 ? users.map((user, index) => {
              return (
                <div className='checkmark-container' key={`${user['_id']}${index}`}>
                  <input id={user['_id']} type='checkbox' value={user['_id']} onChange={(e) => handleCheck(e)}/>
                  <label className='checkmark-label' htmlFor={user['_id']}>{user['firstName']} {user['lastName']}</label>
                </div>
              )
            }) : <p className='no-users'>No users in your organization</p>}
          </fieldset>
        </div>
        <div className='map-selector'>
          <h5>Click on the map to select the location</h5>
          <MapContainer center={[52.38592040300254, 16.909362808464977]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle center={[location[0], location[1]]} radius={radius}/>
            <TargetLocation setLocation={setLocation}/>
          </MapContainer>
        </div>
        <label className='label-radius' htmlFor='radius'>
          <input id='radius' type='range' min='50' max='300' onChange={(e) => setRadius(+e.target.value)} />
        </label>
        <input type='submit' value='Submit' />
      </form>
    </div>
    ,
    document.getElementById('portal')!,
  )
}


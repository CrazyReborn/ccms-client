import React, { SyntheticEvent, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import LoadingSpinner from './LoadingSpinnner';
import CloseIcon from '../images/icons/close_FILL0_wght400_GRAD0_opsz48.png';
import '../styles/TaskCreateForm.css';
import { MapContainer, Marker, Popup, TileLayer, useMapEvent, useMapEvents } from 'react-leaflet';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

function TargetLocation(props: any) {
  const { location, setLocation } = props;
  const map = useMapEvents({
    load: () => {
     console.log(map.locate())
    },
    click: (e) => {
      const { lat, lng } = e.latlng;
      setLocation([lat, lng]);
      console.log(location)
    },
  })

  return null;
}

export const TaskCreateForm = (props: any) => {
  const [assignedTo, setAssignedTo] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [location, setLocation] = useState([0, 0]);
  const token = localStorage.getItem('access_token');
  const { showCreateTaskForm, setShowCreateTaskForm } = props;
  const setParentLoaded = props.setLoaded;
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(!loaded && showCreateTaskForm) {
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
  }, [showCreateTaskForm])

  function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if(location[0] == 0 || location[1] == 1) {
      throw new Error('wrong location');
    }
    sendForm();
  }

  function sendForm() {
    const body = {
      assignedTo: assignedTo === '' ? null : assignedTo,
      date,
      description,
      name,
      location,
    }
    fetch(`${process.env.REACT_APP_SERVER_URL}/tasks`, {
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
      setShowCreateTaskForm(false);
      setParentLoaded(false);
    })
    .catch((err) => console.log(err));
  }

  if(!showCreateTaskForm) return null;
  if(!loaded && showCreateTaskForm) {
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
          <h2>Create new task</h2>
          <button className='close-form-btn' onClick={() => setShowCreateTaskForm(false)}>
            <img src={CloseIcon} alt='Close icon' />
          </button>
        </div>
        <label htmlFor='name'>
          Name
          <input required={true} type='text' onChange={(e) => setName(e.target.value)}/>
        </label>
        <div className='controls'>
          <label htmlFor='date'>
            Date
            <input required={true} type='date' onChange={(e) => { setDate(e.target.value) }}/>
          </label>
          <label htmlFor='users'>
            Assign to
            <select id='users' onChange={(e) => setAssignedTo(e.target.value)}>
              <option value={''}>Nobody</option>
              {users.map((user) => {
                return (
                  <option key={user['_id']} value={user['_id']}>{user['firstName']} {user['lastName']}</option>
                )
              })}
            </select>
          </label>
        </div>
        <label htmlFor='name'>
          Description
          <textarea required={true} value={description} rows={5} onChange={(e) => setDescription(e.target.value)}/>
        </label>
        <div className='map-selector'>
          <h5>Click on the map to select the location</h5>
          <MapContainer center={[52.38592040300254, 16.909362808464977]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location[0], location[1]]}>
            </Marker>
            <TargetLocation location={location} setLocation={setLocation}/>
          </MapContainer>
        </div>
        <input type='submit' value='Submit' />
      </form>
    </div>
    ,
    document.getElementById('portal')!,
  )
}


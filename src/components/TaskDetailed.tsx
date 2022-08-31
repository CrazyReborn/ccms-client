import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet';
import '../styles/TaskDetailed.css';

function UpdateMap({ location }: any) {
  const coords = {
    lat: location[0],
    lng: location[1],
  };
  const map = useMapEvent('click', () => {
    console.log('update?');
    map.flyTo(coords, 13)
  })
  return null;
}

export default function TaskDetailed({
  task,
  setShowAssignTask,
  token,
  setParentLoaded,
  setActiveTask,
}: any) {
  useEffect(() => {
    document.getElementById('map123map')?.click();
  }, [task]);

  if (task['name'] === undefined) {
    return (
      <div className='task-detailed'>
        <p>Select a task to show details</p>
      </div>
    )
  }

  function deleteTask(id: string) {
    fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      if(res.status === 200) {
        setActiveTask({});
        setParentLoaded(false);
      }
    })
  }
  return (
    <div className='task-detailed'>
      <h1>{task['name']}</h1>
      <p>{format(parseISO(task['date']), 'MMMM do, u')}</p>
      <section className='task-description'>
        <p>{task['description']}</p>
      </section>
      <div className='breakline'></div>
      <p className='assigned-to'>
        The task is assigned to 
        {task['assignedTo'] ?` ${task['assignedTo']['firstName']}` : ' nobody'}
      </p>
      {/* The assign task to a person button should be implemented here*/}
      {!task['assignedTo'] &&
        <button className='assign-btn' onClick={(e) => setShowAssignTask(true)}>Assign the task</button>
      }
      <div className='map-selector'>
        <MapContainer id='map123map' center={[task['location'][0], task['location'][1]]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[task['location'][0], task['location'][1]]} >
              <Popup>
                Task location
              </Popup>
            </Marker>
            <UpdateMap location={[task['location'][0], task['location'][1]]} />
        </MapContainer>
      </div>
      <button className='delete-btn' onClick={() => deleteTask(task['_id'])}>Delete</button>
    </div>
  )
} 
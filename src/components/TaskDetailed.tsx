import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import '../styles/TaskDetailed.css';

export default function TaskDetailed({ task, setShowAssignTask }: any) {
  useEffect(() => {
  }, [task])
  if (task['name'] === undefined) {
    return (
      <div className='task-detailed'>
        <p>Select a task to show details</p>
      </div>
    )
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
        <MapContainer center={[52.38592040300254, 16.909362808464977]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[task['location'][0], task['location'][1]]} >
              <Popup>
                Task location
              </Popup>
            </Marker>
        </MapContainer>
      </div>
    </div>
  )
} 
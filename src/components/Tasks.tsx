import { format } from 'date-fns';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinnner';
import '../styles/Tasks.css';
import TaskDetailed from './TaskDetailed';

export default function Tasks () {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('access_token');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [activeTask, setActiveTask] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if(!token) {
      navigate('../login');
    }
    fetch(`${process.env.REACT_APP_SERVER_URL}/tasks`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      if (res.status == 401) {
        navigate('../login');
      }
      if (res.status == 403) {
        throw new Error('You are not allowed to access this data')
      }
      return res.json();
    })
    .then((json) => setTasks(json))
    .catch((err) => setError(err))
    .finally(() => setLoaded(true));
  }, [loaded, activeTask])

  function changeFilter(e: React.FormEvent<HTMLInputElement>) {
    setFilter(e.currentTarget.value.toLowerCase());
  }

  function setActive(key: string) {
    const task = tasks.filter((t) => t['_id'] === key);
    setActiveTask(task[0]);
  }

  if(!loaded) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <div className='tasks-main'>
      {/* This is code for the future "Task-Containter". */}
      <div className='tasks-container'>
        <h1>Tasks</h1>
        <div className='search-and-create'>
          <input type='search' onChange={(e) => changeFilter(e)}/>
          <input type='submit' value='Create new'></input>
        </div>
        {tasks === [] ?
        <p>No tasks have been created yet</p>
        : 
        <ul className='task-list'>
          {tasks.map((task) => {
            let name = '';
            if(filter === '') {
              return (
                <div key={task['_id']} className='individual-task' onClick={(() => setActive(task['_id']))}>
                  <p>{format(task['date'], 'MMMM do, u')}</p>
                  <p>{task['name']}</p>
                </div>
              )
            }
            else {
              
              name = task['name'];
              if(name.toLowerCase().includes(filter)) {
              return (
                <div key={task['_id']} className='individual-task' onClick={(() => setActive(task['_id']))}>
                  <p>{format(task['date'], 'MMMM do, u')}</p>
                  <p>{task['name']}</p>
                </div>
              )
            }
          }
          })}
        </ul>
        }
      </div>
      <TaskDetailed task={activeTask} />
    </div>
  )
}
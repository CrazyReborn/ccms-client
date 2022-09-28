import { format, parseISO } from 'date-fns';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinnner';
import '../styles/Tasks.css';
import TaskDetailed from './TaskDetailed';
import { TaskCreateForm } from './TaskCreateForm';
import AssignTask from './AssignTask';
import { useAppSelector } from '../app/hooks';
import { CreateReportForm } from './CreateReportForm';

export default function Tasks () {
  const [tasks, setTasks] = useState([]);
  const { token, role } = useAppSelector((state) => state.user);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [activeTask, setActiveTask] = useState({});
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [showCreateReportForm, setShowCreateReportForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(!token) {
      navigate('../login');
    }
    if(!loaded) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/tasks`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 401) {
          navigate('../login');
        }
        if (res.status === 403) {
          throw new Error('You are not allowed to access this data');
        }
        return res.json();
      })
      .then((json) => json.sort((a: any, b: any) => {
        const aDate = Date.parse(a['date']);
        const bDate = Date.parse(b['date']);
        return +bDate - +aDate;
      }))
      .then((tasks) => setTasks(tasks))
      .catch((err) => setError(err))
      .finally(() => setLoaded(true));
    }

  }, [
    loaded,
    activeTask,
    showAssignTask,
  ])

  useEffect(() => {
    if(role === 'OrganizationLeader')
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
    .then((json) => {
      setUsers(json);
    })
    .catch((err) => console.log(err))
    .finally(() => setLoaded(true));
  });

  function changeFilter(e: React.FormEvent<HTMLInputElement>) {
    setFilter(e.currentTarget.value.toLowerCase());
  }

  function setActive(key: string) {
    setActiveTask({});
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
          {role === 'OrganizationLeader' && <input type='submit' value='Create new' onClick={() => setShowCreateTaskForm(true)}></input>}
        </div>
        {tasks.length === 0 ?
        <p>No tasks have been created yet</p>
        : 
        <ul className='task-list'>
          {tasks.map((task, index) => {
            let name = '';
            if(filter === '') {
              return (
                <div key={`${task['_id']}${index}`} className='individual-task' onClick={(() => setActive(task['_id']))}>
                  <p>{format(parseISO(task['date']), 'MMMM do, u')}</p>
                  <p>{task['name']}</p>
                </div>
              )
            }
            else {
              name = task['name'];
              if(name.toLowerCase().includes(filter)) {
              return (
                <div key={`${task['_id']}${index}`} className='individual-task' onClick={(() => setActive(task['_id']))}>
                  <p>{format(parseISO(task['date']), 'MMMM do, u')}</p>
                  <p>{task['name']}</p>
                </div>
              )
            }
          }
          })}
        </ul>
        }
      </div>
      <TaskDetailed 
      task={activeTask}
      setShowAssignTask={setShowAssignTask}
      token={token}
      setParentLoaded={setLoaded}
      setActiveTask={setActiveTask}
      setShowCreateReportForm={setShowCreateReportForm}
      />
      <TaskCreateForm
      setLoaded={setLoaded}
      showCreateTaskForm={showCreateTaskForm}
      setShowCreateTaskForm={setShowCreateTaskForm}
      users={users}
      setUsers={setUsers}
      />
      <AssignTask
      task={activeTask}
      showAssignTask={showAssignTask}
      setShowAssignTask={setShowAssignTask}
      users={users}
      setUsers={setUsers}
      setParentLoaded={setLoaded}
      setActiveTask={setActiveTask}
      />
      <CreateReportForm 
      showCreateReportForm={showCreateReportForm}
      setShowCreateReportForm={setShowCreateReportForm}
      task={activeTask}
      token={token}
      setActiveTask={setActiveTask}
      />
    </div>
  )
}
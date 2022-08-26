import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinnner";
import '../styles/UsersMini.css';

export default function UsersMini() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
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
    .catch((err) => console.log(err));
    
    fetch(`${process.env.REACT_APP_SERVER_URL}/tasks`, {
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
      setTasks(json);
    })
    .catch((err) => console.log(err))
    .finally(() => setLoaded(true));
  }, [loaded]);

  function userTasksForToday(user: any) {
    const foundTasks: any[] = tasks.filter((task: any) => {
      return task['assignedTo'] !== null && task['assignedTo']['_id'] === user['_id'] &&
      format(parseISO(task['date']), 'dd/mm/yy') === format(new Date(), 'dd/mm/yy');
    });
    return foundTasks.length;
  }

  if (!loaded) {
    return (
      <div className='users-mini-container'>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className='users-mini-container'>
      <h2>Members of your organization</h2>
      {users.map((user: any, index) => {
        const numberOfTasks = userTasksForToday(user);
        return (
          <div key={`${user['_id']}${index}`} className='user-mini'>
            <p>{user['firstName']} {user['lastName']}</p>
            <p>Tasks for today {numberOfTasks}</p>
          </div>
        )
      })}
    </div>
  )
}
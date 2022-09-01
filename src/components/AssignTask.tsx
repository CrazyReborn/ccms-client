import { SyntheticEvent, useEffect, useState } from "react"
import CloseIcon from '../images/icons/close_FILL0_wght400_GRAD0_opsz48.png';
import ReactDOM from "react-dom"
import { useAppSelector } from "../app/hooks";

export default function AssignTask({ 
  task,
  showAssignTask,
  setShowAssignTask,
  users,
  setParentLoaded,
  setActiveTask,
 }: any) {
  const [user, setUser] = useState('');
  const { token } = useAppSelector((state) => state.user);

  useEffect(() => {
  }, [users, showAssignTask, task]);


  function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    assignToANewUser();
    setShowAssignTask(false);
    setParentLoaded(false);
  }

  function assignToANewUser() {
    const body = {
      ...task,
      assignedTo: user,
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${task['_id']}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((task) => setActiveTask(task))
    .catch((err) => console.log(err));
  }

  if (!showAssignTask) {
    return null
  }

  return ReactDOM.createPortal(
    <div className='task-form-container'>
      <form className='task-form' onSubmit={(e) => onSubmit(e)}>
        <div className='controls'>
          <h2>Assign the task</h2>
          <button className='close-form-btn' onClick={() => setShowAssignTask(false)}>
            <img src={CloseIcon} alt='Close icon' />
          </button>
        </div>
        <div className='controls'>
          <label htmlFor='users'>
            Assign to
            <select id='users' onChange={(e) => setUser(e.target.value)}>
              <option value={''}>Nobody</option>
              {users.map((usr: any) => {
                return (
                  <option key={usr['_id']} value={usr['_id']}>{usr['firstName']} {usr['lastName']}</option>
                )
              })}
            </select>
          </label>
        </div>
        <input type='submit' value='Submit' />
      </form>
    </div>
    ,
    document.getElementById('portal')!,
  )
}
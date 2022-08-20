import { format } from "date-fns";
import { useEffect } from "react";
import '../styles/TaskDetailed.css';

export default function TaskDetailed({ task }: any) {
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
      <p>{format(task['date'], 'MMMM do, u')}</p>
      <section className='task-description'>
        <p>{task['description']}</p>
      </section>
      <div className='breakline'></div>
      <p className='assigned-to'>
        The task is assigned to 
        {task['assignedTo'] ? ` ${task['assignedTo']['firstName']}` : ' nobody'}
      </p>
      {/* The assign task to a person button should be implemented here*/}
    </div>
  )
} 
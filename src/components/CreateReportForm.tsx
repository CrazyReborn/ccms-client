import { SyntheticEvent, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import CloseIcon from '../images/icons/close_FILL0_wght400_GRAD0_opsz48.png';
import LoadingSpinner from './LoadingSpinnner';

export const CreateReportForm = ({ token, task, showCreateReportForm, setShowCreateReportForm, setActiveTask }: any) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const date = new Date();

  useEffect(() => {}, [showCreateReportForm])


  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    const reportBody = {
      text,
      date,
      task: task._id,
    };
    const taskUpdateBody = {
      done: true,
    }
    const reportResult = await fetch(`${process.env.REACT_APP_SERVER_URL}/reports`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reportBody),
    });
    if (reportResult.status === 201) {
      const updateResult = await fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${task._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskUpdateBody),
      });
      if (updateResult.status === 200) {
        setShowCreateReportForm(false);
        setActiveTask({});
      }
    }
  }

  if(!showCreateReportForm) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className='report-form-container'>
      <div className='controls'>
        <h2>Create report</h2>
        <button className='close-form-btn' onClick={() => setShowCreateReportForm(false)}>
            <img src={CloseIcon} alt='Close icon' />
        </button>
        {loading ? 
        <LoadingSpinner />
        :
        <form className='report-form' onSubmit={(e) => onSubmit(e)}>
          <label htmlFor='text'>
            <textarea onChange={(e) => setText(e.target.value)} value={text}></textarea>
          </label>
          <button type='submit'>Create</button>
        </form>}
      </div>
    </div>,
    document.getElementById('portal')!,
  )
}
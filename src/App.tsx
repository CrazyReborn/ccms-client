import React, { useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinnner';

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      navigate('./login')
    }
    else {
      navigate('./main')
    }
  });

  return (
    <LoadingSpinner />
  )
}

export default App;

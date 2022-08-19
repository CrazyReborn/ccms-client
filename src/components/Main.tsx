import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";
import LoadingSpinner from "./LoadingSpinnner";

export function Main() {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  if(!token && typeof token == 'undefined') {
    navigate('../login');
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/protected`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((res) => res.json())
    .then((json) => setData(json.id))
    .then(() => setLoaded(true))
    .catch((err) => console.log(err))
  }, [data]);

  if (loaded) {
    return (
      <div>{data}</div>
    )
  }
  else {
    return (
      <LoadingSpinner />
    )
  }
}
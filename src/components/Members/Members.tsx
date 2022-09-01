import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import LoadingSpinner from "../LoadingSpinnner";
import MembersSearchList from "./MembersSearchList";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeMember, setActiveMember] = useState({});
  const { token } = useAppSelector((state) => state.user);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    .then((res) => {
      if(res.status === 403) {
        throw new Error('You do not have permission to access requested data');
      }
      if(res.status === 200) {
        return res.json();
      }
    })
    .then((data) => setMembers(data))
    .catch((err) => console.log(err))
    .finally(() => setLoaded(true));
  });

  if(!loaded) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <div className='members-full'>
      <MembersSearchList members={members} setActive={setActiveMember}/>
    </div>
  )

}
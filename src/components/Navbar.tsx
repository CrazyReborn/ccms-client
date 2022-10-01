import { format } from "date-fns";
import { Link, NavLink } from "react-router-dom";
import MainIcon from '../images/icons/home_FILL0_wght400_GRAD0_opsz48.png';
import ReportsIcon from '../images/icons/task_FILL0_wght400_GRAD0_opsz48.png';
import MembersIcon from '../images/icons/person_FILL0_wght400_GRAD0_opsz48.png';
import TasksIcon from '../images/icons/description_FILL0_wght400_GRAD0_opsz48.png';
import MapIcon from '../images/icons/pin_drop_FILL0_wght400_GRAD0_opsz48.png';
import LogoutIcon from '../images/icons/logout_FILL0_wght400_GRAD0_opsz48.png';
import '../styles/Navbar.css';
import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";

export default function Navbar(props: any) {
  const { token, firstName, role } = useAppSelector((state) => state.user);
  const orgId = useAppSelector((state) => state.user.organization);
  const [org, setOrg] = useState({
    _id: '',
    name: '',
    owner: '',
    members: [],
  });
  const date = Date.now();

  useEffect(() => {
    fetchOrgInfo(orgId!);
  }, [org])

  function fetchOrgInfo(orgId: string) {
    fetch(`${process.env.REACT_APP_SERVER_URL}/organizations/${orgId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      if(res.status === 200) {
        return res.json();
      }
    })
    .then((data) => setOrg(data))
    .catch((err) => console.log(err));
  }
  return (
    <nav className='navbar'>
      <div className='upper-container'>
        <h1>
          Greetings, <br/>{firstName}.
        </h1>
        <p>{role} for <br/>{org['name'] === '' ? 'unknown': org['name'] }</p>
        <p>{format(date, 'MMMM do, u')}<br/> {format(date, 'EEEE')}</p>
      </div>
      <div className='breakline'></div>
      <ul className='nav-links'>
        <li>
          <img src={MainIcon} alt='Home icon' />
          <NavLink to='/'>Main</NavLink>
        </li>
        <li>
        <img src={TasksIcon} alt='Tasks icon' />
          <NavLink to='./tasks'>{ role === 'Caretaker' ? 'Your tasks' : 'Tasks' }</NavLink>
        </li>
        { role === 'OrganizationLeader' &&
        <li>
           <img src={ReportsIcon} alt='Reports icon' />
           <NavLink to='./reports'>Reports</NavLink>
         </li>
        }
        {/* {role === 'OrganizationLeader' &&
        <li>
          <img src={MembersIcon} alt='Members icon' />
          <NavLink to='./members'>Members</NavLink>
        </li>} */}
        <li>
          <img src={MapIcon} alt='Map icon' />
          <NavLink to='./map'>Map</NavLink>
        </li>
      </ul>
      <div className='logout-link-container'>
        <img src={LogoutIcon} alt='Logout icon' />
        <Link className='logout-link' to='../logout'>Logout</Link>
        </div>
    </nav>
  )
}
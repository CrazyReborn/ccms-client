import { format } from "date-fns";
import { Link } from "react-router-dom";
import MainIcon from '../images/icons/home_FILL0_wght400_GRAD0_opsz48.png';
import TasksIcon from '../images/icons/task_FILL0_wght400_GRAD0_opsz48.png';
import MembersIcon from '../images/icons/person_FILL0_wght400_GRAD0_opsz48.png';
import MapIcon from '../images/icons/pin_drop_FILL0_wght400_GRAD0_opsz48.png';
import LogoutIcon from '../images/icons/logout_FILL0_wght400_GRAD0_opsz48.png';
import '../styles/Navbar.css';

export default function Navbar(props: any) {
  const { user, organization } = props;
  const { firstName, role } = user;
  const { name } = organization;
  const date = Date.now();
  return (
    <nav className='navbar'>
      <div className='upper-container'>
        <h1>
          Greetings, <br/>{firstName}.
        </h1>
        <p>{role} for <br/>{name}</p>
        <p>{format(date, 'MMMM do, u')}<br/> {format(date, 'EEEE')}</p>
      </div>
      <div className='breakline'></div>
      <ul className='nav-links'>
        <li>
          <img src={MainIcon} alt='Home icon' />
          <Link to='../main'>Main</Link>
        </li>
        <li>
        <img src={TasksIcon} alt='Tasks icon' />
          <Link to='../tasks'>Tasks</Link>
        </li>
        {role === 'OrganizationLeader' &&
        <li>
          <img src={MembersIcon} alt='Members icon' />
          <Link to='../members'>Memebrs</Link>
          </li>}
        <li>
          <img src={MapIcon} alt='Map icon' />
          <Link to='../map'>Map</Link>
        </li>
      </ul>
      <div className='logout-link-container'>
        <img src={LogoutIcon} alt='Logout icon' />
        <Link className='logout-link' to='../logout'>Logout</Link>
        </div>
    </nav>
  )
}
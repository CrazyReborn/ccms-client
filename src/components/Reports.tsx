import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import LoadingSpinner from "./LoadingSpinnner";
import ReportDetailed from "./ReportDetailed";
import '../styles/Reports.css';

export default function Reports() {
  const { token } = useAppSelector((state) => state.user);
  const [reports, setReports] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeReport, setActiveReport] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/reports`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      if(res.status === 401) {
        navigate('../login')
      }
      return res.json();
    })
    .then((data) => {
      setReports(data)
    })
    .finally(() => setLoaded(true))
  }, [loaded]);

  function selectReport(report: any) {
    setActiveReport(report);
  }

  if(!loaded) {
    return <LoadingSpinner />
  }
  return (
    <div className='reports-container'>
      <div className='reports'>
      <h1>Reports</h1>
      {
      reports.length === 0 ?
      <p>No reports have benn created yet</p>
      :
      <div className='reports-list'>
        <ul>
        {reports.map((report: any) => {
          return (
            <li className='individual-report' onClick={() => setActiveReport(report)}>
              <p>{report.task.name}</p>
              <p>{format(parseISO(report.date), 'MMMM do, u')}</p>
            </li>
          )
        })}
          </ul>
        </div>
        }
      </div>
      <ReportDetailed report={activeReport} />
    </div>
  )
}
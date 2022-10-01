import { format, parseISO } from "date-fns";
import { useEffect } from "react";

export default function ReportDetailed({ report }: any) {

  useEffect(() => {}, [report])
  if(report.task === undefined) {
    return (
      <div className='report-detailed'>
        <p>Click on a report to show details</p>
      </div>
    )
  }
  return (
    <div className='report-detailed'>
      <h2>Report for: {report.task.name}</h2>
      <p>Report created on <b>{format(parseISO(report.date), 'MMMM do, u')}</b> by <b>{report.filledBy.firstName} {report.filledBy.lastName}</b></p>
      <p>{report.text}</p>
    </div>
  )
}
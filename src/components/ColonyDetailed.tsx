import { useEffect } from "react"

export default function ColonyDetailed({ colony }: any) {
  useEffect(() => {
  }, [colony])
  if (colony['name'] === undefined) {
    return (
      <div className='colony-detailed'>
        <p>Select a task to show details</p>
      </div>
    )
  }
  return (
    <div className='colony-detailed'>
      <h1>Colony "{colony['name']}"</h1>
      <p>Population: {colony['size']}</p>

      <div className='breakline'></div>
      <section className='task-description'>
        <h3>Caretakers: </h3>
        <ul>
          {colony['caretakers'].map((caretaker: any) => {
            return <li key={caretaker['_id']}>{caretaker['firstName']} {caretaker['lastName']}</li>
          })}
        </ul>
      </section>
    </div>
  )
} 
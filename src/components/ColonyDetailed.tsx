import { useEffect } from "react"

export default function ColonyDetailed({ colony, setActiveCat }: any) {
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
        {colony['registeredCats'].length === 0 ?
          <p>No cats from this colony were registered</p>
          :
          <div>
            <h3>Registered cats</h3>
            <ul>
            {
            colony['registeredCats'].map((cat: any, index: any) => {
              return (
                <li key={`${cat['_id']}${index}`}>
                  <div className='individual-cat' onClick={() => setActiveCat(cat)}>
                    <p>{cat['name']}</p>
                  </div>
                </li>
              )
            })
            }
            </ul>
          </div>
        }
      </section>
    </div>
  )
} 
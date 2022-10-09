import { useEffect, useState } from "react"
import { useAppSelector } from "../app/hooks";
import CreateCatForm from "./CatsComponent/CreateCatForm"

export default function ColonyDetailed({
  colony,
  setActive,
  setActiveCat,
  updateColony,
  setUpdateColony
}: any) {
  const [showCreateCatForm, setShowCreateCatForm] = useState(false);
  const { token } = useAppSelector((state) => state.user);
  useEffect(() => {
  }, [colony])
  useEffect(() => {
    console.log('updating detailed vbiew'); 
    fetch(`${process.env.REACT_APP_SERVER_URL}/colonies/${colony._id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then((res) => {
      if(res.status === 200) {
        return res.json()
      }
      throw new Error('There was an error'.concat(res.status.toString()));
    })
    .then((data) => {
      setActive(data);
    })
    .catch((err) => console.log(err));
  }, [updateColony])
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
          <p>No cats from this colony have been registered</p>
          :
          <div>
            <h3>Registered cats:</h3>
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
      <CreateCatForm
      showCreateCatForm={showCreateCatForm}
      setShowCreateCatForm={setShowCreateCatForm}
      updateColony={updateColony}
      setUpdateColony={setUpdateColony}
      colonyId={colony._id}
      registeredCats={colony.registeredCats}
      />
      <button onClick={() => setShowCreateCatForm(true)}>Add a cat</button>
    </div>
  )
} 
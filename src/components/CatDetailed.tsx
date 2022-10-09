import { useAppSelector } from "../app/hooks"

export default function CatDetailed({
  cat,
  setActiveCat,
  updateColony,
  colony,
  setUpdateColony
}: any) {
  const { token } = useAppSelector((state) => state.user);
  async function deleteCat(id: string) {
    const result = await fetch(`${process.env.REACT_APP_SERVER_URL}/cats/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    if (result.status === 200) {
      const oldCats = colony.registeredCats;
      const index = oldCats.findIndex((catId: string) => catId === id);
      oldCats.splice(index, 1);
      const body = {
        registeredCats: oldCats,
      }
      const cleaningResult = await fetch(`${process.env.REACT_APP_SERVER_URL}/colonies/${colony._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      if (cleaningResult.status === 200) {
        setActiveCat({});
        setUpdateColony(!updateColony);
      }
    }
      
  }

  if(cat['name'] === undefined) {
    return (
      <div className='cat-detailed'>
        <p>No cat is selected.</p>
      </div>
    )
  }
  return (
    <div className='cat-detailed'>
      <h1>{cat['name']}</h1>
      <p>{cat['name']} is a {cat['age']} month old {cat['class'].toLowerCase()} {cat['sex'].toLowerCase()} cat.</p>
      <p>{cat['descendants'].length === 0 ? 'This cat does not have any registered descendants.'
      : `This cat has ${cat['descendants'].length} descendants`}</p>
      {cat['features'].length === 0 ?
      <p>This cat has no disctinct features</p> :
      <p>This cat has several disctinct features: {cat['features'].map((feature: any) => `${feature}`)}</p>
      }
      <p>The cat is {cat['vaccinated']? '' : 'not'} vaccinated, {cat['sterilized']? '' : 'not'} sterilized.</p>
      <button className='sml-dlt' onClick={() => deleteCat(cat._id)}>Delete</button>
    </div>
  )
}
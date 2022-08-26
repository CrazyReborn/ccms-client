export default function CatDetailed({ cat }: any) {
  if(cat['name'] === undefined) {
    return (
      <div className='cat-detailed'>
        <p>No cat is selected.</p>
      </div>
    )
  }
  console.log(cat);
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
    </div>
  )
}
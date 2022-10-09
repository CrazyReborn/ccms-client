import { ChangeEvent, SyntheticEvent, useState } from "react";
import ReactDOM from "react-dom";
import { useAppSelector } from "../../app/hooks";
import CloseIcon from '../../images/icons/close_FILL0_wght400_GRAD0_opsz48.png';
import '../../styles/CreateCatForm.css';

export default function CreateCatForm({
  registeredCats,
  colonyId,
  showCreateCatForm,
  setShowCreateCatForm,
  updateColony,
  setUpdateColony
}: any) {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [sex, setSex] = useState('');
  const [sterilized, setSterilized] = useState(false);
  const [vaccinated, setVaccinated] = useState(false);
  const [catClass, setCatClass] = useState('');
  const { token } = useAppSelector((state) => state.user);
  //a user should be able to add features;
  const [features, setFeatures] = useState([] as string[]);
  //a user might be able to select parents and descendants(children) in the future
  const parents: any[] = [];
  const descendants: any[] = [];

  function handleChangeFeatures(string: string) {
    const completeString = string;
    const separated = string
    .trim()
    .split(/[,.]/)
    const trimed: string[] = separated.map((str) => str.trim().toLowerCase());
    const copy = features;
    const newResult = copy.concat(trimed);
    setFeatures(newResult);
  }

  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    const body = {
      name,
      age,
      sex,
      sterilized,
      vaccinated,
      class: catClass,
      parents,
      descendants,
      features,
      colony: colonyId,
    }

    const catPostResult = await fetch(`${process.env.REACT_APP_SERVER_URL}/cats`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const newCat = await catPostResult.json();
    if (catPostResult.status === 201) {
      const newRegisteredCats = registeredCats.slice();
      newRegisteredCats.push(newCat._id);
      const colonyBody = {
        registeredCats: newRegisteredCats,
      }
      const colonyUpdateResult = await fetch(`${process.env.REACT_APP_SERVER_URL}/colonies/${colonyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(colonyBody),
      })
      if (colonyUpdateResult.status === 200) {
        await setUpdateColony(!updateColony);
        setShowCreateCatForm(false);
      }
    }
  }

  if(!showCreateCatForm) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className='create-cat-form-container'>
      <form className='create-cat-form' onSubmit={(e) => onSubmit(e)}>
        <div className='controls'>
          <h2>Register a new cat</h2>
          <button className='close-form-btn' onClick={() => setShowCreateCatForm(false)}>
            <img src={CloseIcon} alt='Close icon' />
          </button>
        </div>
        <label htmlFor='name'>
          Name of the cat:
          <input type='text' id='name' name='name' onChange={(e) => setName(e.target.value)} required/>
        </label>
        <label htmlFor='age'>
          Age of the cat (months):
          <input type='number' id='age' name='age' onChange={(e) => setAge(Number(e.target.value))} required/>
        </label>
        <label htmlFor='sex-select'>
          Cat's sex:
          <select name='sex' id='sex-select' onChange={(e) => setSex(e.target.value)} required>
            <option value=''>--Please choose an option</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </select>
        </label>
        <label className='label-checkbox' htmlFor='sterilized'>
          Sterilized
          <input type='checkbox' id='sterilized' name='sterilized' onChange={(e) => setSterilized(e.target.checked)}/>
        </label>
        <label className='label-checkbox' htmlFor='vaccinated'>
          Vaccinated
          <input type='checkbox' id='vaccinated' name='vaccinated' onChange={(e) => setVaccinated(e.target.checked)}/>
        </label>
        <label htmlFor='class-select'>
          Feral or stray:
          <select name='class' id='class-select' onChange={(e) => setCatClass(e.target.value)} required>
            <option value=''>--Please choose an option</option>
            <option value='Feral'>Feral</option>
            <option value='Stray'>Stray</option>
          </select>
        </label>
        <label htmlFor='features'>
          Features(use comma to separate):
          <textarea rows={5} id='features' name='features' onChange={(e) => handleChangeFeatures(e.target.value)}/>
        </label>
        <input type='submit' value='Submit'/>
      </form>
    </div>,
    document.getElementById('portal')!,
  )
}
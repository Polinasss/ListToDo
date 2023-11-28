import { defaultData } from "./data/defaultData";
import { useState, useEffect } from "react";
import './styles/style.css'
import NoImageFound from './assets/No-image-found.jpg'

function App() {
  const [filterText, setFilterText] = useState("");
  const [userData, setUserData] = useState(defaultData);

  useEffect(() => { // получаем данные из localStorage
    const items = JSON.parse(localStorage.getItem('userData'));
    if (items) {
      setUserData(items);
    }
  }, []);

  const handleSubmit = (e) => { // добавляем новый элемент в список
    e.preventDefault();
    const file = e.target[3].value == '' ? NoImageFound  : URL.createObjectURL(e.target[3].files[0]); // создаем ссылку на изображение

    if (e.target[1].value == "" || e.target[2].value == "" || e.target[4].value == "") { // запрещаем заполнение пустых полей
      alert('Fill in all required fields of the form');
    } else {
      const listItem = { id: Math.random(), name: e.target[1].value, description: e.target[2].value, img: file, rating: e.target[4].value };
      setUserData(prev => [...prev, listItem]);
      localStorage.setItem('userData', JSON.stringify([...userData, listItem])); // сохраняем данные в базу
    }
  };

  const handleDelete = (element) => { // удаляем элемент из списока
    const withoutDeletedItem = userData.filter((item) => item.id !== element.id);
    setUserData(withoutDeletedItem);
    localStorage.setItem('userData', JSON.stringify(withoutDeletedItem)); // сохраняем данные в базу
  }

  useEffect(() => console.log(filterText), [filterText])


  return (
    <div className="App">
      <div className="container">

        <form className="form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Add new car in list</legend>
            <label>
              * Name:
              <input type="text" placeholder="Name" />
            </label>
            <label>
              * Description:
              <textarea placeholder="Description" />
            </label>
            <label>
              Image
              <input type='file' />
            </label>
            <label>
              * Rating:
              <input type="number" defaultValue={1} />
            </label>
            <button className="btn" type="submit">Add</button>
          </fieldset>
        </form>

        <div className='search'>
          <input type="text" placeholder="Search" autoCapitalize="none" onChange={(e) => setFilterText(e.target.value)} />
        </div>

        <div className="list">
          {userData
          .filter((el) => JSON.stringify(el.name).toLowerCase().includes(filterText.toLowerCase()))
          .map((item) => {
            return (
              <div className="list__item" key={item.id}>
                <img src={item.img} width={60} height={60} />
                <p>{item.name}</p>
                <p>{item.description}</p>
                <p>{item.rating}</p>
                <button className="deleteBtn" onClick={() => handleDelete(item)}>Delete</button>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  );
}

export default App;

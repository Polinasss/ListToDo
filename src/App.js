import { defaultData } from "./data/defaultData";  // импорт дефолтных данных
import { useState, useEffect } from "react"; // импорт хуков из библиотеки react
import './styles/style.css' // импорт css стилей
import NoImageFound from './assets/No-image-found.jpg' // импорт изображения. Вместо NoImageFound можем написать любое название, под которым будет импортироваться ссылка на изображение

function App() { // компонент - это функция, которая возвращает html
  // State (состояние) - объект, в котором хранятся данные, изменение которых приводит к пересозданию/перерисовке компонента
  const [filterText, setFilterText] = useState(""); // const [объект с данными изначально равный пустой строке, функция изменения объекта с данными] = функция инициализирующая, что данный массив хранит состояние, который изначально равен ""
  const [userData, setUserData] = useState(defaultData); // const [объект с данными изначально равный defaultData, функция изменения объекта с данными] = функция инициализирующая, что данный массив хранит состояние, который изначально равен defaultData
  const [sortData, setSortData] = useState('noSort'); // const [объект с данными изначально равный строке 'noSort', функция изменения объекта с данными] = функция инициализирующая, что данный массив хранит состояние, который изначально равен 'noSort'

  useEffect(() => { // Хук - функции из библиотеки react, начинающиеся со слова use.
    // useEffect - хук контоля состояния компонента. Он принимает два аргумента: стрелочную функцию и массив с переменными, при изменении значений которых будет срабатывать функция
    const items = JSON.parse(localStorage.getItem('userData')); // получаем данные из localStorage (веб-хранилище)
    // JSON.parse - из строки делает объект с необходимыми типами данных
    if (items) { // если какие-то данные в localStorage есть, то вызываем функцию
      setUserData(items); // ----> userData = items
    }
  }, []); // если массив пустой, то переданная функция сработает только один раз при первоначальном появлении на экране всего компонента App. Больше функция вызываться не будет 

  const handleSubmit = (event) => { // добавляем новый элемент в список
    event.preventDefault(); // метод позволяет отменить действие браузера по умолчанию. В нашем случае запрещаем форме, на которую повесили слушатель события onSubmit, переходить на другую страницу и отправлять данные
    const file = event.target[3].value == '' ? NoImageFound : URL.createObjectURL(event.target[3].files[0]); // создаем ссылку на изображение используя тернарный оператор. URL - объект с методом createObjectURL - создает ссылку из данных изображения
    const itemId = userData.length !== 0 ? userData[userData.length - 1].id + 1 : 0; // устанавливаем id для элемента списка. Если массив элементов списка пуст, то id = 0, иначе id равен на 1 больше предыдущего

    if (event.target[1].value == "" || event.target[2].value == "" || event.target[4].value == "") { // запрещаем заполнение пустых полей
      alert('Fill in all required fields of the form');
    } else {
      const listItem = { id: itemId, name: event.target[1].value, description: event.target[2].value, img: file, rating: event.target[4].value }; // создаем новую запись в виде объекта
      setUserData((prev) => [...prev, listItem]); // ----> userData = [предыдущие элементы списа, новый элемент в списке]
      //... - спрэд оператор - оператор, который распаковывает из массива данные. [{}, {}, {}] ----> {}, {}, {}
      // есть еще рэст оператор. Выглядит он точно так же ... ,но упаковывает в массив. Это если спросят )
      localStorage.setItem('userData', JSON.stringify([...userData, listItem])); // сохраняем данные в базу под именем 'userData' = список элементов
      // JSON.stringify - из объекта с разными типами данных в строку
    }
  };

  const handleDelete = (element) => { // удаляем элемент из списока
    const withoutDeletedItem = userData.filter((item) => item.id !== element.id); // фильтруем данный от удаленных нами
    setUserData(withoutDeletedItem); // ----> userData = withoutDeletedItem
    localStorage.setItem('userData', JSON.stringify(withoutDeletedItem)); // сохраняем данные в базу
  }

  useEffect(() => {
    setUserData((prev) => { // меняем данные userData = отсортированным данным
      if (sortData == 'ascending') {
        return prev.sort((a, b) => {return Number(a.rating) - Number(b.rating)});
      } else if (sortData == 'descending') {
        return prev.sort((a, b) => {return Number(b.rating) - Number(a.rating)});
      } else {
        return prev.sort((a, b) => {return Number(a.id) - Number(b.id)});
      }
    })
  }, [sortData]); // функция срабатывает тогда, когда изменяется переключатель/переменная sortData 



  // ИНФОРМАЦИЯ ПО html в return 

  // onChange={(e) => setFilterText(e.target.value)} 
  // событие onChange вызывается когда содержимое input изменяется. Для демонстрации можно вызвать внутри стрелочной функции console.log(e.target.value)
  // setFilterText(e.target.value) ----> filterText = e.target.value
  // e.target.value - текст внутри поля

  // toLowerCase() - приводит тектс к нижнему регистру
  // .map() - метод массива, который вызывает функцию для каждого этелемента маассива. В нашем случае на каждый элемент массива создается свой html 

  return (
    <div className="App">
      <div className="container">

        <form className="form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Add new item</legend>
            <label>
              * Name:
              <input type="text" placeholder="Name" maxLength={10} />
            </label>
            <label>
              * Description:
              <textarea placeholder="Description" maxLength={30} />
            </label>
            <label>
              Image
              <input type='file' />
            </label>
            <label>
              * Rating:
              <input type="number" defaultValue={1} max={10} min={0} />
            </label>
            <button className="btn" type="submit">Add</button>
          </fieldset>
        </form>

        <div className='search'>
          <input type="text" placeholder="Search" autoCapitalize="none" onChange={(e) => setFilterText(e.target.value)} /> 
          <div className="sortContainer">
            <input type="radio" value="noSort" name="sort" onChange={() => setSortData('noSort')} />
            <label htmlFor="noSort">No sort</label>
            <input type="radio" value="ascending" name="sort" onChange={() => setSortData('ascending')} />
            <label htmlFor="ascending">Ascending</label>
            <input type="radio" value="descending" name="sort" onChange={() => setSortData('descending')} />
            <label htmlFor="descending">Descending</label>
          </div>
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

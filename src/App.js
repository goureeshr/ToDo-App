import { useState, useEffect, useRef } from 'react';
import './App.css';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { IoCheckmarkDone } from "react-icons/io5";

function App() {


  function getCurrentDayAndDate() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const now = new Date();
    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    
    return `It's a ${day} Thing (${month} ${date}${getOrdinalSuffix(date)})!`;
  }

  const dayAndDateMessage = getCurrentDayAndDate();
  
  function getOrdinalSuffix(date) {
    if (date > 3 && date < 21) return 'th';
    switch (date % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }

  const [toDos, setToDos] = useState([])
  const [toDo, setToDo] = useState('')
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (toDo.trim() !== '') {
      if (editingId !== null){

          setToDos(toDos.map((item) => 
            item.id === editingId ? { ...item, list: toDo } : item
          ));
          setEditingId(null);
          setToDo('');
      }
      else {
        setToDos([...toDos, {list: toDo , id: Date.now() , status: false , timestamp: new Date()}]);
        setToDo('');
    }
    }
  }

  const inputRef = useRef("null")
  useEffect(() => { inputRef.current.focus(); })

  const onDelete = (id) => {
    setToDos(toDos.filter((to) => to.id !== id))
  }

  const onCmplt = (id) => {
    let complete = toDos.map((to)=> {
      if (to.id === id) {
        return({...to, status: !to.status})
      }
      return to
    })
    setToDos(complete)
  }

  const onEdit = (id) => {
    let inEdit = toDos.find((to)=>{
      if (to.id === id) {
        setToDo(to.list)
        setEditingId(id)
      }
    } )

  }

  return (
    <div className="app">
      <div className="mainHeading">
        <h1>to-do-list</h1>
      </div>
      <div className="subHeading">
        <br />
        <h2>{dayAndDateMessage}</h2>
        
      </div>
      <div className='quote'> Time to turn those to-dos into ta-dahs!</div>
      <form onSubmit={handleSubmit} className="input">
        <input value={toDo} ref={inputRef} onChange={(e) => setToDo(e.target.value)} type="text" placeholder="Add a task... " />
        <button type="submit">
          {editingId !== null ? <CiEdit /> : <i className="fas fa-plus"></i>}
        </button>
      </form>
    
      <div className='todos'>
        <ul className='todo-list'>
          {
            toDos.map((to, index) => (
              <li className={`todo-item ${to.status ? 'finished' : ''}`} key={index}>
                <div className='todo-content'>
              
                     <span className='todo-text'>{to.list}</span>
                     <span className='todo-timestamp'>{to.timestamp.toLocaleString()}</span>
                </div>
                <span className='icons' ><IoCheckmarkDone onClick={()=> onCmplt(to.id)}/>
                  <CiEdit onClick={()=> onEdit(to.id)}/>
                  <MdDelete onClick={()=> onDelete(to.id)} />
                </span>
              </li>
            ))
          }
        </ul>
      </div>




    </div>
  )
}

export default App;
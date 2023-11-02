import React, { useState } from "react";
import styles from '../styles/Main.module.css'
import { Link } from "react-router-dom";

const FIELDS = {
   NAME: "name",
   ROOM: "room",
}

const Main = () => {

   const { NAME, ROOM } = FIELDS;
   const [values, setValues] = useState({ [NAME]: "", [ROOM]: "" });

   const handleChange = ({ target: { value, name } }) => {
      setValues({ ...values, [name]: value })
   };

   const handleClick = (e) => {
      const isDisabled = Object.values(values).some(value => !value);

      if (isDisabled) e.preventDefault();
   };

   console.log(values);


   return (
      <div className={styles.wrap}>
         <div className={styles.container}>
            <h1 className={styles.title}>Frontend Developers Chat</h1>
            <form className={styles.form}>
               <input
                  className={styles.input}
                  type="text"
                  name="name"
                  value={values[NAME]}
                  placeholder="Введите ваше имя*"
                  onChange={handleChange}
                  autoComplete="off"
                  required />
               <select className={styles.input} name="room" onChange={handleChange} value={values[ROOM]}>
                  <option className={styles.disabled} disabled checked value="">Выберите комнату*</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Private Room">Private Room</option>
               </select>
               {/* <input
                  className={styles.input}
                  type="text"
                  name="room"
                  value={values[ROOM]}
                  placeholder="Введите название комнаты*"
                  onChange={handleChange}
                  autoComplete="off"
                  required /> */}
               <Link onClick={handleClick} to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}>
                  <button className={styles.button} type="submit">Sing in</button>
               </Link>
            </form>
         </div>
      </div>
   );
};

export default Main
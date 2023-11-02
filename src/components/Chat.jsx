import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';

import icon from '../assets/images/emoji.png';
import styles from '../styles/Chat.module.css';
import { Messages } from "./Messages";

// url хоста, где находится backend
const socket = io.connect('http://localhost:5000');

const Chat = () => {

   // данные location.search передаются строкой. {} - метод деструктуризации
   const { search } = useLocation();
   const navigate = useNavigate();
   const [params, setParams] = useState({ room: "", user: "" });
   const [state, setState] = useState([]);

   const [message, setMessage] = useState("");
   const [emojiOpen, setEmojiOpen] = useState(false);
   const [usersCounter, setUsersCounter] = useState(0);

   useEffect(() => {

      // Строку нужно разобрать на объект
      const searchParams = Object.fromEntries(new URLSearchParams(search));
      setParams(searchParams);

      // метод emit в себя принимает название события,
      // с помощью этого метода мы инициализируем событие,
      // которое будет слушаться на сервере.
      // вместе с событием нам нужно отправлять имя пользователя и название комнаты
      socket.emit('join', searchParams);
   }, [search]);

   // Вывод сообщений
   useEffect(() => {
      socket.on('message', ({ data }) => {
         setState((_state) => [..._state, data])
      });
   }, []);

   // Вывод количества участников комнаты
   useEffect(() => {
      socket.on('joinRoom', ({ data: { users } }) => {
         setUsersCounter(users.length);
      });
   }, []);

   // Функция нажатия кнопки выхода из комнаты
   const leaveRoom = () => {
      socket.emit('leaveRoom', { params });
      navigate("/");
   };

   // Функция ввода сообщения
   const handleChange = ({ target: { value } }) => {
      setMessage(value);
   }

   const onEmojiClick = ({ emoji }) => {
      setMessage(`${message} ${emoji}`)
   }

   // Функция нажатия кнопки отправки сообщения
   const handleSubmit = (e) => {
      e.preventDefault();

      if (!message) return;

      const sendTime = {
         hours: new Date().getUTCHours(),
         minutes: new Date().getUTCMinutes()
      };
      // `${new Date().getUTCHours()}:${new Date().getUTCMinutes()}`;

      socket.emit('sendMessage', { message, params, sendTime });

      setMessage("");
   }

   const usersInRoom = () => {
      console.log(usersCounter)
      if (usersCounter === 1) {
         return `${usersCounter} участник в комнате`
      }
      if (usersCounter > 1 && usersCounter < 5) {
         return `${usersCounter} участника в комнате`
      }
      if (usersCounter >= 5) {
         return `${usersCounter} участников в комнате`
      }
   }
   return (
      <div className={styles.wrap}>
         <div className={styles.header}>
            <div className={styles.headerInfo}>
               <div className={styles.title}>
                  {params.room}
               </div>
               <div className={styles.roomUsers}>
                  {usersInRoom()}
               </div>
            </div>
            <button className={styles.leave} onClick={leaveRoom}>Выйти</button>
         </div>

         <Messages messages={state} name={params.name} />

         <form className={styles.form} onSubmit={handleSubmit}>
            <input
               autoFocus
               className={styles.input}
               type="text"
               name="message"
               value={message}
               placeholder="Введите ваше сообщение"
               onChange={handleChange}
               autoComplete="off"
               required
            />
            <div className={styles.emoji}>
               <img src={icon} alt="emoji" onClick={() => setEmojiOpen(!emojiOpen)} />
               {emojiOpen && (
                  <div className={styles.emojies}>
                     <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
               )}
            </div>
            <div className={styles.button}>
               <button>Отправить</button>
            </div>
         </form>
      </div >
   );
};

export default Chat
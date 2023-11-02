import React from 'react'
import styles from '../styles/Messages.module.css';

export const Messages = ({ messages, name }) => {

   return (
      <div className={styles.messages}>
         {messages.map(({ user, message, sendTime }, i) => {

            const itsMe = user.name.trim().toLowerCase() === name.trim().toLowerCase();
            const admin = user.name.trim().toLowerCase() === "администратор";

            const className = itsMe ? styles.meMsg : admin ? styles.adminMsg : styles.userMsg;

            const timeZone = new Date().getHours() - new Date().getUTCHours();

            function updateTime() {
               if (sendTime) {
                  if (sendTime.minutes < 10) {
                     sendTime.minutes = `0${sendTime.minutes}`
                  }

                  return `${sendTime.hours + timeZone}:${sendTime.minutes}`
               }
            }

            return (
               <div className={`${styles.message} ${className}`} key={i}>
                  <span className={styles.user}>
                     {user.name}
                  </span>
                  <div className={styles.content}>
                     <div className={styles.text}>
                        {message}
                     </div>
                     <div className={styles.time}>
                        {updateTime()}
                     </div>
                  </div>
               </div>
            )
         })}
      </div>
   )
}

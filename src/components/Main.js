import React from 'react';
import { api } from '../utils/Api.js';
import { Card } from './Card.js';
import { App } from './App.js';

function Main(props) {
  // передали обработчики с помощью новых пропсов, чтобы их использовать
  const { onEditProfile, onAddPlace, onEditAvatar, cards, onCardClick } = props;
  
  // переменные состояния для профиля
  const [userName, setUserName] = React.useState();
  const [userDescription, setUserDescription] = React.useState();
  const [userAvatar, setUserAvatar] = React.useState({});

  // добавьте эффект, вызываемый при монтировании компонента, который будет 
  // совершать запрос в API за пользовательскими данными
  // После получения ответа задавайте полученные данные в соответствующие 
  // переменные состояния  
  React.useEffect(() => {
    api.getUserIDInfo()
    .then((user) => {

    // ID information
    setUserName(user.name)
    setUserDescription(user.about)
    setUserAvatar(user.avatar)

    }).catch((err) => console.log(`catch: ${err}`))
    }, []);

  return (
    <main className="content"> 
      <section className="profile">
        <div className="profile__group-avatar">
          <img
            className="profile__avatar"
            src={userAvatar}
            alt="фотография человека, которому принадлежит этот профиль"
          />
          <button className="profile__avatar-button" type="button" onClick={onEditAvatar}/> 
        </div>
        <div className="profile__info">
          <div className="profile__main-info">
            <h1 className="profile__name">{userName}</h1>
            <button className="profile__edit-button" type="button" onClick={onEditProfile}/>
          </div>
          <p className="profile__text">{userDescription}</p>
        </div>
          <button className="profile__add-button" type="button" onClick={onAddPlace}/>
      </section>
      <ul className="elements">
        {cards.map(item => (
          <Card key={item._id} card={item} onCardClick={onCardClick} {...item}/>
        ))}
      </ul>
    </main>
  )
};

export { Main };
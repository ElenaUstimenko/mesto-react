import React from 'react';
import { Main } from './Main.js';
import { App } from './App.js';
import './Card.css';



function Card({onCardClick, ...props}) { 
  //console.log(props)
  
  const handleClick = () => {
    onCardClick(props); // наши карточки при загрузке
  }

  return (
          <li className="element" key={props.id}>
            <div className="element__group_image">
              <img className="element__image"
              src={props.url}
              alt={props.name}
              onClick={handleClick}
              />
              <button className="element__button_delete" type="button"></button>
            </div>
            <div className="element__group_like">
              <h2 className="element__title">{props.name}</h2>
              <div className="element__group_counter">
                <button className="element__button_like" type="button"></button>
                <p className="element__counter">{props.likes}</p>
              </div>
            </div>
          </li>
    )
};


export { Card };
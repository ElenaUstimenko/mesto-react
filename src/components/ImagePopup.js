import React from 'react';
import { Card } from './Card.js';
import './ImagePopup.css';

function ImagePopup({isOpen, onClose, ...props}) {
  // console.log(props)
  
  // const { isOpen } = props;
  // const { onClose } = props;

  return (
    <div className={`popup popup_open-image ${isOpen ?'popup_opened':''}`}>
      <div className="popup__container popup__container_type_open-image">
        <button className="popup__close popup__close_open-image" type="button" onClick={onClose}/>
        <img className="popup__image" 
        src={props.card.url}
        alt={props.card.name}/>
        <h3 className="popup__paragraph">{props.card.name}</h3>
    </div>
  </div>
  )
};

export { ImagePopup };
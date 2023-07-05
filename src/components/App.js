import React from 'react';
import { Header } from './Header.js';
import { Footer } from './Footer.js';
import { Main } from './Main.js';
import { PopupWithForm } from './PopupWithForm.js';
import { ImagePopup } from './ImagePopup.js';
import { Card } from './Card.js';
import { api } from '../utils/Api.js';

function App(props) {
  // объявляем переменные состояния с исходным значением
  // [текущее состояние и функция, обновляющая состояние]
  // чтобы проинициализировать функцию, мы передаём значение false в качестве единственного аргумента функции useState
  // второе возвращённое нам значение позволяет обновлять isEditProfilePopupOpen и т.д.
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setisEditAvatarPopupOpen] = React.useState(false);
  
  // card's zoom 
  const [selectedCard, setSelectedCard] = React.useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);

  // card's zoom
  const handleCardClick = (data) => {
  setIsImagePopupOpen(true);
  setSelectedCard(data);
}
    
  // меняем аргумент функции на true, чтобы открыть попап
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setisAddPlacePopupOpen(true);
  }

  const handleEditAvatarClick = () => {
    setisEditAvatarPopupOpen(true);
  }

  // Значение selectedCard должно передаваться с помощью пропса card в компонент ImagePopup, 
  // где оно будет использоваться для определения наличия CSS-класса видимости и задания адреса изображения в теге img. 
 
  // закрытие попапов
  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setisAddPlacePopupOpen(false);
    setisEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard({});
  }

  //закрытие попапа на Esc c useEffect
  // Слушатель Esc необходимо устанавливать не при монтировании компонента, а при открытии попапов.
  /*React.useEffect(() => {
      const closePopupByEsc = (evt) => {
        if (evt.key === 'Escape') {
          closeAllPopups();
        }
    } 
    document.addEventListener('keydown', closePopupByEsc);
    return () => {
      document.removeEventListener('keydown', closePopupByEsc);
    }  
  }, []);*/

  // закрытие попапа на overlay c useEffect
  // Слушатель клика в оверлей необходимо устанавливать на попап, а не на документ.
  /*React.useEffect(() => {
    const closePopupByOverlay = (evt) => {
      if (evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close')) {
        closeAllPopups();
      }
  } 
    document.addEventListener('mousedown', closePopupByOverlay);
    return () => {
      document.removeEventListener('mousedown', closePopupByOverlay);
    }
  }, []);*/

  // переменная состояния для карточек
  const [cards, setCards] = React.useState([]);
  
  React.useEffect((item) => {
    
    api.getCards()
    .then((res) => {
      
      const cardsFromApi = res.map((item) => ({
        name: item.name,
        _id: item._id,
        url: item.link,
        likes: item.likes.length,
    }));    
    // cards
    setCards(cardsFromApi);
    }).catch((err) => console.log(`catch: ${err}`))
  }, []);
  

  return (
      <div className="page">
        <Header />
        <Main 
        //отображаем текущее состояние
        onEditProfile={handleEditProfileClick} 
        onAddPlace={handleAddPlaceClick} 
        onEditAvatar={handleEditAvatarClick}
        onCardClick={handleCardClick}
        cards={cards}>
        </Main>
        <Footer />
        <PopupWithForm name="popup_edit-profile" title="Редактировать профиль" isOpen={isEditProfilePopupOpen} 
        onClose={closeAllPopups} buttonText={"Сохранить"}> 
          <>
            <label className="popup__field">
              <input 
                id="name-input"
                type="text"
                name="name"
                className="popup__input popup__input_type_name"
                placeholder="Имя"
                minLength={2}
                maxLength={40}
                required
            />
            <span className="name-input popup__input-error" />
            </label>
            <label className="popup__field">
              <input
                  id="profession-input"
                  type="text"
                  name="about"
                  className="popup__input popup__input_type_profession"
                  placeholder="Вид деятельности"
                  minLength={2}
                  maxLength={200}
                  required    
              />
            <span className="profession-input popup__input-error" />
            </label>
          </>
        </PopupWithForm>

        <PopupWithForm name="popup_add-image" title="Новое место" isOpen={isAddPlacePopupOpen} 
        onClose={closeAllPopups} buttonText={"Сохранить"}>
          <>
            <label className="popup__field">
              <input
                id="place-input"
                type="text"
                name="name"
                className="popup__input popup__input_type_place"
                placeholder="Название"
                minLength={2}
                maxLength={30}
                required
              />
              <span className="place-input popup__input-error" />
            </label>
            <label className="popup__field">
              <input
                id="link-input"
                name="link"
                className="popup__input popup__input_type_link"
                placeholder="Ссылка на картинку"
                type="url"
                required
              />
            <span className="link-input popup__input-error" />
            </label>
            </>
        </PopupWithForm>

        <PopupWithForm name="popup_update-avatar" title="Обновить аватар" isOpen={isEditAvatarPopupOpen} 
        onClose={closeAllPopups} buttonText={"Сохранить"}>
          <>
            <label className="popup__field">
              <input
                id="link-inputAvatar"
                name="avatar"
                className="popup__input popup__input_type_link"
                placeholder="Ссылка на картинку"
                type="url"
                required
              />
              <span className="link-input popup__input-error" />
            </label>
          </>
        </PopupWithForm>

        <PopupWithForm name="popup_confirm-delete" title="Вы уверены?" buttonText={"Да"}>
          <>
          </>
        </PopupWithForm>

        <ImagePopup isOpen={isImagePopupOpen} onClose={closeAllPopups} card={selectedCard} />
        
      </div>
  )
};

export { App };
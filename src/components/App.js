import React from 'react';
import { Header } from './Header.js';
import { Footer } from './Footer.js';
import { Main } from './Main.js';
import { PopupWithForm } from './PopupWithForm.js';
import { ImagePopup } from './ImagePopup.js';
import { Card } from './Card.js';
import { api } from '../utils/Api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { EditProfilePopup } from './EditProfilePopup.js';
import { EditAvatarPopup } from './EditAvatarPopup.js';
import { AddPlacePopup } from './AddPlacePopup.js';

function App(props) {
  /////////////////////////////////////////////////////////////////////////////////////////////////////// 3 popups
  
  // объявляем переменные состояния с исходным значением
  // [текущее состояние и функция, обновляющая состояние]
  // чтобы проинициализировать функцию, мы передаём значение false в качестве единственного аргумента функции useState
  // второе возвращённое нам значение позволяет обновлять isEditProfilePopupOpen и т.д.
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setisEditAvatarPopupOpen] = React.useState(false);
    
  // меняем аргумент функции на true, чтобы открыть попап
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setisAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setisEditAvatarPopupOpen(true);
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////// zoom
  
  // Значение selectedCard должно передаваться с помощью пропса card в компонент ImagePopup, 
  // где оно будет использоваться для определения наличия CSS-класса видимости и задания 
  // адреса изображения в теге img
  
  // card's zoom 
  const [selectedCard, setSelectedCard] = React.useState(null);

  // card's zoom
  const handleCardClick = (data) => {
    setSelectedCard(data);
  };
  // console.log(selectedCard)

  /////////////////////////////////////////////////////////////////////////////////////////////////////// all popups
  
  // закрытие попапов
  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setisAddPlacePopupOpen(false);
    setisEditAvatarPopupOpen(false);
    setSelectedCard(null);
  };

  // закрытие попапа на Esc c useEffect
  // Слушатель Esc необходимо устанавливать не при монтировании компонента, а при открытии попапов.
  const isAnyPopupOpen = React.useMemo(() => {
    return (
      isEditProfilePopupOpen || isAddPlacePopupOpen || isEditAvatarPopupOpen || selectedCard
    );
  }, [ isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen, selectedCard ]);

  React.useEffect(() => {
    if(isAnyPopupOpen) {
      const closePopupByEsc = (evt) => {
        if (evt.key === 'Escape') {
          closeAllPopups();
          }
        } 
      document.addEventListener('keydown', closePopupByEsc);
      return () => {
        document.removeEventListener('keydown', closePopupByEsc);  
      }
    }      
  }, [isAnyPopupOpen]);

  // закрытие попапа на overlay c useEffect
  // Слушатель клика в оверлей необходимо устанавливать на попап, а не на документ => так не работает
  /*React.useEffect(() => {
    const closePopupByOverlay = (evt) => {
      if (evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close')) {
        closeAllPopups();
      }
  } 
    document.addEventListener('mousedown', closePopupByOverlay); // => нужно на попап
    return () => {
       document.removeEventListener('mousedown', closePopupByOverlay); // => нужно на попап
    }
  }, []);*/

  /////////////////////////////////////////////////////////////////////////////////////////////////////// cards
  
  // переменная состояния для карточек
  const [cards, setCards] = React.useState([]);
  
  // вариант 1 => подход с преобразованием данных карточки
 /* React.useEffect((item) => {
    
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
  }, []);*/
  
  // вариант 2 => сохраняем в стэйт весь массив, который получаем с сервера
  React.useEffect(() => {
    
    api.getCards()
   .then((cards) => { 
      setCards(cards);
    }).catch((err) => console.log(`catch: ${err}`))
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////////////////// user's context
  
  // стейт, отвечающий за данные пользователя
  const [currentUser, setCurrentUser] = React.useState('');
  // эффект, вызываемый при монтировании компонента, который будет 
  // совершать запрос в API за пользовательскими данными
  React.useEffect(() => {
    api.getUserIDInfo()
    .then((currentUser) => {
      console.log(currentUser);
    // user information - обновление стейт переменной из получ.значения
    setCurrentUser({
      name: currentUser.name,
      about: currentUser.about,
      avatar: currentUser.avatar,
      _id: currentUser._id,
    })
    }).catch((err) => console.log(`catch: ${err}`))
    }, []);

  /////////////////////////////////////////////////////////////////////////////////////////////////////// likes
  
  const handleCardLike = (card) => {
	  //проверяем, есть ли уже лайк на этой карточке
	   const isLiked = card.likes.some(i => i._id === currentUser._id);
    // отправляем запрос в API и получаем обновлённые данные карточки
    if (!isLiked) {
      api.addLike(card._id)
      .then((newCard) => { 
        setCards((state) => 
        // формируем новый массив на основе имеющегося, подставляя в него новую карточку
        state.map((c) => (c._id === card._id ? newCard : c))
      );
      }).catch((err) => console.log(`catch: ${err}`))
    } else {
      api.deleteLike(card._id)
      .then((newCard) => { 
        setCards((state) => 
        state.map((c) => (c._id === card._id ? newCard : c))
      );
      }).catch((err) => console.log(`catch: ${err}`))
    }
  };
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////// delete

  const handleCardDelete = (cardID) => {
    api.deleteCard(cardID)
    .then(() => {
      // используя методы массива, создаем новый массив карточек, 
      // где не будет карточки, которую мы только что удалили
      setCards((cards) => cards.filter((c) => c._id !== cardID)); 
    }).catch((err) => console.log(`catch: ${err}`))
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////// edit profile
  
  // после завершения запроса обновляем стейт currentUser из полученных данных 
  const handleUpdateUser = ({name, about}) => {
    api.userInformation({name, about})
    .then((newProfile) => {
      setCurrentUser(newProfile)
       closeAllPopups();
    }).catch((err) => console.log(`catch: ${err}`))
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////// edit avatar
  
  const handleUpdateAvatar = (avatar) => {
    api.photoOfAvatar(avatar)
    .then((newAvatar) => {
      setCurrentUser(newAvatar)
      closeAllPopups();
    }).catch((err) => console.log(`catch: ${err}`))
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////// card
  
  // в data name и link 
  const handleAddPlaceSubmit = (data) => {
    api.newCardData(data)
    .then((newCard)=> {
      setCards([newCard, ...cards]);
      closeAllPopups();
      console.log(data)
    }).catch((err) => console.log(`catch: ${err}`))
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main 
        // отображаем текущее состояние
        onEditProfile={handleEditProfileClick} 
        onAddPlace={handleAddPlaceClick} 
        onEditAvatar={handleEditAvatarClick}
        onCardClick={handleCardClick}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDelete}
        cards={cards}>
        </Main>
        <Footer />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} 
        onClose={closeAllPopups} onUpdateUser={handleUpdateUser} /> 
         
        <AddPlacePopup isOpen={isAddPlacePopupOpen} 
        onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} 
        onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
          
        <PopupWithForm name="popup_confirm-delete" title="Вы уверены?" buttonText={"Да"}>
          <>
          </>
        </PopupWithForm>

        <ImagePopup name="popup_open-image" onClose={closeAllPopups} card={selectedCard}/> 
        
      </div>
    </CurrentUserContext.Provider>
  )
};

export { App };
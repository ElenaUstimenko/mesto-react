import './PopupWithForm.css';

function PopupWithForm(props) {
  // протягиваем сюда isOpen, чтобы использовать
  const { isOpen } = props;
  const { onClose } = props;

  // если попап isOpen то добавляем класс popup_opened
  return (
    <div className={`popup popup_type_${props.name} ${isOpen ?'popup_opened':''}`}> 
      <div className="popup__container">
        <button className="popup__close" type="reset" onClick={onClose}/>
        <h3 className="popup__header" >{props.title}</h3>
        <form
          action="#"
          method="get"
          name={`${props.name}`}
          className=".popup__form"
          noValidate=""
        >
          {props.children} 
        </form> 
      </div>
    </div>
  )
};

export { PopupWithForm };
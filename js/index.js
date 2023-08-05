// Yandex map
const init = () => {
  const myMap = new ymaps.Map(
    'map',
    {
      center: [55.7718, 37.6316],
      zoom: 14,
      controls: ['smallMapDefaultSet'],
    },
    {},
  );

  const myPlacemark = new ymaps.Placemark(
    [55.7724, 37.6252],
    {},
    {
      iconLayout: 'default#image',
      iconImageHref: 'img/mark.svg',
      iconImageSize: [70, 70],
      iconImageOffset: [-35, -70],
    },
  );

  myMap.geoObjects.add(myPlacemark);

  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      myMap.setCenter([55.7718, 37.6256]);
    } else {
      myMap.setCenter([55.7718, 37.6316]);
    }
  });
};
ymaps.ready(init);

// MODAL

const scrollController = {
  scrollPosition: 0,
  disabledScroll() {
    scrollController.scrollPosition = window.scrollY;
    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      top: -${scrollController.scrollPosition}px;
      left: 0;
      width: 100vw;
      height: 100vh;
      padding-right: ${window.innerWidth - document.body.offsetWidth}px;
    `;
    document.documentElement.style.scrollBehavior = 'unset';
  },
  enabledScroll() {
    document.body.style.cssText = '';
    window.scroll({top: scrollController.scrollPosition})
    document.documentElement.style.scrollBehavior = '';
  },
}

const createElem = (tag, attr) => {
  const elem = document.createElement(tag);
  return Object.assign(elem, {...attr});
};

const createModal = (title, description) => {
  const overlayElem = createElem('div', {className: 'modal'});
  const modalElem = createElem('div', {className: 'modal__block'});
  const modalContainerElem = createElem('div', {className: 'modal__container'});

  const titleElem = createElem('h2', {
    className: 'modal__title',
    textContent: `Заказать ${title}`
  });

  const descriptionElem = createElem('p', {
    className: 'modal__description',
    textContent: `${description}`
  });

  const formElem = createElem('form', {
    className: 'modal__form',
    method: 'POST',
    action: 'https://jsonplaceholder.typicode.com/posts',
    id: 'order',
  });

  const nameLabelElem = createElem('label', {className: 'modal__label'});
  const nameSpanElem = createElem('span', {className: 'modal__text', textContent: 'Имя'});
  const nameInputlElem = createElem('input', {
    className: 'modal__input',
    placeholder: 'Введите ваше имя',
    name: 'name',
    required: true,
  });
  nameLabelElem.append(nameSpanElem, nameInputlElem);

  const phoneLabelElem = createElem('label', {className: 'modal__label'});
  const phoneSpanElem = createElem('span', {className: 'modal__text', textContent: 'Телефон'});
  const phoneInputlElem = createElem('input', {
    className: 'modal__input',
    placeholder: 'Введите ваш телефон',
    name: 'phone',
    required: true,
  });
  phoneLabelElem.append(phoneSpanElem, phoneInputlElem);

  const hideInput = createElem('input', {
    type: 'hidden',
    name: 'product',
    value: title,
  });

  const btnSubmit = createElem('button', {
    className: 'modal__btn btn btn--accent',
    textContent: 'Заказать',
    type: 'submit',
  });
  btnSubmit.setAttribute('form', 'order');

  const closeModalBtn = createElem('button', {
    className: 'modal__close',
    innerHTML: `
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.75 8.0125L21.9875 6.25L15 13.2375L8.0125 6.25L6.25 8.0125L13.2375 15L6.25 21.9875L8.0125 23.75L15 16.7625L21.9875 23.75L23.75 21.9875L16.7625 15L23.75 8.0125Z" fill="currentColor"/>
      </svg>
    `,
    type: 'button',
  });

  overlayElem.addEventListener('click', ({target}) => {
    console.log('target: ', target);
    if (target === overlayElem || target.closest('.modal__close')) {
      overlayElem.remove();
      scrollController.enabledScroll();
    }
  });

  formElem.append(nameLabelElem, phoneLabelElem, hideInput );
  modalContainerElem.append(titleElem, descriptionElem, formElem, btnSubmit, closeModalBtn);
  modalElem.append(modalContainerElem);
  overlayElem.append(modalElem);

  scrollController.disabledScroll();
  
  document.body.append(overlayElem);
}

const productTitle = document.querySelectorAll('.product__title');
const productDescription = document.querySelectorAll('.product__description');
const productBtn = document.querySelectorAll('.product__btn');

for (let i = 0; i < productBtn.length; i++) {
  productBtn[i].addEventListener('click', () => {
    const title = productTitle[i].textContent;
    const description = productDescription[i].textContent;

    createModal(title, description);
  });
}
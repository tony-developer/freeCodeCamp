// напрямую обращаемся к DOM только один раз, чтобы достать форму
// ещё можно достать через document.forms
// подробнее: https://developer.mozilla.org/ru/docs/Web/API/Document/forms
const form = document.querySelector('.example-form');

function setError(input) {

    // не самый лучший выбор, т.к. сильно завязываеся на вёрстку,
    // которая может в любой момент развалиться
    input.nextElementSibling.innerText = input.validationMessage;
}


function validateField(input) {
    // чтобы каждый раз не обращаться к input.validity запомним его в переменную
    // подбробнее про validity - https://developer.mozilla.org/ru/docs/Learn/HTML/Forms/%D0%92%D0%B0%D0%BB%D0%B8%D0%B4%D0%B0%D1%86%D0%B8%D1%8F_%D1%84%D0%BE%D1%80%D0%BC%D1%8B
    const validity = input.validity;

    if (validity.valueMissing) {
        input.setCustomValidity(`Поле обязательно для заполнения`);
        setError(input);
        return false;
    }

    if (validity.tooShort) {
        input.setCustomValidity(`Поле не может быть короче ${input.getAttribute('minlength')} символов`);
        setError(input);
        return false;
    }

    if (validity.tooLong) {
        input.setCustomValidity(`Поле не может быть длинее ${input.getAttribute('maxlength')} символов`);
        setError(input);
        return false;
    }

    if (validity.patternMismatch && input.getAttribute('type') === 'email') {
        input.setCustomValidity(`Введите e-mail в формате mail@mail.ru`);
        setError(input);
        return false;
    }

    if (validity.rangeOverflow || validity.rangeUnderflow) {
        // приведём атрибуты к числу, т.к. они являются строкой, а "100" + 1 будет "1001"
        const min = parseInt(input.getAttribute('min'));
        const max = parseInt(input.getAttribute('max'), 10);
        input.setCustomValidity(`Значение должно быть больше ${min- 1} и меньше ${+max + 1}`);
        setError(input);
        return false;
    }

    // если всё ок, то очищаем сообщение и возвращаем true
    input.setCustomValidity('');
    setError(input);
    return true;
}

function submitForm(event) {
    // т.к. querySelectorAll возвращает HTMLCollection, а не массив
    // нужно преобразовать его в к массиву
    // подробнее - http://jsraccoon.ru/es6-spread-rest
    const inputs = [...event.currentTarget.querySelectorAll('input')];

    // валидируем все поля
    inputs.forEach(validateField);

    // если форма не прошла проверку, то не даём выполниться сабмиту
    // т.к. валидация уже прошла, проверяем только на валидность, валидировать заново ни к чему
    if (!inputs.every((item) => item.valid)) {

        // можно перенести вверх фукнции, чтобы страница не перазагружалась
        event.preventDefault();
    }
}

// submit произойдёт не только по нажатию на кнопку, но и по нажатию на Enter
// поэтому слушаем именно его, слушать клик - неправильно
form.addEventListener('submit', submitForm);

// вешаем обработчик на форму, третий параметр true называется useCapture, обрабатываем событие на этапе захвата, т.к. событие blur не всплывает, всплывающая алтернатива - focusout
// подробнее: https://learn.javascript.ru/bubbling-and-capturing
// P.S. не забывайте, что по вашему заданию валидация происходит по событию input
form.addEventListener('blur', (event) => validateField(event.target), true);

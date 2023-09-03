import './audio-player.js';
let settings = {
    options: {
        time: 'true',
        date: 'true',
        greeting: 'true',
        weather: 'true',
        quote: 'true',
        player: 'true',
        language: 'en',
        background: 'github',
        todo: 'true',
    },
    tag: '',
};

const greeting = document.querySelector('.greeting');

/*1. Times and calendar */
const time = document.querySelector('.time');
const dateCalendar = document.querySelector('.date');
time.textContent = '';
const date = new Date();

function showTime() {
    const date = new Date();
    time.textContent = date.toLocaleTimeString();
    showDate();
    getTimeOfDay();
    setTimeout(showTime, 1000);
}

showTime();

function showDate() {
    settings.options.language === 'en' ? getDate('en-Us') : getDate('uk-UA');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getDate(lang) {
    const currentDate = new Date().toLocaleDateString(lang, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
    dateCalendar.textContent = currentDate
        .split(' ')
        .map((el) => capitalizeFirstLetter(el))
        .join(' ');
}

/*2. Greeting */
const name = document.querySelector('.name');
name.placeholder =
    settings.options.language === 'en' ? '[Enter name]' : "[Введіть ім'я]";

function showGreeting(enDay, ukDay) {
    greeting.textContent =
        settings.options.language === 'en' ? `Good ${enDay}` : ukDay;
}

function getTimeOfDay() {
    const hours = date.getHours();
    if (hours >= 6 && hours < 12) {
        showGreeting('morning', 'Доброго ранку');
        return 'morning';
    }
    if (hours >= 12 && hours < 18) {
        showGreeting('afternoon', 'Доброго дня');
        return 'afternoon';
    }
    if (hours >= 18 && hours < 24) {
        showGreeting('evening', 'Доброго вечора');
        return 'evening';
    }
    if (hours < 6 && hours >= 0) {
        showGreeting('night', 'Доброї ночі');
        return 'night';
    }
}

function setLocalStorage() {
    localStorage.setItem('name', name.value);
}

window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if (localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }
}

window.addEventListener('load', getLocalStorage);

/*3. Image slider */
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

const githubRadio = document.getElementById('check-github');
const flickrRadio = document.getElementById('check-flickr');
const unsplashRadio = document.getElementById('check-unsplash');

function getRandomNum(n) {
    return ~~(Math.random() * n + 1);
}

let randomNum = getRandomNum(20);

function setBackground() {
    const timeOfDay = getTimeOfDay();
    const bgNum = String(randomNum).padStart(2, '0');
    const img = new Image();
    const path = `https://raw.githubusercontent.com/yana-dyachok/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {
        document.body.style.backgroundImage = `url('https://raw.githubusercontent.com/yana-dyachok/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`;
    };
    img.src = path;
}

function onloadImg() {
    settings.options.background === 'github'
        ? setBackground()
        : settings.options.background === 'unsplash'
        ? getUnsplashImg(settings.tag)
        : getFlickrImg(settings.tag);
}

onloadImg();

function getSlideNext() {
    if (settings.options.background === 'github') {
        randomNum = randomNum < 20 ? randomNum + 1 : 1;
        setBackground();
    } else if (settings.options.background === 'unsplash')
        getUnsplashImg(settings.tag);
    else {
        getFlickrImg(settings.tag);
    }
}

function getSlidePrev() {
    if (settings.options.background === 'github') {
        randomNum = randomNum > 1 ? randomNum - 1 : 20;
        setBackground();
    } else if (settings.options.background === 'unsplash')
        getUnsplashImg(settings.tag);
    else {
        getFlickrImg(settings.tag);
    }
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

/*4. Weather widget */
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');

function setLocalStorageCity(cityName) {
    localStorage.setItem('city', cityName);
}

function getLocalStorageCity() {
    return localStorage.getItem('city');
}

const savedCity = getLocalStorageCity();

if (savedCity) {
    city.value = capitalizeFirstLetter(savedCity);
    getWeather(savedCity);
} else {
    city.value = settings.options.language === 'en' ? 'Minsk' : 'Минск';
    getWeather(city.value);
}

async function getWeather(cityName) {
    let url =
        settings.options.language === 'en'
            ? `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=en&appid=e15cc81ed311b5889760d37c6251b684&units=metric`
            : `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=uk&appid=e15cc81ed311b5889760d37c6251b684&units=metric`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.floor(data.main.temp)}°C`;
        wind.textContent =
            (settings.options.language === 'en'
                ? 'Wind speed:'
                : 'Швидкість вітру:') +
            ` ${Math.floor(data.wind.speed)}` +
            (settings.options.language === 'en' ? 'm/s' : 'м/с');
        humidity.textContent =
            (settings.options.language === 'en' ? 'Humidity:' : 'Вологість') +
            ` ${Math.floor(data.main.humidity)}%`;
        weatherDescription.textContent = data.weather[0].description;
    } catch (error) {
        console.error(error);
        alert(
            settings.options.language === 'en'
                ? "Wrong city's name! Try agan."
                : 'Неправильна назва міста! Спробуйте ще раз.'
        );
    }
}

function showTheWeather() {
    const cityName = city.value;
    getWeather(cityName);
    setLocalStorageCity(cityName);
}

city.addEventListener('change', showTheWeather);

/* 5. Quote of the day*/
const quote = document.querySelector('.quote');
const changeQuote = document.querySelector('.change-quote');
const author = document.querySelector('.author');

async function getQuotes() {
    let res =
        settings.options.language === 'en'
            ? await fetch('./js/data.json')
            : await fetch('./js/datauk.json');
    const data = await res.json();
    const randomQuote = getRandomNum(49);
    const { quote: text, author: authorName } = data[randomQuote];
    quote.textContent = text;
    author.textContent = authorName;
}

getQuotes();
changeQuote.addEventListener('click', getQuotes);

/*8. Application translation -----------------------------------------------------------------------------------------------------------------*/
const inputToDo = document.querySelector('.input-todo');
const optionsName = document.querySelectorAll('.options-name');
const toDoText = document.querySelectorAll('.todo-text');
const progressTasks = document.querySelector('.progress-tasks');
function changeSettingsLanguage() {
    const ukSettings = ['Мова', 'Плеєр', 'Погода', 'Час', 'Дата', 'Привітання', 'Цитата дня', 'Список справ','Фонове зображення', 'Тег'];
    const enSettings = ['Language','Player','Weather', 'Time', 'Date', 'Greeting', 'Quote', 'ToDo', 'Background Image', 'Tag'];

    const enToDo = ['ToDo list', 'Add', 'Your progress'];
    const ukToDo = ['Список справ', 'Додати', 'Ваш прогрес'];

    if (settings.options.language === 'en') {
        optionsName.forEach((el, i) => {
            optionsName[i].textContent = enSettings[i];
        });

        onToggle.forEach((el, i) => {
            onToggle[0].textContent = 'En';
            onToggle[i].textContent = 'On';
        });

        offToggle.forEach((el, i) => {
            offToggle[0].textContent = 'Uk';
            offToggle[i].textContent = 'Off';
        });

        toDoText.forEach((el, i) => {
            toDoText[i].textContent = enToDo[i];
            toDoText[toDoText.length - 1].textContent =
                progressTasks.childElementCount === 0
                    ? ''
                    : enToDo[toDoText.length - 1];
        });

        inputToDo.placeholder = 'Add task to be done';
        tagName.placeholder = 'Write your tag';
    } else {
        optionsName.forEach((el, i) => {
            optionsName[i].textContent = ukSettings[i];
        });

        onToggle.forEach((el, i) => {
            onToggle[0].textContent = 'Анг';
            onToggle[i].textContent = 'Вкл';
        });

        offToggle.forEach((el, i) => {
            offToggle[0].textContent = 'Укр';
            offToggle[i].textContent = 'Викл';
        });
        toDoText.forEach((el, i) => {
            toDoText[i].textContent = ukToDo[i];
            toDoText[toDoText.length - 1].textContent =
                progressTasks.childElementCount === 0
                    ? ''
                    : ukToDo[toDoText.length - 1];
        });
        inputToDo.placeholder = 'Додайте завдання, для виконання';
        tagName.placeholder = 'Напишіть свій тег';
    }

    getQuotes();
    showTheWeather();
    showTime();
}

/*9. Getting the background image from the API*/
const tagName = document.querySelector('.background-tag');
async function getUnsplashImg(tag) {
    const img = new Image();
    const newTag = tag || getTimeOfDay();
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${newTag}&client_id=YT15YapXlxDujdcx8yVKchvJr__eZFPF8-EK0LAvIso`;
    const result = await fetch(url);
    const data = await result.json();

    try {
        img.src = data.urls.regular;
    } catch {
        if (result.status === 403) {
            alert(
                settings.options.language === 'en'
                    ? 'Error to Unsplash access'
                    : 'Помилка доступу до Unsplash'
            );
        }
        if (result.status === 404) {
            alert(
                settings.options.language === 'en'
                    ? 'No images were found for this tag \nTry to enter a different tag!'
                    : 'Для цього тегу не знайдено зображень \nСпробуйте ввести інший тег!'
            );
        }
        settings.tag = '';
        tagName.value = '';
    }
    img.onload = () => {
        document.body.style.backgroundImage = `url('${data.urls.regular}')`;
    };
}
async function getFlickrImg(tag) {
    const image = new Image();
    const newTag = tag || getTimeOfDay();
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=487d107c09bb457a77c8ebf709668f30&tags=${newTag}&extras=url_l&format=json&nojsoncallback=1`;
    const result = await fetch(url);
    const data = await result.json();
    
    if (data.stat === 'fail') {
        alert(
            settings.options.language === 'en'
                ? 'Error to  Flickr access'
                : 'Помилка доступу до  Flickr'
        );
    } else {
        try {
            if (data.photos.photo.length > 0) {
                let randomIndex = getRandomNum(data.photos.photo.length);
                image.src = data.photos.photo[randomIndex].url_l; 
            } else {
                throw new Error("No photos found for this tag.");
            }
        } catch {
            alert(
                settings.options.language === 'en'
                    ? 'No images were found for this tag \nTry to enter a different tag!'
                    : 'Для цього тегу не знайдено зображень \nСпробуйте ввести інший тег!'
            );
            settings.tag = '';
            tagName.value = '';
        }
    }

    image.onload = () => {
        document.body.style.backgroundImage = `url('${data.photos.photo[getRandomNum(data.photos.photo.length)].url_l}')`;
    };
}     

function determineSelectedRadio() {
    if (githubRadio.checked) {
      settings.options.background ='github';
      document.querySelector('.tag-block').style.visibility ='hidden';
      onloadImg();
    } else if (flickrRadio.checked) {
      settings.options.background ='flickr';
      document.querySelector('.tag-block').style.visibility ='visible';
      onloadImg();
    } else if (unsplashRadio.checked) {
      settings.options.background ='unsplash';
      document.querySelector('.tag-block').style.visibility ='visible';
      onloadImg();
    } else {
      settings.options.background ='github';
      document.querySelector('.tag-block').style.visibility ='hidden';
      onloadImg();
    }
  }
  
  function checkedImgRadioBtn() {
  githubRadio.addEventListener('change',determineSelectedRadio);
    
  flickrRadio.addEventListener('change',determineSelectedRadio);
    
  unsplashRadio.addEventListener('change',determineSelectedRadio);
  }
  
  checkedImgRadioBtn()

function searchByTag() {
    settings.tag = tagName.value;
    onloadImg();
}

tagName.addEventListener('change', searchByTag);
tagName.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchByTag();
});

/*10.Application settings------------------------------------------------------------*/
const settingBtn = document.querySelector('.settings-icon');
const overlay = document.querySelector('.overlay');
const settingsBlock = document.querySelector('.settings-block');
const swichBlocks = document.querySelectorAll('.swich-block');
const indicator = document.querySelectorAll('.indicator');
let onToggle = [];
let offToggle = [];

swichBlocks.forEach((swichBlock) => {
    onToggle.push(swichBlock.children[0]);
    offToggle.push(swichBlock.children[swichBlock.children.length - 1]);
});

function openAplications(block) {
    overlay.classList.add('target');
    block.classList.add('active');
}

function closeAplications(block) {
    overlay.classList.remove('target');
    block.classList.remove('active');
}

settingBtn.addEventListener('click', () => openAplications(settingsBlock));
overlay.addEventListener('click', () => closeAplications(settingsBlock));



function hideBlock(options, selector) {
    document.querySelector(selector).style.visibility =
        options === 'true' ? 'visible' : 'hidden';
}

const selectors = ['.player', '.weather', '.time', '.date', '.greeting-container', '.quote-block', '.todo-list'];

indicator.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');

        const optionProperties = ['player','weather','time','date', 'greeting','quote','todo'];

        if (i === 0) {
            settings.options.language = indicator[0].classList.contains('active')
                ? 'uk'
                : 'en';
            changeSettingsLanguage();
        } else {
            const optionKey = optionProperties[i - 1];
            settings.options[optionKey] = btn.classList.contains('active')
                ? 'false'
                : 'true';
            hideBlock(settings.options[optionKey], selectors[i - 1]);
        }
    });
});

/*11.Additional functionality. Todo list----------------------------------------------------------------------------------*/
const toDoBtn = document.querySelector('.todo-icon');
const toDoBlock = document.querySelector('.todo-block');
const addButton = document.querySelector('.add-todo-btn');
const toDoTaskList = document.querySelector('.todo-task-list');
const titleProgressTasks = document.querySelector('.title-progress-tasks');

function addTasks() {
    if (inputToDo.value === '') {
        alert(
            settings.options.language === 'en'
                ? 'You should write something'
                : 'Ви повинні щось написати'
        );
    } else {
        let task = document.createElement('li');
        task.innerHTML = inputToDo.value;
        let span = document.createElement('span');
        span.setAttribute('class', 'span-task');
        task.appendChild(span);
        toDoTaskList.appendChild(task);
    }
    inputToDo.value = '';
    getCheckedTask();
    returnCheckedTask();
}

function getCheckedTask() {
    toDoTaskList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            event.target.classList.toggle('checked');
            titleProgressTasks.textContent =
                settings.options.language === 'en'
                    ? 'Your progress'
                    : 'Ваш прогрес';
            progressTasks.appendChild(event.target);
        } else if (event.target.tagName === 'SPAN') {
            event.target.parentElement.remove();
        }
    });
}

function returnCheckedTask() {
    progressTasks.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            event.target.classList.toggle('checked');
            toDoTaskList.appendChild(event.target);
            if (progressTasks.childElementCount === 0)
                titleProgressTasks.textContent = '';
        } else if (event.target.tagName === 'SPAN') {
            event.target.parentElement.remove();
            if (progressTasks.childElementCount === 0)
                titleProgressTasks.textContent = '';
        }
    });
}

addButton.addEventListener('click', addTasks);
inputToDo.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addTasks();
});

toDoBtn.addEventListener('click', () => openAplications(toDoBlock));
overlay.addEventListener('click', () => closeAplications(toDoBlock));

// function setLocalStorage() {
//     localStorage.setItem('todo', JSON.stringify(addTasks));
// }

// function getLocalStorage() {

// }

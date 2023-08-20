let settings = {
    options: {
        time: 'true',
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
    settings.options.language === 'en'? getDate('en-Us') : getDate('uk-UA');
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
name.placeholder =settings.options.language === 'en'?"[Enter name]" :'[Введіть ім\'я]';

function showGreeting(enDay, ukDay) {
    greeting.textContent =settings.options.language === 'en'? `Good ${enDay}`: ukDay;
}

function getTimeOfDay() {
    const hours = date.getHours();
    if (hours >= 6 && hours < 12) {
    showGreeting('morning','Доброго ранку')
    return 'morning'}
    if (hours >= 12 && hours < 18) {
    showGreeting('afternoon','Доброго дня');
    return 'afternoon'}
    if (hours >= 18 && hours < 24) {
      showGreeting('evening','Доброго вечора');
      return 'evening'}
    if (hours < 6 && hours >= 0) {
        showGreeting('night','Доброї ночі');
        return 'night'}
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

function getRandomNum() {
    return ~~(Math.random() * 20 + 1);
}
let randomNum = getRandomNum();

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

setBackground();

function getSlideNext() {
    if (randomNum < 20) randomNum += 1;
    else {
        randomNum = 1;
    }
    setBackground();
}
function getSlidePrev() {
    if (randomNum > 1) randomNum -= 1;
    else {
        randomNum = 20;
    }
    setBackground();
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
    city.value =settings.options.language === 'en' ?'Minsk':'Минск'
    getWeather(city.value);
}

async function getWeather(cityName) {
    let url =settings.options.language === 'en' 
    ?`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=en&appid=e15cc81ed311b5889760d37c6251b684&units=metric`
    :`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=uk&appid=e15cc81ed311b5889760d37c6251b684&units=metric`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.floor(data.main.temp)}°C`;
        wind.textContent = (settings.options.language === 'en' ? 'Wind speed:' : 'Швидкість вітру:') + ` ${Math.floor(data.wind.speed)}`+(settings.options.language === 'en' ? 'm/s' : 'м/с');
        humidity.textContent =(settings.options.language === 'en' ?'Humidity:':'Вологість') +` ${Math.floor(data.main.humidity)}%`;
        weatherDescription.textContent = data.weather[0].description;
    } catch (error) {
        console.error(error);
       alert( settings.options.language === 'en' ?"Wrong city's name! Try agan.":"Неправильна назва міста! Спробуйте ще раз.");
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

function getQuoteIndex() {
    return ~~(Math.random() * 50);
}

async function getQuotes() {
    let res =settings.options.language === 'en'? await fetch('./js/data.json'):await fetch('./js/datauk.json');
    const data = await res.json();
    const randomQuote = getQuoteIndex();
    const { quote: text, author: authorName } = data[randomQuote];
    quote.textContent = text;
    author.textContent = authorName;
}

getQuotes();
changeQuote.addEventListener('click', getQuotes);

/*6. Audio player */
const playPrev = document.querySelector('.play-prev');
const play = document.querySelector('.play');
const playNext = document.querySelector('.play-next');
const audio = document.querySelector('audio');
const switchSound = document.querySelector('.switch-sound');
let isPlay = false;
let playNum = 0;

function playAudio() {
    if (isPlay) {
        isPlay = true;
        audio.play();
        play.classList.add('pause');
    } else {
        isPlay = false;
        audio.pause();
        play.classList.remove('pause');
    }
}

function toggleSound() {
    switchSound.classList.toggle('off-sound');
}

function pauseAudio() {
    if (isPlay) {
        isPlay = false;
        audio.pause();
    } else {
        isPlay = true;
        audio.play();
    }
}

function toggleBtn() {
    play.classList.toggle('pause');
}

function getplayNext() {
    if (playNum < playList.length - 1) playNum++;
    else {
        playNum = 0;
    }
    const currentItem = document.querySelectorAll('.play-item')[playNum];
    const prevItem =
        document.querySelectorAll('.play-item')[
            playNum === 0 ? playList.length - 1 : playNum - 1
        ];
    currentItem.classList.add('item-active');
    prevItem.classList.remove('item-active');
    audio.src = playList[playNum].src;
    playAudio();
}

function getplayPrev() {
    if (playNum > 0) playNum--;
    else {
        playNum = playList.length - 1;
    }
    const currentItem = document.querySelectorAll('.play-item')[playNum];
    const nextItem =
        document.querySelectorAll('.play-item')[
            (playNum + 1) % playList.length
        ];
    currentItem.classList.add('item-active');
    nextItem.classList.remove('item-active');
    audio.src = playList[playNum].src;
    playAudio();
}

play.addEventListener('click', toggleBtn);
playPrev.addEventListener('click', getplayPrev);
play.addEventListener('click', pauseAudio);
playNext.addEventListener('click', getplayNext);
switchSound.addEventListener('click', toggleSound);

import playList from './playlist.js';
//console.log(playList);

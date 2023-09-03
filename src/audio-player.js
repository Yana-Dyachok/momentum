import playList from './playlist.js';
const button = document.querySelector('.play');
const buttonNext = document.querySelector('.play-next');
const buttonPrev = document.querySelector('.play-prev');
const playListContainer = document.querySelector('.play-list');
const nameSong = document.querySelector('.name-song');
const totalDuration = document.querySelector('.total-duration');
const timeline = document.querySelector('.timeline');
const progress = document.querySelector('.progress');
const currentTime = document.querySelector('.current-time');
const volumeBar = document.querySelector('.volume-bar');
const volumBarProgressed = document.querySelector('.volume-bar-progressed');
const switchSoundBtn = document.querySelector('.switch-sound');

const audio = new Audio();
let isPlay = false, playNum = 0;
audio.src = playList[0].src;
nameSong.textContent=playList[0].title;

function getAudio() {
    audio.src = playList[playNum].src;
    totalDuration.textContent = playList[playNum].duration;
}

function playAudio() {
    getAudio()
    isPlay?audio.play():audio.pause();
}

function toggleBtn() {
    button.classList.toggle('pause');
    !isPlay?isPlay = true:isPlay = false;
    playAudio();
    activeAudio();
}

function createPlayList() {
    playList.forEach(el => {
        const li = document.createElement('li');
        li.classList.add('play-item');
        li.textContent = el.title;
        playListContainer.append(li);
    })
}

function activeAudio() {
    document.querySelectorAll('.play-item').forEach((el, i) => {
        if(i !== playNum) {
            el.classList.remove('item-active');
            el.classList.remove('item-pause');
        }
        else {
            el.classList.add('item-active');
            if(el.classList.contains('item-pause')) el.classList.remove('item-pause');
            else el.classList.add('item-pause');
            nameSong.textContent = playList[playNum].title;
            
        } 
    })
}

function playIfPaused() {
    if (!isPlay)toggleBtn();
    else {
        playAudio();
        activeAudio();
    }
}

function playNext() {
playNum < (playList.length-1)?playNum += 1:playNum = 0;
    getAudio();
    playIfPaused();
}


function playPrev() {
(playNum < playList.length && playNum > 0)?playNum -= 1:playNum = playList.length-1;
    getAudio();
    playIfPaused();
}

function playItem(element) {
    document.querySelectorAll('.play-item').forEach((el, i) => {
        if(el === element.target) {
            if(playNum === i)(!isPlay)?playIfPaused():toggleBtn();
            else {
                playNum = i;
                getAudio();
                playIfPaused();
            }
        }
    })
}

function muteVolume() {
    if(!audio.muted) {
        audio.muted = true;
        switchSoundBtn.classList.add('muted');
        volumBarProgressed.style.width = "0%";
    }
    else {
        audio.muted = false;
        switchSoundBtn.classList.remove('muted');
        volumBarProgressed.style.width = `${audio.volume * 100}%`;
    }
}

function updateVolume(event) {
    const volumWidth = window.getComputedStyle(volumeBar).width;
    const newVolume = Math.abs(event.offsetX / parseInt(volumWidth));
    audio.volume = newVolume;
    volumBarProgressed.style.width = `${newVolume * 100}%`;

    if (newVolume === 0 || audio.muted && newVolume > 0) muteVolume();
}

function setTimeInterval() {
    progress.style.width = `${audio.currentTime / audio.duration * 100}%`;
    let seconds = parseInt(audio.currentTime);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    currentTime.textContent = `${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
}

function setTimeline(event) {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = Math.abs(event.offsetX / parseInt(timelineWidth) * audio.duration);
    audio.currentTime = timeToSeek;
}


function reproducePlayer() {
    createPlayList();
    button.addEventListener('click', toggleBtn);
    buttonNext.addEventListener('click', playNext);
    buttonPrev.addEventListener('click', playPrev);
    playListContainer.addEventListener('click', playItem);
    audio.addEventListener('ended', playNext);
    audio.addEventListener('timeupdate', setTimeInterval);
    timeline.addEventListener('click', setTimeline);
    switchSoundBtn.addEventListener('click', muteVolume);
    volumeBar.addEventListener('click', updateVolume);
}

reproducePlayer()

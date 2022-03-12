// =========================================== variables declaration is here ========================================

// ============================== username section ============================== 

// this is input tag for taking username 
let username = document.getElementById('username');
// this is nextButton for moving to categories section 
let nextButton = document.getElementById('next-button');

// ====================== categories section ====================== 

// this is where user name appears in categories section 
let user = document.querySelector('#greeting-section > span');
// this are all the inputs to choose the categories 
let selSong = document.getElementsByClassName('sel-song');
// this is the save button in categories section 
let saveButton = document.getElementById('save-button');

// ====================== navbar section ====================== 

// this is used to access of all the navbarLinks 
let navbarLinks = document.getElementsByClassName('navbar-links');

// ====================== home section ====================== 

// this is for storing the recent played songs 
let recentSongStorage;
// this is for storing all the songs from categories 
let songs = [];

// ====================== search section ====================== 
let closeSearch = document.getElementById('close-search');

// ====================== me section ====================== 

// this is the fav songs container 
let favSongContainer = [];
// this are the mood mix object for opening the coressponding mood mix list 
let moodMixItem = document.getElementsByClassName('mood-mix-item');
// this is used for storing moodmix songs 
let moodMixSongsContainer = [];

// ====================== player's section ====================== 

// this is used to store the values of currently playing songs 
let currentPlayingSong = {
    songName: '',
    artistName: ''
}
// this is the player container 
let playerContainer = document.getElementById('player-container');
// this is the heart shape icon for like/dislike the songs 
let toggleFavSong = document.getElementById("toggle-fav-song");
// this is used for progress bar 
let progress = document.getElementById('progress');
// this is used to display the next song 
let nextSongIndication = document.querySelector('#next-song-indication span');
// this is the for the play/pause icon 
let playPauseButton = document.getElementById('playPauseButton');
// this is a boolean for checking if the player is playing or not the songs 
let isPlay = false;
// this is used for playing next song according to which list is currently being played 
let whichList = 0;
// these are used to store which category and and what song of that is being played currently  
let isSongType = 0, isSongNum = 0
// this is used changing icon of repeat/shuffle/repeatAll songs 
let playMode =document.getElementById('play-mode');
// this is used for storing which mode is currently user playing songs into 
let whichPlayMode = 'repeat-all';

// ====================== artist's section ====================== 

// this is for holding the moodmix songs display container 
let artistSongContainer = document.getElementById('artist-song-container');
// this is for the artist child to make the player show every time you play song in mood mix section 
let artist = document.getElementsByClassName('artist');


// ====================================== function and events declaration with their definition ====================================== 

// ========================= u-container naming section =========================

// function for storing username locally
function SetUserName(value) {
    localStorage.setItem("USERNAME", value);
}

// function for geting username from cache
function getUserName() {
    return localStorage.getItem("USERNAME");
}

// function for next button toggle to make the button enable/disable 
function nextButtonToggle() {
    let nameFlag;
    if (username.value == '') {
        nameFlag = false;
    }
    else {
        for (let i = 0; i < username.value.length; i++) {
            if (username.value[i] == ' ') {
                nameFlag = false;
            }
            else {
                nameFlag = true;
                break;
            }
        }
    }
    if (nameFlag) {
        nextButton.classList.remove('disabled-link');
    } else {
        nextButton.classList.add('disabled-link');
    }
}

// to globally set username in page function 
function nextButtonFunction() {
    SetUserName(username.value);
    document.querySelector('#greeting-section > span').innerHTML = getUserName();
    document.getElementById('me-name').innerHTML = getUserName();
    document.getElementById('m-container').scrollIntoView();
    if (window.matchMedia("(max-width: 700px)").matches) {
        setTimeout(() => {
            console.log('boom baby')
            document.getElementById('m-container').scrollIntoView();
        }, 500);        
    }
}

// username input event calling function
username.addEventListener('input', nextButtonToggle);

// next button click event calling function
nextButton.addEventListener('click', nextButtonFunction);

// ======================== categories section ========================

// function for saving categories locally
function setCategories() {
    let value = [];

    for (let i = 0; i < selSong.length; i++) {
        value[i] = selSong[i].checked;
    }

    localStorage.setItem('CATEGORIES', JSON.stringify(value));
}

// function for getting categories from local storage
function getCategories() {

    // checking categories 
    let value = JSON.parse(localStorage.getItem('CATEGORIES'));
    if (value === null) {
        return;
    }

    // getting categories 
    for (let i = 0; i < selSong.length; i++) {
        selSong[i].checked = value[i];
    }

    // calling the save function 
    save();

    // inpect function for any recent played song stored  
    inspect();

}

// function for save button toggle(show/hide) button
function toggleSaveButton() {
    let musicFlag = false;
    for (let i = 0; i < selSong.length; i++) {
        if (selSong[i].checked) {
            musicFlag = true;
            break;
        }
        else {
            musicFlag = false;
        }
    }
    if (musicFlag) {
        saveButton.classList.remove('scale');
    }
    else {
        saveButton.classList.add('scale');
    }
}

// function for saving categories 
function save() {

    // this is used in me section to show and change the categories 
    let updateInput = document.getElementsByClassName('updt-categories');

    // fetching json files when call save function     
    let whichArray = 0;     // to store the values linearly in songs container
    for (let i = 0; i < selSong.length; i++) {
        if (selSong[i].checked) {

            // this is used to show which categories are loaded in songs in me section 
            updateInput[i].checked = true;
            // fetching the songs and storing inside the array 
            fetchJson(i, whichArray);
            whichArray++;
        } else {
            // to hide empty containers for which categories were selected
            document.querySelectorAll('.song-container')[i].style.display = 'none';
        }
    }

    // for displaying the home section and scrolling to home section  
    document.querySelector('main').style.display = 'flex';
    window.scrollBy(0, window.innerHeight);

    // display navbar after 700ms 
    setTimeout(() => {
        document.getElementById('navbar').style.display = 'flex';
    }, 700);

    // for hiding the info container and deleting the innerHTML of it 
    setTimeout(() => {
        document.getElementById('info-container').innerHTML = '';
        document.getElementById('info-container').style.height = '0';
    }, 800);

    // setting recentSong container in an array 
    recentSongStorage = [];

}

// music category selection click event for hide/show event
for (let i = 0; i < selSong.length; i++) {
    selSong[i].addEventListener('input', toggleSaveButton);
};

// save button click event 
saveButton.addEventListener('click', () => {

    // calling save function 
    save();

    // storing categories 
    setCategories();

    // hiding the recent container 
    document.querySelector('#recent-container').style.display = 'none';

});

// ================================= navbar section =================================

// function for reseting all navlinks and activating only a perticular links 
function activeLinks(num) {
    for (let i = 0; i < navbarLinks.length; i++) {
        navbarLinks[i].classList.remove('navlink-active');
        if (i == num) {
            navbarLinks[i].classList.add('navlink-active');
        }
    }
}

// for click events in navbar links in center of navbar
navbarLinks[0].addEventListener('click', () => {
    document.getElementById('home').scrollIntoView();
    activeLinks(0);
});
navbarLinks[1].addEventListener('click', () => {
    playerContainer.classList.toggle('hide-player-container');
    activeLinks(1);
    favSongChecker();
});
navbarLinks[2].addEventListener('click', () => {
    document.getElementById('search-container').style.top = '0';
    activeLinks(2);
});
navbarLinks[3].addEventListener('click', () => {
    document.getElementById('me-container').scrollIntoView();
    activeLinks(3);
});

// navbar right section for a drop down list 

// this is full screen event here 
document.querySelector('.drop-item').addEventListener('click', () => {
    let elem = document.documentElement;
    let dropItem = document.querySelector('.drop-item');

    if (dropItem.innerHTML == 'full screen mode') {

        dropItem.innerHTML = 'exit full screen mode';

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {

        dropItem.innerHTML = 'full screen mode';

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
});

// =================================== Home section ===================================

// ============================ recent songs container ============================ 

// set recent played songs 
function setRecentSongs() {
    localStorage.setItem('RECENTSONGLIST', JSON.stringify(recentSongStorage));
}

// get recent played songs 
function getRecentSongs() {
    return localStorage.getItem('RECENTSONGLIST');
}

// inspect for any recent song played
function inspect() {
    if (getRecentSongs() == null) {
        recentSongStorage = [];
        document.querySelector('#recent-container').style.display = 'none';
    } else {
        recentSongStorage = JSON.parse(getRecentSongs());
        for (let i = 0; i < recentSongStorage.length; i++) {
            recentSongsCreate(i);
        } 
    }
}

// storing recent played songs when called by songs child
function storeRecentplayedSongs(songs, type, num) {
    // checking if value is 0 song never was played
    if (recentSongStorage.length == 0) {
        recentSongStorage[0] = songs[type][num];
    } else {
        // checking if the song was played before 
        for (let i = 0; i < recentSongStorage.length; i++) {
            if (recentSongStorage[i].songName == songs[type][num].songName) {
                if (recentSongStorage[i].artistName == songs[type][num].artistName) {
                    for (let j = i; j < recentSongStorage.length; j++) {
                        recentSongStorage[j] = recentSongStorage[j + 1];
                    }
                    recentSongStorage.pop();
                }
            }
        }

        // for shifting values backward 
        for (let i = recentSongStorage.length; i > 0; i--) {
            recentSongStorage[i] = recentSongStorage[i - 1];
        }

        recentSongStorage[0] = songs[type][num];

        // to enforce the limit upto only 15 songs allowed 
        if (recentSongStorage.length == 16) {
            recentSongStorage.pop();
        }

    }

    // displaying recent song storage 
    document.querySelector('#recent-container').style.display = 'block';

    // creating the updated list 
    document.querySelector('#recent-container > .sub-container').innerHTML = '';
    for (let i = 0; i < recentSongStorage.length; i++) {
        recentSongsCreate(i);
    }

    // storing the updates 
    setRecentSongs();
}

// function for creating and adding click events to play songs from recent
function recentSongsCreate(val) {

    // creating a child 
    let parent = document.querySelector('#recent-container > .sub-container');
    let child = document.createElement('div');
    child.classList.add('recent-item');
    child.title = recentSongStorage[val].songName + '\nby ' + recentSongStorage[val].artistName;
    child.innerHTML = `<div>
                         <img class="home-song-image" src="${recentSongStorage[val].image}" alt="${recentSongStorage[val].songName}">
                       </div>
                       <div>
                         <div class="home-song-name">${recentSongStorage[val].songName}</div>
                         <div class="home-artist-name">${recentSongStorage[val].artistName}</div>
                       </div>`;
    parent.appendChild(child);

    // assigning an event 
    child.addEventListener('click', () => {
        playerContainer.classList.remove('hide-player-container');
        navbarLinks[1].classList.remove('navlink-active');
        document.querySelector('#player-artist-name').innerHTML = recentSongStorage[val].artistName;
        document.querySelector('#player-image').src = recentSongStorage[val].image;
        document.querySelector('#player-song-name').innerHTML = recentSongStorage[val].songName;
        document.querySelector('#download-song').href = recentSongStorage[val].song;
        document.querySelector('#myAudio').src = recentSongStorage[val].song;
        play();

        currentPlayingSong.songName = recentSongStorage[val].songName;
        currentPlayingSong.artistName = recentSongStorage[val].artistName;

        // for rearranging the order of recently played songs  
        let temp = recentSongStorage[val];
        for (let j = val; j > 0; j--) {
            recentSongStorage[j] = recentSongStorage[j - 1];
        }
        recentSongStorage[0] = temp;

        // now display changes 
        parent.innerHTML = '';
        for (let i = 0; i < recentSongStorage.length; i++) {
            recentSongsCreate(i)
        }

        // setting variables for forward/backward functionality 
        whichList = 0;
        isSongNum = val;
        favSongChecker();
    });
}

// ============================ songs container ================================ 

// generates random numbers for shuffling 
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// shuffle function for shuffling songs 
function shuffle(arrayLength, array) {
    let rand, temp;
    for (let i = 0; i < arrayLength; i++) {
        rand = getRndInteger(0, arrayLength);
        temp = array[rand];
        array[rand] = array[i];
        array[i] = temp;
    }
}

// to fetch json files 
function fetchJson(num, whichArray) {
    let jsonFiles = [
        'https://shivamwdev.github.io/english/english.json',
        'https://shivamwdev.github.io/hindi/hindi.json',
        'https://shivamwdev.github.io/punjabi/punjabi.json',
        'https://shivamwdev.github.io/haryanvi/haryanvi.json'
    ];
    
    fetch(jsonFiles[num])
    .then(function (resp) {
        return resp.json();
    })
    .then(function (data) {
        
        // collecting the fetched data 
        songs[whichArray] = data;
        
        // shuffling the array items 
        shuffle(songs[whichArray].length, songs[whichArray]);
        
        // creating songs container songs childs  
        for (let i = 0; i < songs[whichArray].length; i++) {
            allSongsCreate(num, whichArray, i);
        }
        
        // setting up the player 
        if (whichArray == 0) {
            settingUpPlayer();
        }
        
        
    });
}

// function for creating all selected categories songs with corressponding events
function allSongsCreate(containerType, type, num) {

    // creating the child 
    let parent = document.querySelectorAll('.song-container > .sub-container');
    let child = document.createElement('div');
    child.classList.add('song-item');
    child.title = songs[type][num].songName + '\nby ' + songs[type][num].artistName;
    child.innerHTML = `<div>
                         <img class="home-song-image" src="${songs[type][num].image}" alt="${songs[type][num].songName}">
                       </div>
                       <div>
                         <div class="home-song-name">${songs[type][num].songName}</div>
                         <div class="home-artist-name">${songs[type][num].artistName}</div>
                       </div>`;
    parent[containerType].appendChild(child);

    // adding click events in the child 
    child.addEventListener('click', () => {
        whichList = 1;
        isSongType = type;
        isSongNum = num;
        playerContainer.classList.remove('hide-player-container');
        navbarLinks[1].classList.remove('navlink-active');
        document.querySelector('#player-artist-name').innerHTML = songs[type][num].artistName;
        document.querySelector('#player-image').src = songs[type][num].image;
        document.querySelector('#player-song-name').innerHTML = songs[type][num].songName;
        document.querySelector('#download-song').href = songs[type][num].song;
        document.querySelector('#myAudio').src = songs[type][num].song;

        currentPlayingSong.songName = songs[type][num].songName;
        currentPlayingSong.artistName = songs[type][num].artistName;

        if (songs[type].length == num + 1) {
            if (songs.length == type + 1) {
                document.querySelector('#next-song-indication span').innerHTML = songs[0][0].songName;
            } else {
                document.querySelector('#next-song-indication span').innerHTML = songs[type + 1][0].songName;
            }
        } else {
            document.querySelector('#next-song-indication span').innerHTML = songs[type][num + 1].songName;
        }
        play();
        storeRecentplayedSongs(songs, type, num);
        favSongChecker();
    });
}


// ============================================ search section ============================================

// to hide search container 
closeSearch.addEventListener('click', () => {
    document.getElementById('search-container').style.top = '120%';
    navbarLinks[2].classList.remove('navlink-active');
});

// to hide search container 
document.getElementById('close-searh-container').addEventListener('click', () => {
    document.getElementById('search-container').style.top = '120%';
    navbarLinks[2].classList.remove('navlink-active');
});

// to clear the input text 
document.getElementById('clear-text').addEventListener('click', () => {
    document.getElementById('search-song').value = '';
    searchSong();
});

// create searched songs child 
function searchedItem(songs, type, val) {
    let parent = document.getElementById('show-result');
    let child = document.createElement('div');
    child.classList.add('match-item');
    child.innerHTML =
        `
          <div>
            <img class="match-img" src="${songs[type][val].image}" alt="${songs[type][val].songName}">
          </div>
          <div>
            <div class="match-song">${songs[type][val].songName}</div>
            <div class="match-artist">${songs[type][val].artistName}</div>
          </div>
    `;

    parent.appendChild(child);

    // adding a click event to it 
    child.addEventListener('click', () => {
        playerContainer.classList.remove('hide-player-container');
        navbarLinks[2].classList.remove('navlink-active');
        document.querySelector('#player-artist-name').innerHTML = songs[type][val].artistName;
        document.querySelector('#player-image').src = songs[type][val].image;
        document.querySelector('#player-song-name').innerHTML = songs[type][val].songName;
        document.querySelector('#download-song').href = songs[type][val].song;
        document.querySelector('#myAudio').src = songs[type][val].song;

        currentPlayingSong.songName = songs[type][val].songName;
        currentPlayingSong.artistName = songs[type][val].artistName;

        play();
        storeRecentplayedSongs(songs, type, val);
        favSongChecker();
    });
}

// function for searching the songs
function searchSong() {
    let inputValue = document.getElementById('search-song');

    document.getElementById('show-result').innerHTML = '';

    // for all songs 
    for (let i = 0; i < songs.length; i++) {
        for (let j = 0; j < songs[i].length; j++) {
            if ((songs[i][j].songName.toUpperCase().indexOf(inputValue.value.toUpperCase()) != -1) || (songs[i][j].artistName.toUpperCase().indexOf(inputValue.value.toUpperCase()) != -1)) {
                searchedItem(songs, i, j);
            }
        }
    }

    // from mood mix  
    for (let i = 0; i < moodMixSongsContainer.length; i++) {
        for (let j = 0; j < moodMixSongsContainer[i].length; j++) {
            if ((moodMixSongsContainer[i][j].songName.toUpperCase().indexOf(inputValue.value.toUpperCase()) != -1) || (moodMixSongsContainer[i][j].artistName.toUpperCase().indexOf(inputValue.value.toUpperCase()) != -1)) {
                searchedItem(moodMixSongsContainer, i, j);
            }
        }
    }

    // clearing the output 
    if (inputValue.value == '' || document.getElementById('show-result').innerHTML == '') {
        document.getElementById('show-result').innerHTML = '<div style="text-align: center;font-size: 1.5rem;padding: 2rem 0;color: red;">no match found :(</div>';
    }
}

document.getElementById('search-song').addEventListener('input', searchSong);

// ========================= about me section =========================

// ======================== function for storing fav songs ======================== 

// function for setting the fav songs locally
function setFavSongs() {
    localStorage.setItem('FAVSONGS', JSON.stringify(favSongContainer));
}

// function for getting songs from local
function getFavSongs() {
    favSongContainer = JSON.parse(localStorage.getItem('FAVSONGS')) || [];
}

// for finding which is being liked 
function whichSong() {

    // for all songs 
    for (let i = 0; i < songs.length; i++) {
        for (let j = 0; j < songs[i].length; j++) {
            if (currentPlayingSong.songName == songs[i][j].songName && currentPlayingSong.artistName == songs[i][j].artistName) {
                return songs[i][j];
            }
        }
    }

    // for mood mix container 
    for (let i = 0; i < moodMixSongsContainer.length; i++) {
        for (let j = 0; j < moodMixSongsContainer[i].length; j++) {
            if (currentPlayingSong.songName == moodMixSongsContainer[i][j].songName && currentPlayingSong.artistName == moodMixSongsContainer[i][j].artistName) {
                return moodMixSongsContainer[i][j];
            }
        }
    }
}

// create fav songs child function
function createFavSongs() {
    let parent = document.getElementById('fav-list');
    parent.innerHTML = '';
    for (let i = 0; i < favSongContainer.length; i++) {

        // creating child and adding to its container 
        let child = document.createElement('div');
        child.classList.add('fav-song');
        child.title = favSongContainer[i].songName + ' \nby ' + favSongContainer[i].artistName;
        child.innerHTML = `
                        <div>
                            <img class="fav-song-images" src="${favSongContainer[i].image}" alt="${favSongContainer[i].artistName}">
                        </div>
                        <div>
                            <div class="fav-song-name">${favSongContainer[i].songName}</div>
                            <div class="fav-artist-name">${favSongContainer[i].artistName}</div>
                        </div>
        `;
        parent.appendChild(child);

        // now adding the event to it 
        child.addEventListener('click', () => {
            playerContainer.classList.remove('hide-player-container');
            navbarLinks[3].classList.remove('navlink-active');
            document.querySelector('#player-artist-name').innerHTML = favSongContainer[i].artistName;
            document.querySelector('#player-image').src = favSongContainer[i].image;
            document.querySelector('#player-song-name').innerHTML = favSongContainer[i].songName;
            document.querySelector('#download-song').href = favSongContainer[i].song;
            document.querySelector('#myAudio').src = favSongContainer[i].song;
            play();
            currentPlayingSong.songName = favSongContainer[i].songName;
            currentPlayingSong.artistName = favSongContainer[i].artistName;
            favSongChecker();
            whichList = 3;
            isSongNum = i;

            // checking if recent song container is empty
            if (recentSongStorage.length == 0) {
                recentSongStorage[0] = favSongContainer[i];
            } else {
                // checking if the song was played before 
                for (let i = 0; i < recentSongStorage.length; i++) {
                    if (recentSongStorage[i].songName == favSongContainer[i].songName) {
                        if (recentSongStorage[i].artistName == favSongContainer[i].artistName) {
                            for (let j = i; j < recentSongStorage.length; j++) {
                                recentSongStorage[j] = recentSongStorage[j + 1];
                            }
                            recentSongStorage.pop();
                        }
                    }
                }

                // for shifting values backward 
                for (let i = recentSongStorage.length; i > 0; i--) {
                    recentSongStorage[i] = recentSongStorage[i - 1];
                }

                recentSongStorage[0] = favSongContainer[i];

                // to enforce the limit upto only 15 songs allowed 
                if (recentSongStorage.length == 16) {
                    recentSongStorage.pop();
                }

            }

            // displaying recent song storage 
            document.querySelector('#recent-container').style.display = 'block';

            // creating the updated list 
            document.querySelector('#recent-container > .sub-container').innerHTML = '';
            for (let i = 0; i < recentSongStorage.length; i++) {
                recentSongsCreate(i);
            }

            // storing the updates 
            setRecentSongs();
        });
    }
    if (parent.innerHTML == '') {
        parent.innerHTML = `<div id="no-fav-song">
            you haven't liked any songs yet :( <br> click <i class="far fa-heart"></i> in player's section to add the songs here :)
        </div>`;
        whichList = 1;
        isSongNum = 0;
    }
}

// to check if song is liked
function favSongChecker() {

    // frontend changes reset
    toggleFavSong.classList.remove('fa-solid');
    toggleFavSong.classList.add('far');

    for (let i = 0; i < favSongContainer.length; i++) {
        if (currentPlayingSong.songName == favSongContainer[i].songName && currentPlayingSong.artistName == favSongContainer[i].artistName) {
            // frontend changes 
            toggleFavSong.classList.remove('far');
            toggleFavSong.classList.add('fa-solid');
        }
    }
}

// click event for heart shape song 
toggleFavSong.addEventListener('click', () => {

    if (toggleFavSong.classList.contains('far')) {
        // frontend changes 
        toggleFavSong.classList.remove('far');
        toggleFavSong.classList.add('fa-solid');

        // backend changes 
        if (favSongContainer.length == 0) {
            favSongContainer[0] = whichSong();
        } else {
            for (let i = favSongContainer.length; i > 0; i--) {
                favSongContainer[i] = favSongContainer[i - 1];
            }
            favSongContainer[0] = whichSong();
        }

    } else {
        // frontend changes 
        toggleFavSong.classList.remove('fa-solid');
        toggleFavSong.classList.add('far');

        // backend changes 
        for (let i = 0; i < favSongContainer.length; i++) {
            if (currentPlayingSong.songName == favSongContainer[i].songName && currentPlayingSong.artistName == favSongContainer[i].artistName) {
                for (let j = i; j < favSongContainer.length; j++) {
                    favSongContainer[j] = favSongContainer[j + 1];
                }
                favSongContainer.pop();
            }
        }

    }
    createFavSongs();
    setFavSongs();
});

// ======================= mood mix songs section ======================= 

// function for fetching json files 
function moodMixJsonFetch(val) {
    let jsonFiles = [
        'https://shivamwdev.github.io/gym-mode/gymmode.json',
        'https://shivamwdev.github.io/moodmix/moodmix.json'
    ];

    fetch(jsonFiles[val])
        .then(resp => resp.json())
        .then((data) => {
            moodMixSongsContainer[val] = data;      //storing the moodmix songs in container 

            // variable for creating click event 
            let playItem = document.getElementsByClassName('play-item');

            // for mood mix section 
            for (let i = 0; i < moodMixItem.length; i++) {
                moodMixItem[i].addEventListener('click', () => {

                    // these two lines change the img and name of artist header section 
                    document.getElementById('artist-image').src = document.getElementsByClassName('mood-img')[i].src;
                    document.getElementById('artist-name').innerHTML = document.getElementsByClassName('mood-title')[i].innerHTML;

                    // displaying the moodmix container 
                    document.getElementById('artist-song-container').classList.remove('hide-player-container');

                    // clearing the parent container 
                    document.getElementById('artist-songs-list-container').innerHTML = '';

                    // calling to create child in mood mix 
                    for (let j = 0; j < moodMixSongsContainer[i].length; j++) {
                        createMoodMixItem(i, j);

                        // now adding a click on event for playing songs                 
                        playItem[j].addEventListener('click', () => {
                            playerContainer.classList.remove('hide-player-container');
                            navbarLinks[1].classList.remove('navlink-active');
                            navbarLinks[3].classList.add('navlink-active');
                            document.querySelector('#player-artist-name').innerHTML = moodMixSongsContainer[i][j].artistName;
                            document.querySelector('#player-image').src = moodMixSongsContainer[i][j].image;
                            document.querySelector('#player-song-name').innerHTML = moodMixSongsContainer[i][j].songName;
                            document.querySelector('#download-song').href = moodMixSongsContainer[i][j].song;
                            document.querySelector('#myAudio').src = moodMixSongsContainer[i][j].song;

                            // storing the current playing song 
                            currentPlayingSong.songName = moodMixSongsContainer[i][j].songName;
                            currentPlayingSong.artistName = moodMixSongsContainer[i][j].artistName;

                            play();
                            favSongChecker();
                            isSongType = i;
                            isSongNum = j;
                            storeRecentplayedSongs(moodMixSongsContainer, isSongType, isSongNum);
                            whichList = 4;
                        });
                    }
                });
            }

            // for opening moodmix songs from drop list  
            let dropItem = document.getElementsByClassName('drop-item');

            for (let i = 1; i < 3; i++) {
                dropItem[i].addEventListener('click', () => {
                    // these two lines change the img and name of artist header section 
                    document.getElementById('artist-image').src = document.getElementsByClassName('mood-img')[i - 1].src;
                    document.getElementById('artist-name').innerHTML = document.getElementsByClassName('mood-title')[i - 1].innerHTML;

                    // displaying the moodmix container 
                    document.getElementById('artist-song-container').classList.remove('hide-player-container');

                    // clearing the parent container 
                    document.getElementById('artist-songs-list-container').innerHTML = '';

                    // calling to create child in mood mix 
                    for (let j = 0; j < moodMixSongsContainer[i - 1].length; j++) {
                        createMoodMixItem(i - 1, j);

                        // now adding a click on event for playing songs                 
                        playItem[j].addEventListener('click', () => {
                            playerContainer.classList.remove('hide-player-container');
                            navbarLinks[1].classList.remove('navlink-active');
                            navbarLinks[3].classList.add('navlink-active');
                            document.querySelector('#player-artist-name').innerHTML = moodMixSongsContainer[i - 1][j].artistName;
                            document.querySelector('#player-image').src = moodMixSongsContainer[i - 1][j].image;
                            document.querySelector('#player-song-name').innerHTML = moodMixSongsContainer[i - 1][j].songName;
                            document.querySelector('#download-song').href = moodMixSongsContainer[i - 1][j].song;
                            document.querySelector('#myAudio').src = moodMixSongsContainer[i - 1][j].song;

                            // storing the current playing song 
                            currentPlayingSong.songName = moodMixSongsContainer[i - 1][j].songName;
                            currentPlayingSong.artistName = moodMixSongsContainer[i - 1][j].artistName;

                            play();
                            favSongChecker();
                            isSongType = i - 1 ;
                            isSongNum = j;
                            storeRecentplayedSongs(moodMixSongsContainer, isSongType, isSongNum);
                            whichList = 4;
                        });
                    }
                });
            }
        });
}

// function for calling json files for mood mix 
for (let i = 0; i < moodMixItem.length; i++) {
    moodMixJsonFetch(i);
}

// function for creating moodmix song child 
function createMoodMixItem(type, val) {
    let parent = document.getElementById('artist-songs-list-container');
    let child = document.createElement('div');
    child.classList.add('mix-item');
    child.innerHTML = 
    `<div class="play-item">
        <div>
            <img src="${moodMixSongsContainer[type][val].image}" alt="${moodMixSongsContainer[type][val].songName}" class="mix-img">
        </div>
        <div class="mix-song-detail">
            <div class="mix-song-name">${moodMixSongsContainer[type][val].songName}</div>
            <div class="mix-artist-name">${moodMixSongsContainer[type][val].artistName}</div>
        </div>
    </div>
    <div class="mix-download">
        <a href="${moodMixSongsContainer[type][val].song}" download="" class="fas fa-download"></a>
    </div>`;

    parent.appendChild(child);

}

// ======================== changing the categories ======================== 

// for changing the categories 
document.getElementById('categories').addEventListener('change', () => {
    let updateInput = document.getElementsByClassName('updt-categories');
    for (let i = 0; i < updateInput.length; i++) {
        if (updateInput[i].checked) {
            document.getElementById('save-changes').classList.remove('disabled-link');
            break;
        } else {
            document.getElementById('save-changes').classList.add('disabled-link');
        }
    }
});

// for saving the changes in the categories button event
document.getElementById('save-changes').addEventListener('click', () => {
    let updateInput = document.getElementsByClassName('updt-categories');
    let value = [];

    for (let i = 0; i < updateInput.length; i++) {
        value[i] = updateInput[i].checked;
    }

    localStorage.setItem('CATEGORIES', JSON.stringify(value));

    location.reload();
})

// ============================= for delete account ============================= 

// for displaying the delete account warning 
document.getElementById('delete-account').addEventListener('click', () => {
    document.getElementById('delete-account-container').style.display = 'flex';
});

// for hiding the delete pop up 
document.getElementById('btn-cancel').addEventListener('click', () => {
    document.getElementById('delete-account-container').style.display = 'none';
});

// delete button for deleting the user details 
document.getElementById('btn-delete').addEventListener('click', () => {
    localStorage.removeItem("USERNAME");
    localStorage.removeItem('CATEGORIES');
    localStorage.removeItem('RECENTSONGLIST');
    localStorage.removeItem('FAVSONGS');
    location.reload();
});

// =========================== moodmix section ===========================

// to close moodmix container 
document.getElementById('close-artist').addEventListener('click', () => {
    artistSongContainer.classList.add('hide-player-container');
})

// ============================== Player's section ==============================

// function for play the song without getting errors 
function play() {
    var playPromise = myAudio.play();
    isPlay = true;
    playPauseButton.classList = 'fas fa-pause-circle';

    if (playPromise !== undefined) {
        playPromise.then(_ => { })
            .catch(error => { });
    }

}

// function for pause the song 
function pause() {
    myAudio.pause();
    playPauseButton.classList = 'fas fa-play-circle';
    isPlay = false;
}

// add zero function 
function addZero(value) {
    if (value < 10) {
        return '0' + value;
    }
    return value;
}

// progress bar functions
function progressTimer() {
    document.getElementById('right-timer').innerHTML = `${addZero(Math.floor(myAudio.duration / 60))} : ${addZero(Math.floor(myAudio.duration % 60))}`;
    document.getElementById('left-timer').innerHTML = `${addZero(Math.floor(myAudio.currentTime / 60))} : ${addZero(Math.floor(myAudio.currentTime % 60))}`
}

// timer for continuous playing songs 
setInterval(() => {
    progress.value = (myAudio.currentTime / myAudio.duration) * 100;
    progressTimer();
    progress.addEventListener('input', () => {
        myAudio.currentTime = (progress.value * myAudio.duration) / 100;
    });
}, 100);

// setting up the first song in the player 
function settingUpPlayer() {
    if (recentSongStorage.length) {
        // set first song into the player from recent container
        document.querySelector('#player-artist-name').innerHTML = recentSongStorage[0].artistName;
        document.querySelector('#player-image').src = recentSongStorage[0].image;
        document.querySelector('#player-song-name').innerHTML = recentSongStorage[0].songName;
        document.querySelector('#download-song').href = recentSongStorage[0].song;
        document.querySelector('#myAudio').src = recentSongStorage[0].song;
        currentPlayingSong.songName = recentSongStorage[0].songName;
        currentPlayingSong.artistName = recentSongStorage[0].artistName;

        if (isSongNum + 1 == recentSongStorage.length) {
            document.querySelector('#next-song-indication span').innerHTML = recentSongStorage[0].songName;
        } else {
            document.querySelector('#next-song-indication span').innerHTML = recentSongStorage[isSongNum + 1].songName;
        }
        // for forwarding/backwarding the the songs 
        whichList = 0;
    } else {
        // set first song into the player from songs container
        document.querySelector('#player-artist-name').innerHTML = songs[0][0].artistName;
        document.querySelector('#player-image').src = songs[0][0].image;
        document.querySelector('#player-song-name').innerHTML = songs[0][0].songName;
        document.querySelector('#download-song').href = songs[0][0].song;
        document.querySelector('#myAudio').src = songs[0][0].song;
        document.querySelector('#next-song-indication span').innerHTML = songs[0][1].songName;

        currentPlayingSong.songName = songs[0][0].songName;
        currentPlayingSong.artistName = songs[0][0].artistName;

        // for forwarding/backwarding the the songs 
        whichList = 1;
    }
}

// function for toggle play mode (shuffle/repeat/repeatAll)
playMode.addEventListener('click', () => {
    if (playMode.classList.contains('fa-arrows-repeat-1')) {
        playMode.classList.remove('fa-arrows-repeat-1');
        playMode.classList.add('fa-shuffle');
        whichPlayMode = 'shuffle';
    } 
    else if(playMode.classList.contains('fa-shuffle')) {
        playMode.classList.remove('fa-shuffle');
        playMode.classList.add('fa-arrows-repeat');
        whichPlayMode = 'repeat-all';
    }
    else if(playMode.classList.contains('fa-arrows-repeat')){
        playMode.classList.remove('fa-arrows-repeat');
        playMode.classList.add('fa-arrows-repeat-1')
        whichPlayMode = 'repeat';
    }
});

// function for playing next song 
function nextSong() {

    // for recent songs 
    if (whichList == 0) {
        isSongNum++;
        if (isSongNum == recentSongStorage.length) {
            isSongNum = 0;
        }

        // for checking which play mode should play 
        if (whichPlayMode == 'shuffle') {
            isSongNum = getRndInteger(0, recentSongStorage.length)
        }

        document.querySelector('#player-artist-name').innerHTML = recentSongStorage[isSongNum].artistName;
        document.querySelector('#player-image').src = recentSongStorage[isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = recentSongStorage[isSongNum].songName;
        document.querySelector('#download-song').href = recentSongStorage[isSongNum].song;
        document.querySelector('#myAudio').src = recentSongStorage[isSongNum].song;
        currentPlayingSong.songName = recentSongStorage[isSongNum].songName;
        currentPlayingSong.artistName = recentSongStorage[isSongNum].artistName;
        play();
        if (isSongNum + 1 == recentSongStorage.length) {
            document.querySelector('#next-song-indication span').innerHTML = recentSongStorage[0].songName;
        } else {
            document.querySelector('#next-song-indication span').innerHTML = recentSongStorage[isSongNum + 1].songName;
        }
    }

    // for all songs 
    else if (whichList == 1) {
        isSongNum++;
        if (isSongNum == songs[isSongType].length) {
            isSongNum = 0;
            isSongType++;
            if (isSongType == songs.length) {
                isSongType = 0;
            }
        }

        // for checking which play mode should play 
        if (whichPlayMode == 'shuffle') {
            isSongType = getRndInteger(0, songs.length);
            isSongNum = getRndInteger(0, songs[isSongType].length);
        }

        document.querySelector('#player-artist-name').innerHTML = songs[isSongType][isSongNum].artistName;
        document.querySelector('#player-image').src = songs[isSongType][isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = songs[isSongType][isSongNum].songName;
        document.querySelector('#download-song').href = songs[isSongType][isSongNum].song;
        document.querySelector('#myAudio').src = songs[isSongType][isSongNum].song;
        currentPlayingSong.songName = songs[isSongType][isSongNum].songName;
        currentPlayingSong.artistName = songs[isSongType][isSongNum].artistName;
        play();
        storeRecentplayedSongs(songs, isSongType, isSongNum);
        if (isSongNum + 1 == songs[isSongType].length) {
            if (isSongType + 1 == songs.length) {
                document.querySelector('#next-song-indication span').innerHTML = songs[0][0].songName;
            } else {
                document.querySelector('#next-song-indication span').innerHTML = songs[isSongType + 1][0].songName;
            }
        } else {
            document.querySelector('#next-song-indication span').innerHTML = songs[isSongType][isSongNum + 1].songName;
        }
    }

    // for search songs 
    else if (whichList == 2) {

    } 

    // for favourite songs 
    else if (whichList == 3) {
        isSongNum++;
        if (isSongNum == favSongContainer.length) {
            isSongNum = 0;
        }

        // for checking which play mode should play 
        if (whichPlayMode == 'shuffle') {
            isSongNum = getRndInteger(0, favSongContainer.length)
        }

        document.querySelector('#player-artist-name').innerHTML = favSongContainer[isSongNum].artistName;
        document.querySelector('#player-image').src = favSongContainer[isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = favSongContainer[isSongNum].songName;
        document.querySelector('#download-song').href = favSongContainer[isSongNum].song;
        document.querySelector('#myAudio').src = favSongContainer[isSongNum].song;
        play();
        currentPlayingSong.songName = favSongContainer[isSongNum].songName;
        currentPlayingSong.artistName = favSongContainer[isSongNum].artistName;
        if (isSongNum + 1 == favSongContainer.length) {
            document.querySelector('#next-song-indication span').innerHTML = favSongContainer[0].songName;
        } else {
            document.querySelector('#next-song-indication span').innerHTML = favSongContainer[isSongNum + 1].songName;
        }
    }

    // for mood mix songs 
    else if(whichList == 4){
        isSongNum++;
        if (isSongNum == moodMixSongsContainer[isSongType].length) {
            isSongNum = 0;
        }
        
        // for checking which play mode should play 
        if (whichPlayMode == 'shuffle') {
            isSongNum = getRndInteger(0, moodMixSongsContainer[isSongType].length);
        }

        document.querySelector('#player-artist-name').innerHTML = moodMixSongsContainer[isSongType][isSongNum].artistName;
        document.querySelector('#player-image').src = moodMixSongsContainer[isSongType][isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = moodMixSongsContainer[isSongType][isSongNum].songName;
        document.querySelector('#download-song').href = moodMixSongsContainer[isSongType][isSongNum].song;
        document.querySelector('#myAudio').src = moodMixSongsContainer[isSongType][isSongNum].song;
        play();
        currentPlayingSong.songName = moodMixSongsContainer[isSongType][isSongNum].songName;
        currentPlayingSong.artistName = moodMixSongsContainer[isSongType][isSongNum].artistName;
        storeRecentplayedSongs(moodMixSongsContainer, isSongType, isSongNum);
        if (isSongNum + 1 == moodMixSongsContainer[isSongType].length) {
            document.querySelector('#next-song-indication span').innerHTML = moodMixSongsContainer[isSongType][0].songName;
        } else {
            document.querySelector('#next-song-indication span').innerHTML = moodMixSongsContainer[isSongType][isSongNum + 1].songName;
        }
    }

    // for checking if the song is liked or not 
    favSongChecker();
}

// for playing previous Songs 
function previousSong() {

    // for recent container 
    if (whichList == 0) {
        document.querySelector('#next-song-indication span').innerHTML = document.querySelector('#player-song-name').innerHTML;
        isSongNum--;
        if (isSongNum == -1) {
            isSongNum = recentSongStorage.length - 1;
        }

        // for checking which play mode should play 
        if (whichPlayMode == 'shuffle') {
            isSongNum = getRndInteger(0, recentSongStorage.length)
        }

        document.querySelector('#player-artist-name').innerHTML = recentSongStorage[isSongNum].artistName;
        document.querySelector('#player-image').src = recentSongStorage[isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = recentSongStorage[isSongNum].songName;
        document.querySelector('#download-song').href = recentSongStorage[isSongNum].song;
        document.querySelector('#myAudio').src = recentSongStorage[isSongNum].song;
        play();
        currentPlayingSong.songName = recentSongStorage[isSongNum].songName;
        currentPlayingSong.artistName = recentSongStorage[isSongNum].artistName;
    } 

    // for all songs 
    else if (whichList == 1) {
        document.querySelector('#next-song-indication span').innerHTML = document.querySelector('#player-song-name').innerHTML;
        isSongNum--;
        if (isSongNum == -1) {
            isSongType--;
            if (isSongType == -1) {
                isSongType = songs.length - 1;
            }
            isSongNum = songs[isSongType].length - 1;
        }
        
        // for checking which play mode should play 
        if (whichPlayMode == 'shuffle') {
            isSongType = getRndInteger(0, songs.length)
            isSongNum = getRndInteger(0, songs[isSongType].length)
        }

        document.querySelector('#player-artist-name').innerHTML = songs[isSongType][isSongNum].artistName;
        document.querySelector('#player-image').src = songs[isSongType][isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = songs[isSongType][isSongNum].songName;
        document.querySelector('#download-song').href = songs[isSongType][isSongNum].song;
        document.querySelector('#myAudio').src = songs[isSongType][isSongNum].song;
        play();
        currentPlayingSong.songName = songs[isSongType][isSongNum].songName;
        currentPlayingSong.artistName = songs[isSongType][isSongNum].artistName;
        storeRecentplayedSongs(songs, isSongType, isSongNum);
    } 

    // for search songs 
    else if (whichList == 2) {

    } 

    // for favourite songs 
    else if (whichList == 3) {
        document.querySelector('#next-song-indication span').innerHTML = document.querySelector('#player-song-name').innerHTML;
        isSongNum--;
        if (isSongNum == -1) {
            isSongNum = favSongContainer.length - 1;
        }

        // for checking which play mode should play 
        if (whichPlayMode == 'shuffle') {
            isSongNum = getRndInteger(0, favSongContainer.length)
        }

        document.querySelector('#player-artist-name').innerHTML = favSongContainer[isSongNum].artistName;
        document.querySelector('#player-image').src = favSongContainer[isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = favSongContainer[isSongNum].songName;
        document.querySelector('#download-song').href = favSongContainer[isSongNum].song;
        document.querySelector('#myAudio').src = favSongContainer[isSongNum].song;
        play();
        currentPlayingSong.songName = favSongContainer[isSongNum].songName;
        currentPlayingSong.artistName = favSongContainer[isSongNum].artistName;
    }

    // for mood mix container 
    else if(whichList == 4){
        document.querySelector('#next-song-indication span').innerHTML = document.querySelector('#player-song-name').innerHTML;
        isSongNum--;
        if (isSongNum == -1) {
            isSongNum = moodMixSongsContainer[isSongType].length - 1;
        }
        
        // for checking which play mode should play 
        if (whichPlayMode == 'shuffle') {
            isSongNum = getRndInteger(0, moodMixSongsContainer[isSongType].length);
        }

        document.querySelector('#player-artist-name').innerHTML = moodMixSongsContainer[isSongType][isSongNum].artistName;
        document.querySelector('#player-image').src = moodMixSongsContainer[isSongType][isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = moodMixSongsContainer[isSongType][isSongNum].songName;
        document.querySelector('#download-song').href = moodMixSongsContainer[isSongType][isSongNum].song;
        document.querySelector('#myAudio').src = moodMixSongsContainer[isSongType][isSongNum].song;
        play();
        currentPlayingSong.songName = moodMixSongsContainer[isSongType][isSongType].songName;
        currentPlayingSong.artistName = moodMixSongsContainer[isSongType][isSongType].artistName;
        storeRecentplayedSongs(moodMixSongsContainer, isSongType, isSongType);
    }

    // for checking if the song was liked
    favSongChecker();
}

// function calling for player section 

// click event to hide the player 
document.getElementById('close-player-container').addEventListener('click', () => {
    playerContainer.classList.add('hide-player-container');
    navbarLinks[1].classList.remove('navlink-active');
});

// play/pause click event 
playPauseButton.addEventListener('click', () => {
    if (isPlay) {
        pause();
    } else {
        play();
    }
});

document.getElementById('forward-button').addEventListener('click', nextSong);
document.getElementById('backward-button').addEventListener('click', previousSong);

// next song play automatically
myAudio.addEventListener('ended', () => {
    // if the song set to repeat 
    if (whichPlayMode == 'repeat') {
        play();
    }else{
        nextSong();
    }
});

// ========================= function calling goes here =========================  



/* =========================  on window load function   =========================  */
window.addEventListener('load', () => {

    // =========================== header section =========================== 
    // loading container box in loading container and outer circle animation
    document.getElementById('loading-container').style.transform = 'scale(0)';
    document.getElementById('outer-circle').classList.remove('outer-circle');

    // closing the loader 
    document.getElementById('header').style.height = '0';

    // ========================= username section ========================= 

    // getting previously saved user name 
    if (getUserName() != null) {
        username.value = getUserName();
        document.querySelector('#greeting-section > span').innerHTML = getUserName();
        document.getElementById('me-name').innerHTML = getUserName();
        nextButton.classList.remove('disabled-link');
        document.getElementById('m-container').scrollIntoView();
    }

    // ========================= categories section ========================= 

    // check for stored categories 
    getCategories();

    // ========================== home's section ========================

    // ========================== player's section ========================

    // to check if previously stored values inside 
    getFavSongs();

    // if yes then creating corresponding child 
    createFavSongs();

    // to check if player has favourite song 
    favSongChecker();

    // ========================= artist's section =========================
    for (let i = 0; i < artist.length; i++) {
        artist[i].addEventListener('click', () => {
            artistSongContainer.classList.remove('hide-player-container');
        })
    }

});

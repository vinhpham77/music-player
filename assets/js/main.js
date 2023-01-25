const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $('.player');
const cd = $('.cd');
const playlist = $('.playlist');
const audio = $('#audio');
const songHeading = $('header h2');
const thumb = $('.cd-thumb');
const playPauseBtn = $('.btn.btn-toggle-play');
const progress = $('.progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentSongIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeated: false,
    songs: [
        {
            title: 'Tình Yêu Đến Sau',
            singer: 'Myra Trần - Đức Phúc',
            audio: './assets/audio/Tình Yêu Đến Sau - Myra Trần, Đức Phúc - Bài hát, lyrics.mp3',
            img: './assets/img/song1.webp',
        },
        {
            title: 'BABY SAID',
            singer: 'Måneskin',
            audio: './assets/audio/BABY SAID - Måneskin - Bài hát, lyrics.mp3',
            img: './assets/img/babysaid.webp',
        },
        {
            title: 'I Can\'t Go Back To The Way It Was',
            singer: 'The Kid LAROI',
            audio: `./assets/audio/I Can't Go Back To The Way It Was (Intro) - The Kid LAROI - Bài hát, lyrics.mp3`,
            img: './assets/img/icantgo.webp',
        },
        {
            title: 'New York',
            singer: 'Steve Aoki, Regard, mazie',
            audio: './assets/audio/New York ft. mazie - Steve Aoki, Regard, mazie - Bài hát, lyrics.mp3',
            img: './assets/img/newyork.webp',
        },
        {
            title: 'Radio',
            singer: 'Sigala, MNEK',
            audio: './assets/audio/Radio - Sigala, MNEK - Bài hát, lyrics.mp3',
            img: './assets/img/radio.webp',
        },
        {
            title: 'REASON',
            singer: 'Dreamcatcher',
            audio: './assets/audio/REASON - Dreamcatcher - Bài hát, lyrics.mp3',
            img: './assets/img/reason.webp',
        },
        {
            title: 'SHOOTING STAR',
            singer: 'XG',
            audio: './assets/audio/SHOOTING STAR - XG - Bài hát, lyrics.mp3',
            img: './assets/img/shooting.webp',
        },
        {
            title: 'Thói quen',
            singer: 'B Ray',
            audio: './assets/audio/Thói Quen - B Ray - Bài hát, lyrics.mp3',
            img: './assets/img/thoiquen.webp',
        },
        {
            title: 'Titanium',
            singer: 'Megan\'s V3rsion',
            audio: `./assets/audio/Titanium (Megan's V3rsion) - Sia - Bài hát, lyrics.mp3`,
            img: './assets/img/titanium.webp',
        },
        {
            title: 'Xui Hay Vui',
            singer: 'tlinh, MONO, Onionn',
            audio: './assets/audio/Xui Hay Vui - tlinh, MONO, Onionn - Bài hát, lyrics.mp3',
            img: './assets/img/vuixui.webp',
        },
        {
            title: 'Flowers',
            singer: 'Miley Cyrus',
            audio: './assets/audio/flowers.mp3',
            img: './assets/img/flowers.webp',
        },
    ],
    notListenedSongs: [],

    start() {
        this.renderSongs();
        this.loadCurrentSong();
        this.handleEvents();
    },

    renderSongs() {
        let htmls = this.songs.reduce((html, song, index) => {
            let songNode = `<div class="song" data-index="${index}">
                            <div class="thumb" style="background-image: url('${song.img}')"></div>
                            <div class="body">
                                <h3 class="title">${song.title}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>`;
            return html + songNode;
        }, ``);

        playlist.innerHTML = htmls;
    },

    initNotListenedSongs() {
        for (let i = 0; i < this.songs.length; i++) {
            this.notListenedSongs[i] = i;
        }

        this.notListenedSongs.splice(this.currentSongIndex, 1);
    },

    handleEvents() {
        this.handleScrolling();

        // Seeking
        progress.onchange = () => {
            let songPercent =  progress.value;
            let totalSeconds = audio.duration;

            audio.currentTime = totalSeconds / 100 * songPercent;   
        }

        audio.ontimeupdate = () => {
            if (audio.duration) {
                progress.value = audio.currentTime * 100 / audio.duration;
            } else {
                progress.value = 0;
            }        
        },
    

        repeatBtn.onclick = () => {
            this.isRepeated = !this.isRepeated;
            repeatBtn.classList.toggle('active');
        }

        prevBtn.onclick = () => {
            if (this.isRepeated) {
                audio.currentTime = 0;
            } else if (this.isRandom) {
                this.handleLoadingRandomSong();
                this.scrollIntoCurrentSongView();
            } else {
                this.currentSongIndex--;
                if (this.currentSongIndex < 0) {
                    this.currentSongIndex = this.songs.length - 1;
                }
                this.loadCurrentSong();
                this.scrollIntoCurrentSongView();
            }
            audio.play();
            player.classList.add('playing');
            this.isPlaying = true;
        }

        playPauseBtn.onclick = () => {
            if (this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }

            player.classList.toggle('playing');
            this.isPlaying = !this.isPlaying;
        }

        nextBtn.onclick = () => {
            if (this.isRepeated) {
                audio.currentTime = 0;
            } else if (this.isRandom) {
                this.handleLoadingRandomSong();
                this.scrollIntoCurrentSongView();
            } else {
                this.currentSongIndex++;
                if (this.currentSongIndex >= this.songs.length) {
                    this.currentSongIndex = 0;
                }
                this.loadCurrentSong();
                this.scrollIntoCurrentSongView();
            }
            audio.play();
            player.classList.add('playing');
            this.isPlaying = true;
        }

        randomBtn.onclick = () => {
            this.isRandom = !this.isRandom;
            let isActiveRandom = randomBtn.classList.contains('active');

            if(isActiveRandom) {
                randomBtn.classList.remove('active');
            } else {
                randomBtn.classList.add('active');
                let isJustInitialized = this.initNotListenedSongs.length === this.songs.length - 1;
                if (!isJustInitialized) {
                    this.initNotListenedSongs();
                }
            }
        }

        playlist.onclick = (e) => {
            let optionTarget = e.target.closest('.song .option'); 
            let songTarget = e.target.closest('.song:not(.active)');
            
            if (songTarget || optionTarget) {
                if (optionTarget) {
                    alert('Coming soon');
                } else {
                    this.currentSongIndex = songTarget.dataset.index;
                    this.loadCurrentSong();
                    audio.play();
                }
            }
        }
    },

    handleScrolling() {
        let cdWidth = cd.offsetWidth;

        document.onscroll = () => {
            let scrollTop = window.scrollY || document.scrollingElement.scrollTop;
            let newCDWith = (cdWidth - scrollTop) > 0 ? cdWidth - scrollTop : 0;
            cd.style.width = newCDWith + 'px';
        };
    },

    loadCurrentSong() {
        let currentSong = this.songs[this.currentSongIndex];
        let playlistSongs = $$('.playlist .song');
        let activeSong = $('.song.active');
        let currentPlaylistSong = playlistSongs[this.currentSongIndex];

        audio.src = currentSong.audio;
        songHeading.innerText = currentSong.title;
        thumb.style.backgroundImage = `url('${currentSong.img}')`;
        
        activeSong?.classList.remove('active');
        currentPlaylistSong.classList.add('active');
        
        audio.load();
    },


    getRandomIndex() {
        if (this.notListenedSongs.length < 1) {
            this.initNotListenedSongs();
        } 

        return Math.floor(Math.random() * this.notListenedSongs.length);
    },

    handleLoadingRandomSong() {
        let randomIndex = this.getRandomIndex();
        this.currentSongIndex = this.notListenedSongs[randomIndex];
        this.notListenedSongs.splice(randomIndex, 1);
        this.loadCurrentSong();
    },
    scrollIntoCurrentSongView() {
        let scrollOptions;
        let playlistSongs = $$('.playlist .song');
        let currentPlaylistSong = playlistSongs[this.currentSongIndex];

        if (this.currentSongIndex > 2) {
            scrollOptions = {
                behavior: "smooth",
                block: "nearest",
            }
        } else {
            scrollOptions = {
                behavior: "smooth",
                block: "end",
            }
        } 

        currentPlaylistSong.scrollIntoView(scrollOptions);
    }
}

app.start();


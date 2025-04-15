// Optimized and Cleaned Task Manager, Music Player & Motivational Messages

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('monday-btn').classList.add("selected-button");
    showTasks('monday');
    loadTasks();
    populateSongSelector();
    startTypingAnimation();
});

// Task Manager
function addTask(day) {
    const input = document.getElementById(`${day}-task-input`);
    const list = document.getElementById(`${day}-task-list`);
    const value = input.value.trim();

    if (value) {
        const li = createTaskElement(value);
        list.appendChild(li);
        saveTasks();
        input.value = "";
    }
}

function createTaskElement(text) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.textContent = text;

    li.addEventListener('mouseenter', () => {
        li.title = 'Double-click to delete';
        li.style.cursor = 'pointer';
        li.style.transform = 'scale(1.05)';
        li.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });

    li.addEventListener('mouseleave', () => {
        li.title = '';
        li.style.transform = 'scale(1)';
        li.style.boxShadow = 'none';
    });

    li.addEventListener('dblclick', () => {
        li.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        li.style.transform = 'scale(0.5)';
        li.style.opacity = '0';
        setTimeout(() => {
            li.remove();
            saveTasks();
        }, 300);
    });

    return li;
}

function showTasks(day) {
    document.querySelectorAll('.task-list-container').forEach(c => c.style.display = 'none');
    document.getElementById(`${day}-tasks`).style.display = 'block';
}

function saveTasks() {
    const tasks = {};
    document.querySelectorAll('.task-list').forEach(list => {
        const day = list.id.split('-')[0];
        tasks[day] = Array.from(list.children).map(item => item.textContent);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    Object.entries(tasks).forEach(([day, items]) => {
        const list = document.getElementById(`${day}-task-list`);
        items.forEach(text => list.appendChild(createTaskElement(text)));
    });
}

document.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("selected-button"));
        button.classList.add("selected-button");
        showTasks(button.dataset.day);
    });
});

// Music Player
const playlist = [
    { name: "enta zaalan menni", path: "enta zaalan menni.mp3" },
    { name: "dream", path: "dream.mp3" },
    { name: "everything, everywhere", path: "everything, everywhere.mp3" },
    { name: "by my side", path: "by my side.mp3" },
    { name: "tout sen va", path: "tout.mp3" },
    { name: "Malik al mawt", path: "malik.mp3" },
    { name: "Jalil", path: "Jalil.mp3" },
    { name: "blue salvia", path: "pryvt   blue salvia  lyrics    YouTube.mp3" },
    { name: "Inazuma Sorrow", path: "Inazuma Sorrow.mp3" },
    { name: "Soft Spot", path: "Soft Spot (Acoustic).mp3" },
    { name: "Devil's Daughter", path: "noname.mp3" },
    { name: "Cupid TwinVer", path: "Cupid' (TwinVer.).mp3" },
    { name: "baby blue", path: "rocco - baby blue (lyrics).mp3" },
    { name: "10' ", path: "Laylow  10  Lyrics   YouTube.mp3" }
];

let currentTrackIndex = 0, isLooping = false;

const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const loopBtn = document.getElementById("loop-btn");
const progressBar = document.getElementById('progress-bar');
const timeDisplay = document.getElementById('time-display');
const currentSongDisplay = document.getElementById('current-song');
const progressContainer = document.getElementById("progress-container");
const musicPlayer = document.getElementById("music-player");
const songSelector = document.getElementById("song-selector");

function playTrack() {
    const track = playlist[currentTrackIndex];
    audio.src = track.path;
    currentSongDisplay.textContent = track.name;
    audio.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function updateProgressBar() {
    if (!audio.duration) return;
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;

    const format = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    timeDisplay.textContent = `${format(audio.currentTime)} / ${format(audio.duration)}`;
}

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        musicPlayer.classList.add("playing");
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        musicPlayer.classList.remove("playing");
    }
});

nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    playTrack();
});

backBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrack();
});

loopBtn.addEventListener('click', () => {
    isLooping = !isLooping;
    audio.loop = isLooping;
    loopBtn.classList.toggle('active', isLooping);
    loopBtn.innerHTML = '<i class="fas fa-redo"></i>';
    loopBtn.style.color = isLooping ? '#FFF' : '';
    loopBtn.style.textShadow = isLooping ? '0 0 5px #d9c5b2, 0 0 15px #d9c5b2' : '';
});

audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('ended', () => isLooping ? playTrack() : nextBtn.click());

progressContainer.addEventListener('click', e => {
    audio.currentTime = (e.offsetX / progressContainer.offsetWidth) * audio.duration;
});

function populateSongSelector() {
    songSelector.innerHTML = '<option value="">Select a song</option>';
    playlist.forEach((track, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = track.name;
        songSelector.appendChild(option);
    });
}

songSelector.addEventListener("change", e => {
    if (e.target.value !== "") {
        currentTrackIndex = +e.target.value;
        playTrack();
    }
});

// Motivational Typing
const messages = [
    "Burp louder next time, Queen, the whole kingdom didn’t hear you 💅👑",
    "I know you can do it, my strong petite nerdy loutre!",
    "My tiny sleepy gremlin, you’re doing amazing. I’m proud of you always.",
    "I dare you not to think about me after reading this 😏",
    "Miss me yet? Don’t worry, I miss you enough for the both of us.",
    "Just checking in to remind you: you're still the best part of my chaos.",
    "You're my adorable mess, snorts, burps, nerdy rants and all.",
    "Bet you’re pretending not to miss me… good luck with that 😘",
    "Babe?", "Baby.....", "Babyyyyyyy....", "......", "Wrong name...",
    "Nothing just like that.",
    "Babe, I bet you're still rolling your eyes at my cheesy lines... and secretly smiling."
];

let messageIndex = 0;
const typingText = document.getElementById("typing-text");

function typeMessage(message, callback) {
    let i = 0;
    typingText.textContent = "";
    const interval = setInterval(() => {
        if (i < message.length) {
            typingText.textContent += message.charAt(i++);
        } else {
            clearInterval(interval);
            setTimeout(() => deleteMessage(callback), 5000);
        }
    }, 100);
}

function deleteMessage(callback) {
    let i = typingText.textContent.length;
    const interval = setInterval(() => {
        if (i > 0) {
            typingText.textContent = typingText.textContent.slice(0, --i);
        } else {
            clearInterval(interval);
            callback();
        }
    }, 50);
}

function startTypingAnimation() {
    typeMessage(messages[messageIndex], () => {
        messageIndex = (messageIndex + 1) % messages.length;
        startTypingAnimation();
    });
}

// Video Mute Button
const video = document.getElementById('background-video');
const muteButton = document.getElementById('mute-btn');

muteButton.addEventListener('click', () => {
    const isMuted = muteButton.getAttribute('data-muted') === 'true';
    video.muted = !isMuted;
    muteButton.setAttribute('data-muted', String(!isMuted));
    muteButton.innerHTML = isMuted
        ? '<i class="fa fa-volume-up"></i>'
        : '<i class="fa-solid fa-volume-xmark"></i>';
});

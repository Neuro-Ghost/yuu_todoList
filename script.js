document.addEventListener("DOMContentLoaded", function () {
    // Task Management Section
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const clearAllBtn = document.getElementById("clear-all-btn");
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Music Player Section
    const audio = document.getElementById('audio');
    const loopBtn = document.getElementById("loop-btn");
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const progressBar = document.getElementById('progress-bar');
    const timeDisplay = document.getElementById('time-display');
    const currentSongDisplay = document.getElementById('current-song');
    const progressContainer = document.getElementById("progress-container");

    // Background Video Section
    const video = document.getElementById("background-video");
    const muteBtn = document.getElementById("mute-btn");
    const muteIcon = muteBtn.querySelector("i");

    // Initialize music playlist
    const playlist = [
        { name: "enta zaalan menni", path: "enta zaalan menni.mp3" },
        { name: "dream", path: "dream.mp3" },
        { name: "everything, everywhere", path: "everything, everywhere.mp3" },
        { name: "by my side", path: "by my side.mp3" },
        { name: "tout sen va", path: "tout.mp3" },
        { name: "Malik al mawt", path: "malik.mp3" },
        { name: "Jalil", path: "Jalil.mp3" },
        { name: "Inazuma Sorrow", path: "Inazuma Sorrow.mp3" },
        { name: "Soft Spot", path: "Soft Spot (Acoustic).mp3" },
        { name: "Devil's Daughter", path: "noname.mp3" },
        { name: "Cupid TwinVer", path: "Cupid' (TwinVer.).mp3" },
        { name: "baby blue", path: "rocco - baby blue (lyrics).mp3" },
        { name: "10' ", path: "LAYLOW - 10'.mp3" }
    ];

    let currentTrackIndex = 0;
    let isLooping = false;
    audio.src = playlist[currentTrackIndex].path;
    currentSongDisplay.textContent = playlist[currentTrackIndex].name;

    // Video mute/unmute functionality
    muteBtn.addEventListener("click", () => {
        if (video.muted) {
            video.muted = false;
            muteIcon.classList.replace("fa-volume-mute", "fa-volume-up");
            muteBtn.setAttribute('data-muted', 'false');
        } else {
            video.muted = true;
            muteIcon.classList.replace("fa-volume-up", "fa-volume-mute");
            muteBtn.setAttribute('data-muted', 'true');
        }
    });

    // Task Management Functions
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll("li").forEach(li => {
            const taskText = li.querySelector("span").textContent;
            const isCompleted = li.classList.contains("completed");
            const selectedDay = li.querySelector(".day-selection").value;
            tasks.push({ text: taskText, completed: isCompleted, day: selectedDay });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        if (tasks) {
            tasks.forEach(task => {
                addTask(task.text, task.completed, task.day);
            });
        }
    }

    function addTask(taskText, isCompleted = false, selectedDay = '') {
        const li = document.createElement("li");
        let dayOptions = daysOfWeek.map(day => {
            return `<option value="${day}" ${day === selectedDay ? 'selected' : ''}>${day}</option>`;
        }).join('');
        
        li.innerHTML = `
            <div class="flex justify-between items-center">
                <select class="day-selection">${dayOptions}</select>
                <span>${taskText}</span>
                <br>
                <button class="complete-btn">Completed</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
        if (isCompleted) {
            li.classList.add("completed");
        }

        const daySelection = li.querySelector(".day-selection");
        daySelection.addEventListener("change", function () {
            saveTasks();
        });

        const completeBtn = li.querySelector(".complete-btn");
        completeBtn.addEventListener("click", function () {
            li.classList.toggle("completed");
            saveTasks();
        });

        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function () {
            li.remove();
            saveTasks();
        });

        saveTasks();
    }

    addTaskBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTask(taskText);
            taskInput.value = "";
        }
    });

    clearAllBtn.addEventListener("click", function () {
        taskList.querySelectorAll("li").forEach(li => li.remove());
        localStorage.removeItem("tasks");
    });

    loadTasks();

    // Music Player Controls
    function playTrack() {
        audio.src = playlist[currentTrackIndex].path;
        audio.play();
        currentSongDisplay.textContent = playlist[currentTrackIndex].name;
    }

    function updateProgressBar() {
        const progress = (audio.currentTime / audio.duration) * 100 || 0;
        progressBar.style.width = progress + '%';

        const currentMinutes = Math.floor(audio.currentTime / 60);
        const currentSeconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
        const durationMinutes = Math.floor(audio.duration / 60);
        const durationSeconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
        timeDisplay.textContent = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
    }

    playPauseBtn.addEventListener("click", function () {
        if (audio.paused) {
            playTrack();
        } else {
            audio.pause();
        }
    });

    nextBtn.addEventListener("click", function () {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        playTrack();
    });

    backBtn.addEventListener("click", function () {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        playTrack();
    });

    audio.addEventListener("timeupdate", updateProgressBar);

    // Start playing music when page is loaded
    playTrack();
});

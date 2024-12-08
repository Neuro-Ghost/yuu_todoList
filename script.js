// Task Manager Logic
document.addEventListener('DOMContentLoaded', () => {
    showTasks('monday'); // Show Monday's task list by default
    loadTasks(); // Load saved tasks from localStorage
});

// Add task functionality
function addTask(day) {
    const taskInput = document.getElementById(`${day}-task-input`);
    const taskList = document.getElementById(`${day}-task-list`);
    const taskValue = taskInput.value.trim();

    if (taskValue !== "") {
        const li = document.createElement('li');
        li.classList.add('task-item'); // Add a class for styling

        // Create the task content
        li.textContent = taskValue;

        // Add hover indicator
        li.addEventListener('mouseenter', () => {
            li.setAttribute('title', 'Double-click to delete');
            li.style.cursor = 'pointer';
            li.style.transform = 'scale(1.05)';
            li.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });

        li.addEventListener('mouseleave', () => {
            li.removeAttribute('title');
            li.style.transform = 'scale(1)';
            li.style.boxShadow = 'none';
        });

        // Add double-click functionality to remove the task
        li.addEventListener('dblclick', () => {
            li.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            li.style.transform = 'scale(0.5)';
            li.style.opacity = '0';
            setTimeout(() => {
                li.remove(); // Remove after animation
                // Save tasks after removal
                saveTasks();
            }, 300);
        });

        // Append the task item to the task list
        taskList.appendChild(li);

        // Save tasks after addition
        saveTasks();

        // Clear the input field after adding the task
        taskInput.value = "";
    }
}

// Show tasks for a specific day
function showTasks(day) {
    // Hide all task lists
    const taskLists = document.querySelectorAll('.task-list');
    taskLists.forEach(taskList => taskList.style.display = 'none');

    // Show the selected task list
    document.getElementById(`${day}-tasks`).style.display = 'block';
}

// Save tasks to localStorage
function saveTasks() {
    const taskLists = document.querySelectorAll('.task-list');
    const allTasks = {};

    // Loop through each day and get its tasks
    taskLists.forEach(list => {
        const day = list.id.split('-')[0];
        const tasks = [];

        const taskItems = list.querySelectorAll('li');
        taskItems.forEach(item => {
            tasks.push(item.textContent);
        });

        allTasks[day] = tasks;
    });

    // Save the task data to localStorage
    localStorage.setItem('tasks', JSON.stringify(allTasks));
}

// Load tasks from localStorage
function loadTasks() {
    // Get the tasks data from localStorage
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));

    if (savedTasks) {
        // Loop through the saved tasks and display them
        for (const day in savedTasks) {
            const taskList = document.getElementById(`${day}-task-list`);

            if (taskList) {
                savedTasks[day].forEach(task => {
                    const li = document.createElement('li');
                    li.classList.add('task-item');
                    li.textContent = task;

                    // Add hover indicator and delete functionality
                    li.addEventListener('mouseenter', () => {
                        li.setAttribute('title', 'Double-click to delete');
                        li.style.cursor = 'pointer';
                        li.style.transform = 'scale(1.05)';
                        li.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    });

                    li.addEventListener('mouseleave', () => {
                        li.removeAttribute('title');
                        li.style.transform = 'scale(1)';
                        li.style.boxShadow = 'none';
                    });

                    // Add double-click functionality to remove the task
                    li.addEventListener('dblclick', () => {
                        li.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                        li.style.transform = 'scale(0.5)';
                        li.style.opacity = '0';
                        setTimeout(() => {
                            li.remove(); // Remove after animation
                            // Save tasks after removal
                            saveTasks();
                        }, 300);
                    });

                    // Append the task item to the task list
                    taskList.appendChild(li);
                });
            }
        }
    }
}

// Highlight selected day tasks
document.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
        // Remove the "selected-button" class from all buttons
        document.querySelectorAll(".tab-button").forEach(btn => {
            btn.classList.remove("selected-button");
        });

        // Add the "selected-button" class to the clicked button
        button.classList.add("selected-button");

        // Display tasks for the selected day
        const day = button.getAttribute("data-day");
        showTasks(day);
    });
});

// Example: Call this function with the selected day
document.getElementById('monday-btn').addEventListener('click', () => showTasks('monday'));
document.getElementById('tuesday-btn').addEventListener('click', () => showTasks('tuesday'));
document.getElementById('wednesday-btn').addEventListener('click', () => showTasks('wednesday'));
document.getElementById('thursday-btn').addEventListener('click', () => showTasks('thursday'));
document.getElementById('friday-btn').addEventListener('click', () => showTasks('friday'));

// Music Player Logic
const songs = [
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
    {name: "baby blue", path: "rocco - baby blue (lyrics).mp3"},
    {name: "10' ", path: "LAYLOW - 10'.mp3"}
];

document.addEventListener("DOMContentLoaded", function () {
    const loopBtn = document.getElementById("loop-btn");
    const audio = document.getElementById('audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn'); // Reference to back button
    const progressBar = document.getElementById('progress-bar');
    const timeDisplay = document.getElementById('time-display');
    const currentSongDisplay = document.getElementById('current-song');
    const progressContainer = document.getElementById("progress-container");
    const musicPlayer = document.getElementById("music-player");

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
        {name: "baby blue", path: "rocco - baby blue (lyrics).mp3"},
        {name: "10' ", path: "LAYLOW - 10'.mp3"}
    ];

    let currentTrackIndex = 0;
    let isLooping = false;
    audio.src = playlist[currentTrackIndex].path;
    currentSongDisplay.textContent = playlist[currentTrackIndex].name;

    function playTrack() {
        if (audio.src !== playlist[currentTrackIndex].path) {
            audio.src = playlist[currentTrackIndex].path;
            audio.play();
            currentSongDisplay.textContent = playlist[currentTrackIndex].name;
        } else {
            audio.play();
        }
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
        if (currentTrackIndex < playlist.length - 1) {
            currentTrackIndex++;
        } else {
            currentTrackIndex = 0;
        }
        playTrack();
    });

    backBtn.addEventListener('click', () => {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
        } else {
            currentTrackIndex = playlist.length - 1;
        }
        playTrack();
    });

    loopBtn.addEventListener('click', () => {
        isLooping = !isLooping;
        audio.loop = isLooping;
        loopBtn.classList.toggle('active', isLooping);
    });

    audio.addEventListener('timeupdate', updateProgressBar);
    audio.addEventListener('ended', () => {
        if (!isLooping) {
            nextBtn.click();
        } else {
            playTrack();
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const clickPosition = (e.offsetX / progressContainer.offsetWidth) * audio.duration;
        audio.currentTime = clickPosition;
    });
});

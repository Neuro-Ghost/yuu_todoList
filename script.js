// Task Manager Logic
import { db, auth } from './firebase.js'; // Import Firebase Firestore and Auth
import { setDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('monday-btn').classList.add("selected-button");
    showTasks('monday'); // Show Monday's task list by default
    loadTasksFromFirebase(); // Load tasks from Firebase on page load

    // Attach event listeners to the "Add Task" buttons
    document.querySelectorAll('.add-task-btn').forEach(button => {
        button.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            addTask(day);
        });
    });
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
                saveTasksToFirebase();
            }, 300);
        });

        // Append the task item to the task list
        taskList.appendChild(li);

        // Save tasks after addition
        saveTasksToFirebase();

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

// Save tasks to Firebase Firestore
async function saveTasksToFirebase() {
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

    // Save tasks to Firebase Firestore
    try {
        await setDoc(doc(db, "tasks", "dailyTasks"), allTasks);
        console.log("Tasks saved to Firebase");
    } catch (error) {
        console.error("Error saving tasks to Firebase: ", error);
    }
}

// Load tasks from Firebase Firestore
async function loadTasksFromFirebase() {
    try {
        const docRef = doc(db, "tasks", "dailyTasks");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const savedTasks = docSnap.data();
            console.log("Tasks loaded from Firebase:", savedTasks);
            // Loop through the saved tasks and display them
            for (const day in savedTasks) {
                const taskList = document.getElementById(`${day}-task-list`);

                if (taskList) {
                    // Clear existing tasks before loading
                    taskList.innerHTML = '';
                    savedTasks[day].forEach(task => {
                        const li = document.createElement('li');
                        li.classList.add('task-item');
                        li.textContent = task;

                        // Add hover indicator and delete functionality (same as before)
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

                        // Add double-click functionality to remove the task (same as before)
                        li.addEventListener('dblclick', () => {
                            li.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                            li.style.transform = 'scale(0.5)';
                            li.style.opacity = '0';
                            setTimeout(() => {
                                li.remove();
                                saveTasksToFirebase(); // Save after removal
                            }, 300);
                        });

                        // Append the task item to the task list
                        taskList.appendChild(li);
                    });
                }
            }
        } else {
            console.log("No tasks document found in Firebase.");
        }
    } catch (error) {
        console.error("Error loading tasks from Firebase: ", error);
    }
}

// Highlight selected day tasks (remains the same)
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

// Example: Call this function with the selected day (remains the same)
document.getElementById('monday-btn').addEventListener('click', () => showTasks('monday'));
document.getElementById('tuesday-btn').addEventListener('click', () => showTasks('tuesday'));
document.getElementById('wednesday-btn').addEventListener('click', () => showTasks('wednesday'));
document.getElementById('thursday-btn').addEventListener('click', () => showTasks('thursday'));
document.getElementById('friday-btn').addEventListener('click', () => showTasks('friday'));

// Music Player Logic (remains the same)
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
        {name: "blue salvia", path: "pryvt   blue salvia  lyrics    YouTube.mp3"},
        {name: "Inazuma Sorrow", path: "Inazuma Sorrow.mp3" },
        { name: "Soft Spot", path: "Soft Spot (Acoustic).mp3" },
        { name: "Devil's Daughter", path: "noname.mp3" },
        { name: "Cupid TwinVer", path: "Cupid' (TwinVer.).mp3" },
        {name: "baby blue", path: "rocco - baby blue (lyrics).mp3"},
        {name: "10' ", path: "Laylow  10  Lyrics   YouTube.mp3"},
    ];

    let currentTrackIndex = 0;
    let isLooping = false;
    audio.src = playlist[currentTrackIndex].path;
    currentSongDisplay.textContent = playlist[currentTrackIndex].name;

    function playTrack() {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
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

        // Toggle active class and update button appearance
        loopBtn.classList.toggle('active', isLooping);

        // Change the button's content or add a glowing effect
        if (isLooping) {
            loopBtn.innerHTML = '<i class="fas fa-redo"></i>'; // Add "On" text or icon
            loopBtn.style.color = '#FFF'; // Change color to gold
            loopBtn.style.textShadow = '0 0 5px #d9c5b2, 0 0 15px #d9c5b2'; // Softer, multi-layered glow
        } else {
            loopBtn.innerHTML = '<i class="fas fa-redo"></i>'; // Default loop icon
            loopBtn.style.color = ''; // Reset color
            loopBtn.style.textShadow = ''; // Remove glow
        }
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
     const songSelector = document.getElementById("song-selector");

    // Populate dropdown with playlist songs
    function populateSongSelector() {
        // Clear any existing options except the placeholder
        songSelector.innerHTML = '<option value="">Select a song</option>';

        playlist.forEach((track, index) => {
            const option = document.createElement("option");
            option.value = index; // Set the value as the index of the song
            option.textContent = track.name; // Display the song name
            songSelector.appendChild(option);
        });
    }

    // Handle song selection
    songSelector.addEventListener("change", (e) => {
        const selectedIndex = e.target.value; // Get the selected index
        if (selectedIndex !== "") {
            currentTrackIndex = parseInt(selectedIndex, 10); // Convert index to integer
            playTrack(); // Play the selected track
        }
    });

    // Call populateSongSelector to populate the dropdown
    populateSongSelector();
});
// Motivational messages (remains the same)
const messages = [
    "I know you can do it, my strong petite nerdy loutre!",
     "You're my adorable mess, snorts, burps, nerdy rants and all.",
"Babe?",
"Baby.....",
"Babyyyyyyy....",
"......",
"Wrong name...😏",
"Nothing just like that.",
];

let messageIndex = 0;
const typingText = document.getElementById("typing-text");

function typeMessage(message, callback) {
    let i = 0;
    typingText.textContent = "";
    typingText.classList.add("visible");

    const typingInterval = setInterval(() => {
        if (i < message.length) {
            typingText.textContent += message.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            setTimeout(() => {
                typingText.classList.remove("visible");
                setTimeout(() => deleteMessage(callback), 500);
            }, 5000);
        }
    }, 100);
}

function deleteMessage(callback) {
    typingText.classList.remove("visible");
    setTimeout(callback, 500);
}

function startTypingAnimation() {
    typeMessage(messages[messageIndex], () => {
        messageIndex = (messageIndex + 1) % messages.length;
        startTypingAnimation();
    });
}

startTypingAnimation();

 // Get references to the video and button elements (remains the same)
    const video = document.getElementById('background-video');
    const muteButton = document.getElementById('mute-btn');
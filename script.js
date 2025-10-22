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

    // Add event listeners to the "Clear Tasks" buttons
    document.querySelectorAll('.clear-tasks-btn').forEach(button => {
        button.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            clearTasks(day);
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

        li.addEventListener('dblclick', () => {
            li.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            li.style.transform = 'scale(0.5)';
            li.style.opacity = '0';
            setTimeout(() => {
                li.remove();
                saveTasksToFirebase();
            }, 300);
        });

        taskList.appendChild(li);
        saveTasksToFirebase();
        taskInput.value = "";
    }
}

// Show tasks for a specific day
function showTasks(day) {
    const taskLists = document.querySelectorAll('.task-list');
    taskLists.forEach(taskList => taskList.style.display = 'none');
    document.getElementById(`${day}-tasks`).style.display = 'block';
}

// Save tasks to Firebase Firestore
async function saveTasksToFirebase() {
    const taskLists = document.querySelectorAll('.task-list');
    const allTasks = {};

    taskLists.forEach(list => {
        const day = list.id.split('-')[0];
        const tasks = [];
        const taskItems = list.querySelectorAll('li');
        taskItems.forEach(item => {
            tasks.push(item.textContent);
        });
        allTasks[day] = tasks;
    });

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
            for (const day in savedTasks) {
                const taskList = document.getElementById(`${day}-task-list`);
                if (taskList) {
                    taskList.innerHTML = '';
                    savedTasks[day].forEach(task => {
                        const li = document.createElement('li');
                        li.classList.add('task-item');
                        li.textContent = task;

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

                        li.addEventListener('dblclick', () => {
                            li.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                            li.style.transform = 'scale(0.5)';
                            li.style.opacity = '0';
                            setTimeout(() => {
                                li.remove();
                                saveTasksToFirebase();
                            }, 300);
                        });
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

// Function to clear tasks for a specific day
function clearTasks(day) {
    const taskList = document.getElementById(`${day}-task-list`);
    if (taskList) {
        taskList.innerHTML = '';
        saveTasksToFirebase();
    }
}

// Highlight selected day tasks
document.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".tab-button").forEach(btn => {
            btn.classList.remove("selected-button");
        });
        button.classList.add("selected-button");
        const day = button.getAttribute("data-day");
        showTasks(day);
    });
});

// Event listeners for day tabs to show tasks
document.getElementById('monday-btn').addEventListener('click', () => showTasks('monday'));
document.getElementById('tuesday-btn').addEventListener('click', () => showTasks('tuesday'));
document.getElementById('wednesday-btn').addEventListener('click', () => showTasks('wednesday'));
document.getElementById('thursday-btn').addEventListener('click', () => showTasks('thursday'));
document.getElementById('friday-btn').addEventListener('click', () => showTasks('friday'));


// Music Player Logic
document.addEventListener("DOMContentLoaded", function () {
    const loopBtn = document.getElementById("loop-btn");
    const audio = document.getElementById('audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const progressBar = document.getElementById('progress-bar');
    const timeDisplay = document.getElementById('time-display');
    const currentSongDisplay = document.getElementById('current-song');
    const progressContainer = document.getElementById("progress-container");
    const musicPlayer = document.getElementById("music-player");
    const songSelector = document.getElementById("song-selector");

    const playlist = [
        { name: "enta zaalan menni", path: "enta zaalan menni.mp3" },
        { name: "dream", path: "dream.mp3" },
        { name: "everything, everywhere", path: "everything, everywhere.mp3" },
        { name: "by my side", path: "by my side.mp3" },
        { name: "tout sen va", path: "tout.mp3" },
        { name: "Malik al mawt", path: "malik.mp3" },
        { name: "Jalil", path: "Jalil.mp3" },
        {name: "blue salvia", path: "pryvt   blue salvia  lyrics    YouTube.mp3"},
        {name: "Inazuma Sorrow", path: "Inazuma Sorrow.mp3" },
        { name: "Soft Spot", path: "Soft Spot (Acoustic).mp3" },
        { name: "Devil's Daughter", path: "noname.mp3" },
        { name: "Cupid TwinVer", path: "Cupid' (TwinVer.).mp3" },
        {name: "baby blue", path: "rocco - baby blue (lyrics).mp3"},
        {name: "10' ", path: "Laylow  10  Lyrics   YouTube.mp3"},
    ];

    let currentTrackIndex = 0;
    let isLooping = false;

    if (audio) {
        audio.src = playlist[currentTrackIndex].path;
    }
    if (currentSongDisplay) {
        currentSongDisplay.textContent = playlist[currentTrackIndex].name;
    }

    function playTrack() {
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        if (audio) {
            if (audio.src !== playlist[currentTrackIndex].path) {
                audio.src = playlist[currentTrackIndex].path;
                audio.play();
                if (currentSongDisplay) {
                    currentSongDisplay.textContent = playlist[currentTrackIndex].name;
                }
            } else {
                audio.play();
            }
        }
    }

    function updateProgressBar() {
        if (audio && progressBar && timeDisplay) {
            const progress = (audio.currentTime / audio.duration) * 100 || 0;
            progressBar.style.width = progress + '%';

            const currentMinutes = Math.floor(audio.currentTime / 60);
            const currentSeconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
            const durationMinutes = Math.floor(audio.duration / 60);
            const durationSeconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
        }
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (audio) {
                if (audio.paused) {
                    audio.play();
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    if (musicPlayer) {
                        musicPlayer.classList.add("playing");
                    }
                } else {
                    audio.pause();
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    if (musicPlayer) {
                        musicPlayer.classList.remove("playing");
                    }
                }
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (playlist.length > 0) {
                if (currentTrackIndex < playlist.length - 1) {
                    currentTrackIndex++;
                } else {
                    currentTrackIndex = 0;
                }
                playTrack();
            }
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (playlist.length > 0) {
                if (currentTrackIndex > 0) {
                    currentTrackIndex--;
                } else {
                    currentTrackIndex = playlist.length - 1;
                }
                playTrack();
            }
        });
    }

    if (loopBtn) {
        loopBtn.addEventListener('click', () => {
            isLooping = !isLooping;
            if (audio) {
                audio.loop = isLooping;
            }
            loopBtn.classList.toggle('active', isLooping);
            loopBtn.innerHTML = `<i class="fas fa-redo"></i>${isLooping ? '' : ''}`;
            loopBtn.style.color = isLooping ? '#FFF' : '';
            loopBtn.style.textShadow = isLooping ? '0 0 5px #d9c5b2, 0 0 15px #d9c5b2' : '';
        });
    }

    if (audio) {
        audio.addEventListener('timeupdate', updateProgressBar);
        audio.addEventListener('ended', () => {
            if (!isLooping) {
                if (nextBtn) {
                    nextBtn.click();
                }
            } else {
                playTrack();
            }
        });
    }

    if (progressContainer && audio) {
        progressContainer.addEventListener('click', (e) => {
            const clickPosition = (e.offsetX / progressContainer.offsetWidth) * audio.duration;
            audio.currentTime = clickPosition;
        });
    }

    function populateSongSelector() {
        if (songSelector) {
            songSelector.innerHTML = '<option value="">Select a song</option>';
            playlist.forEach((track, index) => {
                const option = document.createElement("option");
                option.value = index;
                option.textContent = track.name;
                songSelector.appendChild(option);
            });
        }
    }

    if (songSelector) {
        songSelector.addEventListener("change", (e) => {
            const selectedIndex = e.target.value;
            if (selectedIndex !== "") {
                currentTrackIndex = parseInt(selectedIndex, 10);
                playTrack();
            }
        });
    }

    populateSongSelector();
});

// Motivational messages
const messages = [
   "One day...",
    "We'll meet."
];

let messageIndex = 0;
const typingText = document.getElementById("typing-text");

function typeMessage(message, callback) {
    let i = 0;
    if (!typingText) return;
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
    if (typingText) {
        typingText.classList.remove("visible");
    }
    setTimeout(callback, 500);
}

function startTypingAnimation() {
    typeMessage(messages[messageIndex], () => {
        messageIndex = (messageIndex + 1) % messages.length;
        startTypingAnimation();
    });
}

startTypingAnimation();

// Loading overlay logic
window.onload = () => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
    sessionStorage.removeItem('showLoading');
};


// ---------------- bg-audio mute/play toggle (safe, simple) ----------------
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'bgSoundOn';
  const muteBtn = document.getElementById('mute-btn');
  const bgAudio = document.getElementById('bg-audio');

  if (!muteBtn || !bgAudio) return;

  // Set sensible default volume (0.0 - 1.0)
  bgAudio.volume = 0.25;

  const setBtnUI = (on) => {
    muteBtn.classList.toggle('on', on);
    muteBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    muteBtn.innerHTML = on ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
  };

  // Restore saved state without forcing playback
  const wasOn = localStorage.getItem(STORAGE_KEY) === 'true';
  setBtnUI(wasOn);

  // If saved as on, try to play (will only succeed if browser already unlocked audio)
  if (wasOn) {
    bgAudio.play().catch(() => {
      // Play may be blocked until a user gesture; we'll let the click handler handle it.
    });
  }

  // Toggle handler - user click ensures playback permission
  muteBtn.addEventListener('click', async () => {
    try {
      if (bgAudio.paused) {
        await bgAudio.play(); // user gesture -> should be allowed
        setBtnUI(true);
        localStorage.setItem(STORAGE_KEY, 'true');
      } else {
        bgAudio.pause();
        setBtnUI(false);
        localStorage.setItem(STORAGE_KEY, 'false');
      }
    } catch (err) {
      console.warn('bg-audio toggle failed:', err);
      // Fallback: flip UI and storage so it doesn't get out of sync
      const newState = !(bgAudio && !bgAudio.paused);
      setBtnUI(newState);
      localStorage.setItem(STORAGE_KEY, newState ? 'true' : 'false');
    }
  });
});






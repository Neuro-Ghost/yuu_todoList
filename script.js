document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const clearAllBtn = document.getElementById("clear-all-btn");
const audio = document.getElementById('background-music');
const loopBtn = document.getElementById('loop-btn');

let isLooping = false;
const video = document.getElementById("background-video");
const muteBtn = document.getElementById("mute-btn");
const muteIcon = muteBtn.querySelector("i");

muteBtn.addEventListener("click", () => {
    if (video.muted) {
        video.muted = false;
        muteIcon.classList.replace("fa-volume-mute", "fa-volume-up"); // Change to unmuted icon
        muteBtn.setAttribute('data-muted', 'false'); // Update data attribute
    } else {
        video.muted = true;
        muteIcon.classList.replace("fa-volume-up", "fa-volume-mute"); // Change to muted icon
        muteBtn.setAttribute('data-muted', 'true'); // Update data attribute
    }
});




    const messages = [
        "Another day, another L.",
        "Everyone's good at something...",
        "Hop on reload?",
        "Keep at it.",        
    ];

    const initialCatImages = [
        "https://38.media.tumblr.com/457b296c98ddd69f5327b8b5881e4ffe/tumblr_nedxajZ0hW1tw5bhko1_400.gif",
        "https://64.media.tumblr.com/bf764f6e75024cd690b1c11e1b0eed15/18a26cfa8ad7e0da-14/s250x400/fab9def043d1a713e9cae44e8fe42971afa135bc.gif"
      
    ];

    const completedCatImages = [
        "https://i.makeagif.com/media/7-28-2016/LHHsiF.gif",
    ];

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Get the current day of the week
    function getCurrentDayIndex() {
        return new Date().getDay();
    }

    // Calculate the day difference relative to the current day
    function getDayDifference(selectedDay) {
        const currentDayIndex = getCurrentDayIndex();
        const selectedDayIndex = daysOfWeek.indexOf(selectedDay);
        const difference = (selectedDayIndex - currentDayIndex + 7) % 7;
        return difference;
    }

    // Function to sort tasks based on the selected day relative to the current day
    function sortTasks() {
        const tasks = [...taskList.querySelectorAll("li")];
        
        tasks.sort((a, b) => {
            const dayA = a.querySelector(".day-selection").value;
            const dayB = b.querySelector(".day-selection").value;
            return getDayDifference(dayA) - getDayDifference(dayB);
        });

        taskList.innerHTML = ''; // Clear the list
        tasks.forEach(task => taskList.appendChild(task)); // Re-add sorted tasks
    }

    function createRandomTextBox() {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const textBox = document.createElement("div");

        textBox.textContent = randomMessage;
        textBox.style.position = "absolute";
        textBox.style.left = `${Math.random() * 90}vw`;
        textBox.style.top = `${Math.random() * 90}vh`;
        textBox.style.backgroundColor = "#e8d0a9";
        textBox.style.padding = "10px";
        textBox.style.borderRadius = "5px";
        textBox.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.2)";
        textBox.style.fontSize = "14px";
        textBox.style.color = "#4A2C2A";
        textBox.style.opacity = "0";
        textBox.style.transition = "opacity 1s";

        document.body.appendChild(textBox);

        setTimeout(() => {
            textBox.style.opacity = "1";
        }, 10);

        setTimeout(() => {
            textBox.remove();
        }, 5000);
    }

    function startRandomTextBoxes() {
        setInterval(() => {
            createRandomTextBox();
        }, Math.random() * 90000 + 30000);
    }

    startRandomTextBoxes();

    function showCuteCat() {
        const catImage = document.createElement("img");
        const randomImage = initialCatImages[Math.floor(Math.random() * initialCatImages.length)];
        catImage.src = randomImage;
        catImage.alt = "Cute Cat";
        catImage.style.position = "absolute";
        catImage.style.left = `${Math.random() * 80}vw`;
        catImage.style.top = `${Math.random() * 80}vh`;
        catImage.style.width = "150px";
        catImage.style.height = "150px";
        catImage.style.borderRadius = "15px";
        catImage.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.3)";
        catImage.style.transition = "opacity 1s, transform 1s";
        catImage.style.opacity = "0";
        catImage.style.transform = "scale(0.5)";

        document.body.appendChild(catImage);

        setTimeout(() => {
            catImage.style.opacity = "1";
            catImage.style.transform = "scale(1)";
        }, 10);

        setTimeout(() => {
            catImage.remove();
        }, 5000);
    }

    function showCompletionCat() {
        const catImage = document.createElement("img");
        const randomImage = completedCatImages[Math.floor(Math.random() * completedCatImages.length)];
        catImage.src = randomImage;
        catImage.alt = "Completion Cat";
        catImage.style.position = "absolute";
        catImage.style.left = `${Math.random() * 80}vw`;
        catImage.style.top = `${Math.random() * 80}vh`;
        catImage.style.width = "150px";
        catImage.style.height = "150px";
        catImage.style.borderRadius = "15px";
        catImage.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.3)";
        catImage.style.transition = "opacity 1s, transform 1s";
        catImage.style.opacity = "0";
        catImage.style.transform = "scale(0.5)";

        document.body.appendChild(catImage);

        setTimeout(() => {
            catImage.style.opacity = "1";
            catImage.style.transform = "scale(1)";
        }, 10);

        setTimeout(() => {
            catImage.remove();
        }, 5000);
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll("li").forEach(li => {
            const taskText = li.querySelector("span").textContent;
            const isCompleted = li.classList.contains("completed");
            const selectedDay = li.querySelector(".day-selection").value;

            tasks.push({
                text: taskText,
                completed: isCompleted,
                day: selectedDay
            });
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
                <select class="day-selection">
                    ${dayOptions}
                </select>
                <span>${taskText}</span>
                <br>
                <button class="complete-btn">Completed</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
    
        taskList.appendChild(li);
        setTimeout(() => {
            li.classList.add("show");
        }, 10);
    
        if (isCompleted) {
            li.classList.add("completed");
        }
    
    
        // Event listener for changing the day selection
        const daySelection = li.querySelector(".day-selection");
        daySelection.addEventListener("change", function () {
            saveTasks();
            sortTasks();  // Sort tasks when day is changed
        });
    
        // Event listener for the complete button
        const completeBtn = li.querySelector(".complete-btn");
        completeBtn.addEventListener("click", function () {
            li.classList.toggle("completed");
            showCompletionCat();
            saveTasks();
        });
    
        // Event listener for the delete button
        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function () {
            li.classList.remove("show");
            setTimeout(() => {
                li.remove();
                saveTasks();
            }, 500);
        });
    
        saveTasks();
        showCuteCat();
        sortTasks();  // Sort tasks when a new task is added
    }
    


    addTaskBtn.addEventListener("click", function () {
        console.log("Add Task button clicked"); // Debug line
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTask(taskText);
            taskInput.value = "";
        }
    });

    taskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addTaskBtn.click();
        }
    });

    clearAllBtn.addEventListener("click", function () {
        taskList.querySelectorAll("li").forEach(li => li.remove());
        localStorage.removeItem("tasks");
    });

    loadTasks();
});

document.addEventListener("DOMContentLoaded", function () {
    const loopBtn = document.getElementById("loop-btn");
    const audio = document.getElementById('audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
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
        { name: "YOURS", path: "YOURS.mp3" },
        { name: "IF ITS NOT YOU", path: "IF ITS NOT YOU.mp3" },
        { name: "Jalil", path: "Jalil.mp3" },
        { name: "Inazuma Sorrow", path: "Inazuma Sorrow.mp3" },
        { name: "Soft Spot", path: "Soft Spot (Acoustic).mp3" },
        { name: "Devil's Daughter", path: "noname.mp3" },
        { name: "Cupid (not atoxy's)", path: "Cupid' (TwinVer.).mp3" },

    ];

    let currentTrackIndex = 0;
    let isLooping = false;
    audio.src = playlist[currentTrackIndex].path;
    currentSongDisplay.textContent = playlist[currentTrackIndex].name;

    // Function to play the current track
    function playTrack() {
        if (audio.src !== playlist[currentTrackIndex].path) {
            audio.src = playlist[currentTrackIndex].path;
            audio.play();
            currentSongDisplay.textContent = playlist[currentTrackIndex].name;
        } else {
            audio.play();
        }
    }

    // Function to update the progress bar
    function updateProgressBar() {
        const progress = (audio.currentTime / audio.duration) * 100 || 0;
        progressBar.style.width = progress + '%';

        // Update time display
        const currentMinutes = Math.floor(audio.currentTime / 60);
        const currentSeconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
        const durationMinutes = Math.floor(audio.duration / 60);
        const durationSeconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
        timeDisplay.textContent = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
    }

    // Event listener for play/pause button
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; 
            musicPlayer.classList.add("playing"); // Add the gradient animation class
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            musicPlayer.classList.remove("playing"); // Add the gradient animation class

        }
    });

    // Event listener for next button
    nextBtn.addEventListener("click", function () {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length; 
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; 
        playTrack();
    });

    // Event listener for loop button
    loopBtn.addEventListener("click", () => {
        isLooping = !isLooping;
        loopBtn.style.color = isLooping ? "#e8d0a9" : "white";
    });

    // Event listener for when the track ends
    audio.addEventListener("ended", function () {
        if (!isLooping) {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length; 
            playTrack();
        } else {
            audio.play(); 
        }
    });

    // Event listener to update the progress bar as the audio plays
    audio.addEventListener('timeupdate', updateProgressBar);

    // Event listener for clicking the progress bar to seek
    progressContainer.addEventListener("click", function (event) {
        const totalWidth = this.clientWidth; // Get the total width of the progress container
        const offsetX = event.offsetX; // Get the X position of the click
        const percentage = offsetX / totalWidth; // Calculate the percentage of the click position
        const newTime = percentage * audio.duration; // Calculate the new time in seconds
        audio.currentTime = newTime; // Update the audio currentTime
    });
});


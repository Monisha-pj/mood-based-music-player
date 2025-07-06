let audioPlayer = document.getElementById("audioPlayer");
let progressBar = document.getElementById("progressBar");
let currentTime = document.getElementById("currentTime");
let totalTime = document.getElementById("totalTime");
let nowPlayingSection = document.getElementById("nowPlaying");
let volumeIcon = document.getElementById("volumeIcon");
let volumeControl = document.getElementById("volumeControl");
let isPlaying = false;
let playPauseButton;

function fetchMood() {
    alert("Detecting mood...");
    fetch("http://127.0.0.1:5000/detect_mood")
        .then(response => response.json())
        .then(data => {
            let detectedMood = data.mood;
            document.getElementById("detected-mood").textContent = detectedMood;

            nowPlayingSection.style.display = "block";
            document.getElementById("songList").style.display = "block";

            getSongs(detectedMood);
        })
        .catch(error => console.error("Error detecting mood:", error));
}

function getSongs(mood) {
    fetch(`http://localhost/mood_music/fetch_songs.php?mood=${mood}`)
        .then(response => response.json())
        .then(data => {
            let songList = document.getElementById("songList");
            songList.innerHTML = ""; 

            data.forEach(song => {
                let li = document.createElement("li");
                li.innerHTML = `
                    <img src="${song.thumbnail}" alt="Thumbnail">
                    <div class="song-info">
                        <strong>${song.title}</strong>
                        <span>${song.artist}</span>
                    </div>
                    <button class="play-btn" onclick="playSong(this, '${song.file_path}', '${song.thumbnail}', '${song.title}', '${song.artist}')">▶</button>
                `;
                songList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching songs:", error));
}

function playSong(button, filePath, thumbnail, title, artist) {
    document.getElementById("nowPlayingThumbnail").src = thumbnail;
    document.getElementById("nowPlayingTitle").textContent = title;
    document.getElementById("nowPlayingArtist").textContent = artist;

    audioPlayer.src = filePath;
    audioPlayer.play();
    isPlaying = true;

    if (playPauseButton) playPauseButton.textContent = "▶";
    playPauseButton = button;
    playPauseButton.textContent = "⏸";
}

audioPlayer.addEventListener("timeupdate", function() {
    if (!isNaN(audioPlayer.duration)) {
        let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
        currentTime.textContent = formatTime(audioPlayer.currentTime);
        totalTime.textContent = formatTime(audioPlayer.duration);
    }
});

function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseButton.textContent = "▶";
    } else {
        audioPlayer.play();
        playPauseButton.textContent = "⏸";
    }
    isPlaying = !isPlaying;
}

// 🎧 Speaker (Volume) Control
volumeControl.addEventListener("input", function() {
    audioPlayer.volume = volumeControl.value / 100;
    updateVolumeIcon(audioPlayer.volume);
});

function updateVolumeIcon(volume) {
    if (volume === 0) {
        volumeIcon.textContent = "🔇";  // Muted
    } else if (volume > 0 && volume <= 0.5) {
        volumeIcon.textContent = "🔉";  // Low Volume
    } else {
        volumeIcon.textContent = "🔊";  // High Volume
    }
}

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

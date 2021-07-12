const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

// console.log(play, mute, time, volume);

const handlePlayClick = (e) => {
  // if the video is playing, pause it
  if (video.paused) {
    playBtn.innerText = "Pause";
    video.play();
  } else {
    playBtn.innerText = "Play";
    video.pause();
  }
  // else play the video.
};

const handleMuteClick = (e) => {
  //
};

const handlePause = () => (playBtn.innerText = "Play");
const handlePlay = () => (playBtn.innerText = "Pause");

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);

import fetch from "node-fetch";

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const commentForm = document.getElementById("commentForm");

let controlsTimeout = null;
let constrolsMouvementTimeout = null;
let volumeValue = 0.5;
video.value = volumeValue;

// console.log(play, mute, time, volume);

const handlePlayClick = (e) => {
  // if the video is playing, pause it
  // else play the video.
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (e) => {
  video.muted = video.muted ? false : true;
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  console.log(value);
  volumeValue = value;
  video.volume = value;
  if (value == 0) {
    video.muted = true;
    muteBtnIcon.classList = "fas fa-volume-mute";
    volumeValue = 0.5;
  } else {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  playBtnIcon.classList = "fas fa-play";
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
  fullScreenIcon.classList = fullScreen ? "fas fa-expand" : "fas fa-compress";
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (constrolsMouvementTimeout) {
    clearTimeout(constrolsMouvementTimeout);
    constrolsMouvementTimeout = null;
  }
  videoControls.classList.add("showing");
  constrolsMouvementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleSpacebarDown = (event) => {
  // event.keyCode = 32 window spacebar
  if (event.code == "Space") {
    event.preventDefault();
    handlePlayClick();
  }
};

const handleStopSpacebarDown = () => {
  document.removeEventListener("keydown", handleSpacebarDown);
};

const handleSpacebarDownAgain = () => {
  document.addEventListener("keydown", handleSpacebarDown);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handlePlayClick);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
document.addEventListener("keydown", handleSpacebarDown);
if (commentForm) {
  commentForm.addEventListener("click", handleStopSpacebarDown);
  commentForm.addEventListener("focusout", handleSpacebarDownAgain);
}

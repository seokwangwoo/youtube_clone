const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.querySelector("input#volume") as HTMLInputElement;

video.volume = 0.5;

playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
function handlePlayBtnClick(this: HTMLElement, ev: MouseEvent) {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
}

function handleMuteBtnClick(this: HTMLElement, ev: MouseEvent) {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? "0" : "0.5";
}

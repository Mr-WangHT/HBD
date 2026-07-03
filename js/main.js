const screens = {
  cover: document.querySelector('[data-screen="cover"]'),
  letter: document.querySelector('[data-screen="letter"]'),
  gallery: document.querySelector('[data-screen="gallery"]')
};

const validAnswers = ["宝宝", "妹妹", "老婆"];
const questionForm = document.querySelector("[data-question-form]");
const answerInput = document.querySelector("#answer");
const hint = document.querySelector("[data-hint]");
const stage = document.querySelector("[data-gallery-stage]");
const speakerButton = document.querySelector("[data-speaker-toggle]");
const backCoverButton = document.querySelector("[data-back-cover]");

const r2PhotoBase = "https://pub-fc5bd537bb2c4bb59e8213eaf5b416bc.r2.dev/images-compressed/";
const localPhotoBase = "./assets/images-compressed/";

const photos = [
  "Image_1125068492703527.jpg",
  "Image_1125075381942275.jpg",
  "Image_156227836791442.jpg",
  "Image_1716404152254.jpg",
  "Image_1762497350560.jpg",
  "Image_661215847105055.jpg",
  "IMG_20240811_182805.jpg",
  "IMG_20241003_160705.jpg",
  "IMG_20250208_133556.jpg",
  "IMG_20250210_180012.jpg",
  "IMG_20250501_174623.jpg",
  "IMG_20250613_045453.jpg",
  "IMG_20250613_193347.jpg",
  "IMG_20250724_142303.jpg",
  "IMG_20250927_190338.jpg",
  "IMG_20250927_190604.jpg",
  "IMG_20251017_145348.jpg",
  "IMG_20251025_183309.jpg",
  "IMG_20251115_193457.jpg",
  "IMG_20260624_202823.jpg",
  "IMG_20260624_213321.jpg",
  "mmexport1737522113371.jpg",
  "mmexport1749830137080.jpg",
  "mmexport1753969206446.jpg",
  "mmexport1767328295604.jpg",
  "mmexport1780915023534.jpg",
  "mmexport1781426723803.jpg",
  "mmexport1781427597680.jpg",
  "MVIMG_20250118_213038.jpg",
  "MVIMG_20250124_135812.jpg",
  "MVIMG_20250612_230544.jpg",
  "MVIMG_20251212_223408.jpg"
];

const dogs = [
  "048-线条小狗动态表情包.gif",
  "068-线条小狗动态表情包.gif",
  "080-线条小狗动态表情包.gif",
  "160-线条小狗动态表情包.gif",
  "165-线条小狗动态表情包.gif",
  "174-线条小狗动态表情包.gif",
  "182-线条小狗动态表情包.gif"
];

const voiceTracks = [
  "./assets/audio/hbd%20song%20ch.m4a",
  "./assets/audio/hbd%20song%20eng.m4a"
];
const backgroundTrack = "./assets/audio/hbd%20bg.mp3";

let photoIndex = 0;
let dogIndex = 0;
let voiceIndex = 0;
let voiceAudio = null;
let backgroundAudio = null;
let galleryTimer = null;
let isMuted = false;

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
}

document.querySelector("[data-open-question]").addEventListener("click", () => {
  startBackgroundMusic();
  questionForm.hidden = false;
  answerInput.focus();
});

questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = answerInput.value.trim();

  if (validAnswers.includes(answer)) {
    showScreen("letter");
    return;
  }

  hint.textContent = "再想想哦，只能是宝宝、妹妹、老婆。";
  answerInput.select();
});

document.querySelector("[data-go-gallery]").addEventListener("click", () => {
  showScreen("gallery");
  startGallery();
  startBackgroundMusic();
  startVoiceMusic();
});

speakerButton.addEventListener("click", () => {
  isMuted = !isMuted;
  updateSoundState();
});

backCoverButton.addEventListener("click", () => {
  stopGalleryExperience({ keepBackground: true });
  showScreen("cover");
});

function startGallery() {
  if (galleryTimer) {
    return;
  }

  addPhoto();
  addHeart();
  galleryTimer = window.setInterval(() => {
    const roll = Math.random();

    if (roll > 0.76) {
      addDog();
    } else if (roll > 0.58) {
      addHeart();
    } else {
      addPhoto();
    }
  }, 1150);
}

function stopGalleryExperience({ keepBackground = false } = {}) {
  if (galleryTimer) {
    window.clearInterval(galleryTimer);
    galleryTimer = null;
  }

  if (voiceAudio) {
    voiceAudio.pause();
    voiceAudio.currentTime = 0;
  }

  if (backgroundAudio && !keepBackground) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }

  stage.querySelectorAll(".floating-photo, .floating-dog, .floating-heart").forEach((element) => {
    element.remove();
  });
}

function addPhoto() {
  const fileName = photos[photoIndex % photos.length];
  const img = document.createElement("img");
  img.className = "floating-photo";
  img.alt = "";
  img.src = getAssetPath(fileName, r2PhotoBase);
  img.addEventListener("error", () => {
    img.src = getAssetPath(fileName, localPhotoBase);
  }, { once: true });
  photoIndex += 1;
  placeFloating(img);
}

function addDog() {
  const img = document.createElement("img");
  img.className = "floating-dog";
  img.alt = "";
  img.src = getAssetPath(dogs[dogIndex % dogs.length], "./assets/dog/page3/");
  dogIndex += 1;
  placeFloating(img);
}

function addHeart() {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  placeFloating(heart);
}

function placeFloating(element) {
  const left = 5 + Math.random() * 70;
  const top = 5 + Math.random() * 68;
  const angle = -18 + Math.random() * 36;

  element.style.left = `${left}%`;
  element.style.top = `${top}%`;
  element.style.setProperty("--angle", `${angle}deg`);
  stage.appendChild(element);

  window.setTimeout(() => {
    element.remove();
  }, 9200);
}

function getAssetPath(fileOrUrl, localBase) {
  if (/^https?:\/\//.test(fileOrUrl)) {
    return fileOrUrl;
  }

  return encodeURI(`${localBase}${fileOrUrl}`);
}

function startBackgroundMusic() {
  if (!backgroundAudio) {
    backgroundAudio = new Audio(backgroundTrack);
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.28;
  }

  updateSoundState();
  backgroundAudio.play().catch(markAudioNeedsTap);
}

function startVoiceMusic() {
  if (!voiceAudio) {
    voiceAudio = new Audio();
    voiceAudio.volume = 1;
    voiceAudio.addEventListener("ended", playNextVoiceTrack);
  }

  updateSoundState();
  playNextVoiceTrack();
}

function playNextVoiceTrack() {
  voiceAudio.src = voiceTracks[voiceIndex % voiceTracks.length];
  voiceIndex += 1;
  updateSoundState();
  voiceAudio.play().catch(markAudioNeedsTap);
}

function markAudioNeedsTap() {
  speakerButton.classList.add("needs-tap");
  speakerButton.setAttribute("aria-label", "点按播放声音");
}

function updateSoundState() {
  if (voiceAudio) {
    voiceAudio.muted = isMuted;
  }

  if (backgroundAudio) {
    backgroundAudio.muted = isMuted;
  }

  if (!isMuted) {
    if (backgroundAudio && backgroundAudio.paused) {
      backgroundAudio.play().catch(markAudioNeedsTap);
    }

    if (voiceAudio && voiceAudio.paused && voiceAudio.src) {
      voiceAudio.play().catch(markAudioNeedsTap);
    }
  }

  speakerButton.classList.toggle("is-muted", isMuted);
  speakerButton.classList.remove("needs-tap");
  speakerButton.setAttribute("aria-pressed", String(!isMuted));
  speakerButton.setAttribute("aria-label", isMuted ? "打开声音" : "关闭声音");
}

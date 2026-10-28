
document.addEventListener('DOMContentLoaded', () => {
  const musicTracks = [
    {
      title: 'Canción 1',
      name: '01 · Mi música',
      src: './assets/music/0.mp3'
    },
    {
      title: 'Canción 2',
      name: '02 · Mi música',
      src: './assets/music/1.mp3'
    }
  ];

  const audio = document.getElementById('musicAudio');
  const select = document.getElementById('musicTrackSelect');
  const title = document.getElementById('musicTrackTitle');
  const playButton = document.getElementById('musicPlay');
  const prevButton = document.getElementById('musicPrev');
  const nextButton = document.getElementById('musicNext');
  const volume = document.getElementById('musicVolume');
  const volumeValue = document.getElementById('musicVolumeValue');
  const volumeIcon = document.getElementById('musicVolumeIcon');

  if (
    !audio || !select || !title || !playButton ||
    !prevButton || !nextButton || !volume ||
    !volumeValue || !volumeIcon
  ) {
    console.error('No se encontraron los controles del reproductor.');
    return;
  }

  let currentTrack = 0;

  // Crear las opciones a partir de las canciones disponibles.
  select.replaceChildren();

  musicTracks.forEach((track, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = track.name;
    select.appendChild(option);
  });

  function updateVolume() {
    const value = Number(volume.value);

    audio.volume = value / 100;
    volumeValue.textContent = `${value}%`;
    volumeIcon.textContent =
      value === 0 ? '🔇' : value < 50 ? '🔉' : '🔊';
  }

  function loadTrack(index, autoplay = false) {
    currentTrack =
      (index + musicTracks.length) % musicTracks.length;

    const track = musicTracks[currentTrack];

    audio.pause();
    audio.src = track.src;
    audio.load();

    select.value = String(currentTrack);
    title.textContent = track.title;
    playButton.textContent = '▶';

    if (autoplay) {
      playAudio();
    }
  }

  function playAudio() {
    audio.play()
      .then(() => {
        playButton.textContent = 'Ⅱ';
      })
      .catch(error => {
        playButton.textContent = '▶';
        console.error('No se pudo reproducir la canción:', error);
      });
  }

  select.addEventListener('change', () => {
    loadTrack(Number(select.value), true);
  });

  playButton.addEventListener('click', () => {
    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
    }
  });

  prevButton.addEventListener('click', () => {
    loadTrack(currentTrack - 1, true);
  });

  nextButton.addEventListener('click', () => {
    loadTrack(currentTrack + 1, true);
  });

  audio.addEventListener('play', () => {
    playButton.textContent = 'Ⅱ';
  });

  audio.addEventListener('pause', () => {
    playButton.textContent = '▶';
  });

  audio.addEventListener('ended', () => {
    loadTrack(currentTrack + 1, true);
  });

  audio.addEventListener('error', () => {
    playButton.textContent = '▶';
    console.error('Error al cargar el audio:', audio.currentSrc);
  });

  volume.addEventListener('input', updateVolume);

  updateVolume();
  loadTrack(0);
});

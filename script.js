
  // --- Reproductor de música: archivos locales en assets/ ---
  const musicTracks = [
    {
      title: 'Nen Theme • Track 1',
      name: '01 · Track 1',
   src: 'assets/0.mp3'
    },
    {
      title: 'Scarlet Aura • Track 2',
      name: '02 · Track 2',
 src: 'assets/1.mp3'
    },
    {
      title: 'Judgement Chain • Track 3',
      name: '03 · Track 3',
      src: 'assets/2.mp3'
    }
  ];

  const musicAudio = document.getElementById('musicAudio');
  const musicTrackSelect = document.getElementById('musicTrackSelect');
  const musicTrackTitle = document.getElementById('musicTrackTitle');
  const musicPlay = document.getElementById('musicPlay');
  const musicVolume = document.getElementById('musicVolume');
  const musicVolumeValue = document.getElementById('musicVolumeValue');
  const musicVolumeIcon = document.getElementById('musicVolumeIcon');
  const musicPrev = document.getElementById('musicPrev');
  const musicNext = document.getElementById('musicNext');

  let currentTrack = 0;

  // Generar las opciones del selector.
  musicTrackSelect.replaceChildren();

  musicTracks.forEach((track, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = track.name;
    musicTrackSelect.appendChild(option);
  });

  // Control de volumen.
  function updateMusicVolume() {
    const volume = Number(musicVolume.value);

    musicAudio.volume = volume / 100;
    musicVolumeValue.textContent = volume + '%';
    musicVolumeIcon.textContent =
      volume === 0 ? '🔇' :
      volume < 50 ? '🔉' : '🔊';

    musicVolume.setAttribute('aria-valuetext', volume + '%');
  }

  musicVolume.addEventListener('input', updateMusicVolume);
  updateMusicVolume();

  // Cargar una canción.
  function loadMusicTrack(index, autoplay = false) {
    currentTrack =
      (index + musicTracks.length) % musicTracks.length;

    const track = musicTracks[currentTrack];

    musicAudio.pause();
    musicAudio.src = track.src;
    musicAudio.load();

    musicTrackSelect.value = String(currentTrack);
    musicTrackTitle.textContent = track.title;
    musicPlay.textContent = '▶';
    musicPlay.setAttribute('aria-label', 'Reproducir música');

    if (autoplay) {
      playMusic();
    }
  }

  // Reproducir con control de errores.
  function playMusic() {
    musicAudio.play()
      .then(() => {
        musicPlay.textContent = 'Ⅱ';
        musicPlay.setAttribute('aria-label', 'Pausar música');
      })
      .catch(error => {
        musicPlay.textContent = '▶';
        console.error(
          'No se pudo reproducir:',
          musicAudio.currentSrc,
          error
        );
      });
  }

  // Elegir canción.
  musicTrackSelect.addEventListener('change', () => {
    loadMusicTrack(Number(musicTrackSelect.value));
  });

  // Canción anterior.
  musicPrev.addEventListener('click', () => {
    loadMusicTrack(currentTrack - 1, true);
  });

  // Siguiente canción.
  musicNext.addEventListener('click', () => {
    loadMusicTrack(currentTrack + 1, true);
  });

  // Reproducir o pausar.
  musicPlay.addEventListener('click', () => {
    if (musicAudio.paused) {
      playMusic();
    } else {
      musicAudio.pause();
    }
  });

  musicAudio.addEventListener('play', () => {
    musicPlay.textContent = 'Ⅱ';
    musicPlay.setAttribute('aria-label', 'Pausar música');
  });

  musicAudio.addEventListener('pause', () => {
    musicPlay.textContent = '▶';
    musicPlay.setAttribute('aria-label', 'Reproducir música');
  });

  // Pasar a la siguiente canción al terminar.
  musicAudio.addEventListener('ended', () => {
    loadMusicTrack(currentTrack + 1, true);
  });

  // Detectar archivos que no se pueden cargar.
  musicAudio.addEventListener('error', () => {
    musicPlay.textContent = '▶';

    console.error(
      'Error al cargar el audio:',
      musicAudio.currentSrc,
      musicAudio.error
    );
  });

  // Preparar la primera canción sin reproducirla automáticamente.
  loadMusicTrack(0);

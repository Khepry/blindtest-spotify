/*global swal*/

import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = 'BQB9r1Jp6_Sw2sWtfIdN_L-CL2a7wKfPNjVAoEsClJbPJVBrme8UocOxENgVFQ45B_FTFfsD57Aj95y33Jk4MgpPDE5iab05zNBi9JbEXjnoemMkf7tGdiJXgfROVWolD5Sa8fahkkIYtSJBoppA';

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

function getThreeDiffNumbers(x) {
  var L = [getRandomNumber(x),-1,-1] ;
  var i = 1 ;
  var flag = false ;
  while (!flag) {
    var j = getRandomNumber(x);
    if (j != L[0] & j!= L[1]) {
      L[i] = j;
      i+=1;
    }
    if (i === 3) {
      flag = true;
      }
    }
  return(L);
}

function checkAnswer(answerTrack, clickedTrack) {
  if (answerTrack === clickedTrack) {
    return(swal('Bravo', 'Tu as trouvé !', 'success')) ;
  } else {
    return(swal('Dommage !', "C'était : " + answerTrack.name, 'error')) ;
  }
}

const AlbumCover = (props) => {
  const src = props.track && props.track.album.images[0].url ;
  return(<img src={src} style={{width: 400, height: 400}} className="App-albumCover" alt="albumCover"/>) ;
}

const App = () => {
  const [text, setText] = useState('');
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [tracks, setTracks] = useState('');
  let i = getRandomNumber(tracks.length)

  useEffect(() => {
    setText("Bonjour");
    fetch('https://api.spotify.com/v1/me/tracks', {
  method: 'GET',
  headers: {
   Authorization: 'Bearer ' + apiToken,
  },
})
  .then(response => response.json())
  .then((data) => {
    console.log("Okidoki ! Voilà ce que j'ai reçu : ", data);
    setText("Attention c'est des musiques peu connues...");
    setSongsLoaded(true);
    setTracks(data.items);
  })
  }, [])

  const firstTrack = tracks && tracks[0].track ;
  i = getNewSongs(tracks.length, i, tracks) ;
  const [currentTrack, setCurrentTrack] = useState(firstTrack) ;
  const [randomTrack1, setRandomTrack1] = useState(tracks && tracks[1].track) ;
  const [randomTrack2, setRandomTrack2] = useState(tracks && tracks[2].track) ;

  var trackList = [currentTrack, randomTrack1, randomTrack2] ;
  var trackListRandomized = shuffleArray(trackList) ;

  function getNewSongs(x, oldTrackIndex, tracks) {
    const numberArray = getThreeDiffNumbers(x) ;
    const i = numberArray[0], j = numberArray[1], k = numberArray[2] ;
    while (i === oldTrackIndex) {
      const numberArray = getThreeDiffNumbers(x) ;
      const i = numberArray[0], j = numberArray[1], k = numberArray[2] ;
    }
    setCurrentTrack(tracks && tracks[i].track) ;
    setRandomTrack1(tracks && tracks[j].track) ;
    setRandomTrack2(tracks && tracks[k].track) ;
    return(i)
  }

  if (songsLoaded === false) {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Bienvenue sur le Blindtest de Rémy !</h1>
        </header>
        <div className="App-images">
          <p>{text}</p>
          <img src={loading} className="App-loading" alt="loading"/>
        </div>
        <div className="App-buttons">
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <Sound url={currentTrack.preview_url} playStatus={Sound.status.PLAYING}/>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Bienvenue sur le Blindtest de Rémy</h1>
        </header>
        <div className="App-images">
          <p>{text}</p>
          <p>Il y a {tracks.length} musiques chargées !!!</p>
          <AlbumCover track={currentTrack} />
        </div>
        <div className="App-buttons">
          {trackListRandomized.map(item => (<Button onClick={() => checkAnswer(currentTrack, item)}>{item.name}</Button>))}
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

const listOfThreeTracks = [
  {
    name: 'How Much a Dollar Cost',
    artist: 'Kendrick Lamar',
    album: 'To Pimp a Butterfly',
    id: 1,
  },
  {
    name: 'Future People',
    artist: 'Alabama Shakes',
    album: 'Sound & Color',
    id: 2,
  },
  {
    name: 'Tous Les Mêmes',
    artist: 'Stromae',
    album: 'Racine Carrée',
    id: 3,
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: listOfThreeTracks,
      playlistName: 'Cool Tracks',
      playlistTracks: listOfThreeTracks,
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }

  addTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let trackList = this.state.playlistTracks;
      trackList.push(track);
      this.setState({ playlistTracks: trackList });
    }
  }

  removeTrack(track) {
    let newTracks = this.state.playlistTracks.filter(playlistTrack => track.id !== playlistTrack.id);
    this.setState({ playlistTracks: newTracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

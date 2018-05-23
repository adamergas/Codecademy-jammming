let userAccessToken = '';
const clientId = '2d209018a04540789ef6a486a5d3aebf';
const redirectUri = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if(userAccessToken){
      return userAccessToken;
    }
    else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)){
      // set access token and expiration
      userAccessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    }
    else {
      window.location.replace(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`);
    }
  },

  search(term) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(jsonResponse.tracks){
        return jsonResponse.tracks.items.map((track) => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          };
        });
      }
    });
  },

  savePlaylist(playlistName, URIs) {
    if(playlistName && URIs.length){
      const accessToken = userAccessToken;
      const headers = {
        Authorization: `Bearer ${accessToken}`
      };
      let userID, playlistID;

      return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
        return response.json();
      }).then(jsonResponse => {
        userID = jsonResponse.id;

        //create the playlist
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
            "Content-Type": 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ name: playlistName}),
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
          playlistID = jsonResponse.id;

          //add to the playlist
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
            headers: {
              Authorization: `Bearer ${userAccessToken}`,
              "Content-Type": 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ uris: URIs }),
          });

        });

      });
    } else {
      return;
    }
  }
};

export default Spotify;

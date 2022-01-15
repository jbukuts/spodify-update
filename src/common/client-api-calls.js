const apiHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const baseAPIURL = "https://api.spotify.com/v1";

// changes the current player to the param passed
export function changeSpotifyPlayerById(accessToken, deviceId) {
  console.log("changing current player!");
  const data = {
    device_ids: [deviceId],
  };

  return fetch(`${baseAPIURL}/me/player`, {
    method: "PUT",
    headers: {
      ...apiHeaders,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
}

// get all the user's albums from spotify
export async function getUsersAlbumsSpotify(accessToken) {
  var fullAlbumList = [];
  try {
    let nextURL = `${baseAPIURL}/me/albums?limit=50&offset=0`;
    while (nextURL) {
      const res = await fetch(nextURL, {
        method: "GET",
        headers: {
          ...apiHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((response) => response.json());

      const { next, items } = res;
      fullAlbumList = [...fullAlbumList, ...items.map((a) => a.album)];
      nextURL = next;
    }

    return fullAlbumList
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((a) => a.name !== "");
  } catch (e) {
    console.error(e);
  }
  return fullAlbumList;
}

export async function playSongByAlbumURI(
  accessToken,
  albumURI,
  trackNumber = 0
) {
  const data = {
    context_uri: albumURI,
    offset: {
      position: trackNumber,
    },
    position_ms: 0,
  };

  // play the song
  await fetch(`https://api.spotify.com/v1/me/player/play`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
}

export async function playSongByURIList(accessToken, uriList, offset = 0) {
  const data = {
    uris: uriList,
    position_ms: 0,
    offset: {
      position: offset,
    },
  };

  // play the song
  await fetch(`https://api.spotify.com/v1/me/player/play`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
}

export async function getCurrentlyPlaying(accessToken) {
  try {
    return fetch(`${baseAPIURL}/me/player/currently-playing`, {
      headers: {
        ...apiHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((r) => r.json());
  } catch (e) {
    console.log("There was an error retrieving currently playing");
  }
  return null;
}

export async function getPlayBackState(accessToken) {
  try {
    return fetch(`${baseAPIURL}/me/player`, {
      headers: {
        ...apiHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((r) => r.json());
  } catch (e) {
    console.log("There was an error retrieving playback state");
  }
  return null;
}

export async function getAlbumById(accessToken, albumId) {
  try {
    return fetch(`${baseAPIURL}/albums/${albumId}`, {
      headers: {
        ...apiHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((r) => r.json());
  } catch (e) {
    console.log("There was an error retrieving the album");
  }
  return null;
}

// gets the users profile data
export function getProfileData(accessToken) {
  try {
    return fetch(`${baseAPIURL}/me`, {
      method: "GET",
      headers: {
        ...apiHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => response.json());
  } catch (e) {
    console.error("There was an issue getting users profile data", e);
  }
}

// change the users repeat mode setting
export function setUsersRepeatMode(accessToken, mode) {
  try {
    return fetch(`${baseAPIURL}/me/player/repeat?state=${mode}`, {
      method: "PUT",
      headers: {
        ...apiHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    console.error("Failed to set users repeat mode", e);
  }
}

// change the users repeat mode setting
export function toggleShuffleMode(accessToken, mode) {
  try {
    return fetch(`${baseAPIURL}/me/player/shuffle?state=${mode}`, {
      method: "PUT",
      headers: {
        ...apiHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    console.error("Failed to set users repeat mode", e);
  }
}

export function getSongLyrics(songName, artistName) {
  const base = "https://api.musixmatch.com/ws/1.1";
  const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
  const key = "019e8ab04d8e50cb6c95126cbdc81922";

  return fetch(
    `${corsAnywhere}${base}/track.search?q_track=${songName}&q_artist=${artistName}&apikey=${key}&f_has_lyrics=true`,
    {
      headers: {
        ...apiHeaders,
        // 'Authorization': `Bearer ${key}`
      },
    }
  )
    .then((r) => r.json())
    .then((r) => {
      const {
        header: { status_code },
        body: { track_list },
      } = r.message;
      if (status_code === 200 && track_list.length > 0) {
        const {
          track: { track_id },
        } = track_list[0];
        return fetch(
          `${corsAnywhere}${base}/track.lyrics.get?track_id=${track_id}&apikey=${key}`,
          {
            headers: {
              ...apiHeaders,
            },
          }
        )
          .then((r) => r.json())
          .then((r) => {
            const {
              header: { status_code },
            } = r.message;
            if (status_code === 200) {
              return {
                ok: true,
                data: r.message.body.lyrics,
              };
            }
            return { ok: false };
          });
      }

      return { ok: false };
    });
}

export function getArtistAlbumsById(accessToken, artistId, limit = 5) {
  try {
    return fetch(
      `${baseAPIURL}/artists/${artistId}/albums?include_groups=album&limit=${limit}`,
      {
        headers: {
          ...apiHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((r) => r.json());
  } catch (e) {
    console.log("There was an error retrieving the artist albums");
  }
  return null;
}

export function getMultipleAlbums(accessToken, ids) {
  const reducedIds = ids.join(",");
  try {
    return fetch(`${baseAPIURL}/albums?ids=${reducedIds}`, {
      headers: {
        ...apiHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((r) => r.json());
  } catch (e) {
    console.log("There was an error retrieving the artist albums");
  }
  return null;
}

export function performSearch(
  accessToken,
  queryString,
  types = "album",
  limit = 20
) {
  try {
    return fetch(
      `${baseAPIURL}/search?q=${queryString}&type=${types}&limit=${limit}`,
      {
        headers: {
          ...apiHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((r) => r.json());
  } catch (e) {
    console.log("There was an error retrieving the artist albums");
  }
  return null;
}

export function seekToPosition(accessToken, position) {
  try {
    return fetch(`${baseAPIURL}/me/player/seek?position_ms=${position}`, {
      method: "PUT",
      headers: {
        ...apiHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    console.log("There was an error retrieving the artist albums");
  }
  return null;
}

import { changeSpotifyPlayerById } from "./client-api-calls";
const DEFAULT_VOLUME = 0.08;
const DEFAULT_NAME = "My iPod";

export default function createPlayer(
  token,
  defVolume = DEFAULT_VOLUME,
  playName = DEFAULT_NAME
) {
  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js";
  script.async = true;

  document.body.appendChild(script);

  return new Promise((res) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: playName,
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: defVolume,
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        changeSpotifyPlayerById(token, device_id);
        res(player);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });
      player.connect();
    };
  });
}

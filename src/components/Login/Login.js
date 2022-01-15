const CLIENT_ID = "0981792b5bc94457a102687309d0beb6";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

export const PERMISSIONS = [
  "user-read-email",
  "user-library-read",
  "streaming",
  "user-read-private",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
];

const Login = () => {
  const generateRandomString = (length) => {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const logUserIn = () => {
    const scope = PERMISSIONS.reduce((acc, curr) => `${curr} ${acc}`, "");
    const state = generateRandomString(16);

    const queryOptions = new URLSearchParams({
      response_type: "token",
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state,
    });

    console.log("log user in");
    window.location.href = `${AUTH_ENDPOINT}?${queryOptions.toString()}`;
  };

  return (
    <>
      <h1>Login</h1>
      <button onClick={logUserIn}>Start</button>
    </>
  );
};

export default Login;

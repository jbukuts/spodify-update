import "./Login.css";

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

export const PERMISSIONS = [
  "user-read-email",
  "user-library-read",
  "user-library-modify",
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
      response_type: RESPONSE_TYPE,
      client_id: process.env.REACT_APP_CLIENT_ID,
      scope: scope,
      redirect_uri: window.location.href,
      state: state,
    });

    console.log("log user in");
    window.location.href = `${AUTH_ENDPOINT}?${queryOptions.toString()}`;
  };

  return (
    <div className="loginContainer">
      <h1 className="loginTitle">Login</h1>
      <button className="loginButton" onClick={logUserIn}>
        Start
      </button>
    </div>
  );
};

export default Login;

import utils from './utils.js'


let API_KEY = "AIzaSyCFRg7F-3SaOoZNVHy-YcIlTpWzdkMC1C0";
let CLIENT_ID = "200624216191-nujs4nugdo4171450bfmm55rk5fksdej.apps.googleusercontent.com"
let REDIRECT_URI = "https://bioanywhere.github.io/profile.html"
let SCOPES = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file";

let button = document.getElementById('button')

button.addEventListener('click',signIn)


async function signIn() {
  await utils.signIn(CLIENT_ID, REDIRECT_URI, SCOPES);

  // Initialize the gapi client with your API key
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    scope: SCOPES
  }).then(() => {
    // After the gapi client is initialized, you can start using it
    console.log('Google API client initialized successfully from script.js.');

    // Call the chart processing function or other API-related actions
    // ...
  });
}







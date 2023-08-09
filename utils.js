function signIn(clientId,redirectUri,scopes,response_type="token") {
  let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

/*
  let form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauth2Endpoint);
*/

  let params = {
    client_id: clientId,
    redirect_uri: "https://bioanywhere.github.io/oauth-callback.html",
    response_type: response_type,
    scope: scopes,
    include_granted_scopes: "true",
    state: "pass-through-value",
  };

  for (var p in params) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
   // form.appendChild(input);
  }

  //document.body.appendChild(form);

  //form.submit();

  // Construct the URL for Google login
  let loginUrl = oauth2Endpoint + "?" + new URLSearchParams(params).toString();

  // Redirect the user to the Google login page
  //window.location.href = loginUrl;

    // Open the Google login page in a new popup window
  const width = 600;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  const options = `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes,status=1`;
  window.open(loginUrl, "_blank", options);


}



function logout(access_token, redirect_url) {
  fetch("https://oauth2.googleapis.com/revoke?token=" + access_token, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
  }).then(() => {
    // Clear access token from localStorage
    localStorage.removeItem("access_token");
    // Redirect to the specified URL after logout
    location.href = redirect_url;
  });
}




function getParamsFromURL(url) {
  let params = {};

  let regex = /([^&=]+)=([^&]*)/g,
    m;

  while ((m = regex.exec(url))) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }

  return params;
}

function saveOAuth2Info(data, path, name) {
    if (Object.keys(data).length > 0) {
        localStorage.setItem(name, JSON.stringify(data))
    }

    // hide the access token

   // window.history.pushState({}, document.title, "/" + path)

}


let googleAPILoaded = false;

function loadGoogleAPI() {
  return new Promise((resolve, reject) => {
    if (googleAPILoaded) {
      resolve();
      return;
    }

    gapi.load('client', {
      callback: () => {
        googleAPILoaded = true;
        resolve();
      },
      onerror: reject,
      timeout: 10000,
    });
  });
}

export default{
    signIn,
    logout,
    saveOAuth2Info,
    getParamsFromURL,
    loadGoogleAPI // Include the new function

}

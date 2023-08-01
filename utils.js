function signIn(CLIENT_ID, REDIRECT_URI, SCOPES, response_type = "token") {
  let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

/*
  let form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauth2Endpoint);
*/

  let params = {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: response_type,
    scope: SCOPES,
    include_granted_scopes: "true",
    state: "pass-through-value",
  };

  // Construct the URL for Google login
  let loginUrl = oauth2Endpoint + "?" + new URLSearchParams(params).toString();

  // Redirect the user to the Google login page
  window.location.href = loginUrl;

/*
  for (var p in params) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
*/

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

export default{
    signIn,
    logout,
    saveOAuth2Info,
    getParamsFromURL
}

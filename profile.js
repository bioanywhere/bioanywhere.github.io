// profile.js
import utils from "./utils.js";

let params = utils.getParamsFromURL(location.href);
let ACCESS_TOKEN = "";
let redirect_url = "";

console.log("params:", params);

utils.saveOAuth2Info(params, "profile.html", "info");

let info = JSON.parse(localStorage.getItem("info"));
ACCESS_TOKEN = info.access_token;

console.log("info:", info);

fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
})
  .then((data) => data.json())
  .then((info) => {
    console.log("User Info:", info);
    document.getElementById("name").innerHTML += info.name;
    document.getElementById("image").setAttribute("src", info.picture);
  })
  .catch((error) => {
    console.error("Error fetching user info:", error);
  });

let button = document.getElementById("logout");
button.onclick = logout;

function logout() {
  utils.logout(ACCESS_TOKEN, redirect_url);
}

// Function to create a new document in Google Docs and insert json_data
async function report(access_token, json_data) {
  try {
    // Step 1: Create a new document in Google Docs
    console.log("Step 1: Creating a new document in Google Docs...");
    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'New Document', // Set the name of the new document
        mimeType: 'application/vnd.google-apps.document'
      })
    });

    // Log the request and response details
    console.log("Step 1: Request:", {
      method: 'POST',
      url: 'https://www.googleapis.com/drive/v3/files',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'New Document', // Set the name of the new document
        mimeType: 'application/vnd.google-apps.document'
      })
    });

    const responseData = await response.json();
    console.log("Step 1: Response data:", responseData);

    // Step 2: Insert json_data in the content of the new document
    if (responseData.id) {
      const documentId = responseData.id;
      console.log("Step 2: Inserting json_data in the new document...");
      const importResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${documentId}/import`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_data)
      });

      // Log the request and response details
      console.log("Step 2: Request:", {
        method: 'POST',
        url: `https://www.googleapis.com/upload/drive/v3/files/${documentId}/import`,
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_data)
      });

      const importResponseData = await importResponse.json();
      console.log("Step 2: Import Response data:", importResponseData);

      // Step 3: Return the URL of the new document just created
      const documentUrl = `https://docs.google.com/document/d/${documentId}`;
      console.log("Step 3: Document URL:", documentUrl);
      return documentUrl;
    } else {
      throw new Error('Failed to create a new document.');
    }
  } catch (error) {
    console.error('Error creating the report:', error);
    return null;
  }
}

// Event listener for the "Create Report" button
document.getElementById('Report').addEventListener('click', async () => {
  // Retrieve the access_token and json_data from the local storage
  const access_token = localStorage.getItem('access_token');
  const json_data = JSON.parse(localStorage.getItem('json_data'));

  console.log("Access Token:", access_token);
  console.log("JSON Data:", json_data);

  // Call the report function with the provided access_token and json_data
  const documentUrl = await report(access_token, json_data);

  // Step 4: Redirect the user to the new document after clicking on the "Create Report" button
  if (documentUrl) {
    console.log("Step 4: Redirecting to the new document:", documentUrl);
    window.location.href = documentUrl;
  } else {
    alert('Failed to create the report. Please try again later.');
  }
});

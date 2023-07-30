import utils from "./utils.js";

// Function to get nested properties from an object based on a dot-separated string
function getNestedProperty(obj, propString) {
  const props = propString.split('.');
  let value = obj;
  for (const prop of props) {
    if (value.hasOwnProperty(prop)) {
      value = value[prop];
    } else {
      return undefined; // Return undefined if the property doesn't exist
    }
  }
  return value;
}

// Function to create the multipart request body with metadata and JSON content
utils.createMultipartRequestBody = (json_data) => {
  // Define the metadata for the file (change as needed)
  const metadata = {
    name: "My Report", // The name of the file
    mimeType: "application/vnd.google-apps.document", // MIME type for Google Docs document
  };

  // Create the multipart request body
  const boundary = "-------" + Date.now();
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // Construct the metadata part of the request
  let requestBody = delimiter;
  requestBody += `Content-Type: application/json; charset=UTF-8\r\n\r\n`;
  requestBody += JSON.stringify(metadata);

  // Add the JSON content part of the request
  requestBody += delimiter;
  requestBody += `Content-Type: application/json\r\n\r\n`;
  requestBody += JSON.stringify(json_data);

  // Add the closing boundary
  requestBody += closeDelimiter;

  return requestBody;
};

let params = utils.getParamsFromURL(location.href);
let redirect_url = "";

console.log("params:", params);

utils.saveOAuth2Info(params, "profile.html", "info");

fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  headers: {
    Authorization: `Bearer ${params.access_token}`,
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

// ... (previous code)

// Event listener for the "Create Report" button
document.getElementById('Report').addEventListener('click', async () => {
  console.log("Button clicked.");
  // Retrieve the access_token from the local storage
  const access_token = JSON.parse(localStorage.getItem("info")).access_token;
  console.log("Access Token:", access_token);

  // Retrieve the JSON data from the local storage
  const json_data = JSON.parse(localStorage.getItem("json_data"));

  // Check if json_data exists
  if (!json_data) {
    console.error("JSON data not found in local storage.");
    return;
  } else {
    // Print the JSON data in the console
    console.log("JSON data*:", json_data);
  }

  // Function to store the template document ID in the local storage
  function setTemplateDocumentId(templateDocumentId) {
    localStorage.setItem("templateDocumentId", templateDocumentId);
  }

  const templateDocumentId = '132dW6-cb5w1io1tB8qkc6W1wpA2xpEntugZezycyUa0';
  setTemplateDocumentId(templateDocumentId);
  console.log("Template Document ID:", templateDocumentId);

  try {
    // Step 1: Duplicate the template document
    console.log("Step 1: Duplicating the template document...");
    const duplicateResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${templateDocumentId}/copy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: "My Report", // The name of the duplicated file
      }),
    });

    const duplicateData = await duplicateResponse.json();
    console.log("Step 1: Duplicated document ID:", duplicateData.id);

    // Step 2: Retrieve the content of the duplicated document as a Google Docs document
    console.log("Step 2: Retrieving the content of the duplicated document...");
    const contentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${duplicateData.id}?alt=media`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const content = await contentResponse.text();
    console.log("Step 2: Retrieved document content.");

    // Step 3: Use the content directly as Google Docs document
    console.log("Step 3: Using the content of the duplicated document...");

    // Append the JSON data to the end of the document
    const finalContent = `${content}\n\nJSON Data:\n${JSON.stringify(json_data, null, 2)}`;
    console.log("Step 4: JSON Data appended to the document content.");

    // Step 5: Upload the modified content back to the document as a new revision
    console.log("Step 5: Uploading the modified content to the document...");
    const updatedContentBlob = new Blob([finalContent], { type: 'application/vnd.google-apps.document' });

    try {
      // Send the PUT request to update the file content
      console.log("Sending PUT request to update file content...");

      const updateContentUrl = `https://www.googleapis.com/upload/drive/v3/files/${duplicateData.id}?uploadType=media`;
      const updateContentHeaders = {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/vnd.google-apps.document',
      };

      console.log("PUT Request URL:", updateContentUrl);
      console.log("PUT Request Headers:", updateContentHeaders);
      console.log("PUT Request Body (updatedContentBlob):", updatedContentBlob);

      try {
        const updateContentResponse = await fetch(updateContentUrl, {
          method: 'PUT',
          headers: updateContentHeaders,
          body: updatedContentBlob,
        });

        console.log("PUT Request Sent.");

        // Read the response as JSON
        const updateContentResponseData = await updateContentResponse.clone().json();

        console.log("PUT Response Data:", updateContentResponseData);

        // Handle the response as needed
        // ...
      } catch (error) {
        console.error('Error sending the PUT request:', error);
        alert('Failed to update the file content. Please try again later.');
      };

      console.log("Step 5: Document content updated successfully.");
      debugger;
      // Step 6: Return the URL of the modified document
      const documentUrl = `https://docs.google.com/document/d/${duplicateData.id}`;
      console.log("Step 6: Document URL:", documentUrl);
      debugger;
      window.location.href = documentUrl;
    } catch (error) {
      console.error('Error updating the document content:', error);
      alert('Failed to update the document content. Please try again later.');
    }

  } catch (error) {
    console.error('Error creating the report:', error);
    alert('Failed to create the report. Please try again later.');
  }
});

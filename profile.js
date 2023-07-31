import utils from "./utils.js";
import get from 'lodash.get';

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



// ... (Rest of the code)



// Function to get nested properties from an object based on a dot-separated string
function getNestedProperty(obj, propString) {
  return get(obj, propString); // Using lodash.get for robust nested property retrieval
}

// Helper function to convert the value to a string and handle special characters
function convertValueToString(value) {
  if (typeof value === "string") {
    // If the value is already a string, return it as is
    return value;
  } else if (typeof value === "number") {
    // If the value is a number, convert it to a string
    return value.toString();
  } else {
    // For other data types (e.g., boolean, null), handle them accordingly
    return value ? "true" : "false"; // Convert boolean to "true" or "false"
    // Handle null or other data types as needed
  }
}

// Function to replace placeholders in the Google Docs document using batchUpdate
async function replacePlaceholdersWithValues(docId, replacements) {
  const access_token = JSON.parse(localStorage.getItem("info")).access_token;
  const googleDocsApiUrl = `https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`;
  const googleDocsApiHeaders = {
    Authorization: `Bearer ${access_token}`,
    'Content-Type': 'multipart/related; boundary="-------${boundary}"',
  };

  // Create the multipart request body
  const boundary = "-------" + Date.now();
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // Construct the metadata part of the request
  let requestBody = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;

  // Add the JSON content part of the request
  requestBody += `${delimiter}Content-Type: application/json\r\n\r\n${JSON.stringify(json_data)}`;

  // Add the closing boundary
  requestBody += closeDelimiter;

  try {
    const batchUpdateResponse = await makeFetchRequest(googleDocsApiUrl, {
      method: 'POST',
      headers: googleDocsApiHeaders,
      body: requestBody,
    });

    const batchUpdateResponseData = await batchUpdateResponse.json();
    console.log("Step 3: Placeholders replaced with JSON values.");
    console.log("Batch Update Response Data:", batchUpdateResponseData);
  } catch (error) {
    console.error('Error replacing placeholders:', error);
    alert('Failed to replace placeholders. Please try again later.');
  }
}

// Function to make a fetch request and log the request and response
async function makeFetchRequest(url, options) {
  console.log("Making request:", url);
  console.log("Request Options:", options);

  try {
    const response = await fetch(url, options);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error('Error making the request:', error);
    throw error;
  }
}

// Function to store the template document ID in the local storage
function setTemplateDocumentId(templateDocumentId) {
  localStorage.setItem("templateDocumentId", templateDocumentId);
}

// Event listener for the "Create Report" button
document.getElementById('Report').addEventListener('click', async () => {
  console.log("Button clicked.");
  // Retrieve the access_token from the local storage
  const access_token = JSON.parse(localStorage.getItem("info")).access_token;
  console.log("Access Token:", access_token);

  // Retrieve the JSON data from the local storage
  const jsonData = JSON.parse(localStorage.getItem("json_data"));

  // Flatten the JSON
  const flattenedData = flattenJson(jsonData);

  try {
    // Step 1: Duplicate the template document
    console.log("Step 1: Duplicating the template document...");
    const templateDocumentId = localStorage.getItem("templateDocumentId");
    const duplicateResponse = await makeFetchRequest(`https://www.googleapis.com/drive/v3/files/${templateDocumentId}/copy`, {
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

    console.log("Step 2: Document content duplicated successfully.");

    // Step 3: Use the Google Docs API to replace placeholders with JSON values
    console.log("Step 3: Replacing placeholders with JSON values...");

    const batchUpdateRequests = flattenedData.map(item => {
      return {
        replaceAllText: {
          containsText: {
            text: `{{${item[0]}}}`, // Placeholder in double curly braces
            matchCase: false,
          },
          replaceText: convertValueToString(item[1]),
        },
      };
    });

    await replacePlaceholdersWithValues(duplicateData.id, batchUpdateRequests);

    // Step 4: Return the URL of the modified document
    const documentUrl = `https://docs.google.com/document/d/${duplicateData.id}`;
    console.log("Step 4: Document URL:", documentUrl);
    window.location.href = documentUrl;

  } catch (error) {
    console.error('Error creating the report:', error);
    alert('Failed to create the report. Please try again later.');
  }
});

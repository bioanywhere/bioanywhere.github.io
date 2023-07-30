import utils from "./utils.js";
import dataframe from "./dataframe.min.js";


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





// new aprroach



// Function to flatten the nested JSON data into an array of objects
function flattenJson(data, prefix = "") {
  let items = [];
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = data[key];
      if (typeof value === "object" && value !== null) {
        items = items.concat(flattenJson(value, newKey));
      } else {
        items.push({ Field: newKey, Value: value });
      }
    }
  }
  return items;
}

// Function to update the Google Docs document with DataFrame values
async function updateGoogleDocs(df) {
  // Retrieve the access_token from the local storage
  const access_token = JSON.parse(localStorage.getItem("info")).access_token;

  // Step 1: Duplicate the template document
  console.log("Step 1: Duplicating the template document...");
  const templateDocumentId = '132dW6-cb5w1io1tB8qkc6W1wpA2xpEntugZezycyUa0';

  try {
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

    // Step 2: Retrieve the content of the duplicated document
    console.log("Step 2: Retrieving the content of the duplicated document...");
    const contentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${duplicateData.id}?alt=media`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const contentText = await contentResponse.text();
    console.log("Step 2: Retrieved document content.");

    // Step 3: Replace the placeholders with DataFrame values
    let updatedContentText = contentText;
    df.toArray().forEach((row) => {
      const placeholder = `{{${row.Field}}}`;
      updatedContentText = updatedContentText.replace(new RegExp(placeholder, 'g'), row.Value);
    });

    // Step 4: Upload the modified content back to the document
    console.log("Step 4: Uploading the modified content to the document...");
    const updatedContentBlob = new Blob([updatedContentText], { type: 'application/vnd.google-apps.document' });

    try {
      const updateContentResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${duplicateData.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/vnd.google-apps.document',
        },
        body: updatedContentBlob,
      });

      console.log("Step 4: Document content updated successfully.");
      // Step 5: Return the URL of the modified document
      const documentUrl = `https://docs.google.com/document/d/${duplicateData.id}`;
      console.log("Step 5: Document URL:", documentUrl);
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
}

// Read JSON data from localStorage
const jsonData = JSON.parse(localStorage.getItem("json_data"));

// Flatten the 'Report' object from jsonData
const reportData = jsonData.Report;
const flattenedData = flattenJson(reportData);

// Convert flattened data to a DataFrame
const df = new dataframe.DataFrame(flattenedData); // Use the imported dataframe object


// Add the 'Placeholder' column with placeholders in the format {{Field}}
df.withColumn("Placeholder", (row) => `{{${row.Field}}}`);

// Displaying the final DataFrame with three columns: 'Field', 'Value', and 'Placeholder'
console.log(df.toString());

// Call the function to update the Google Docs document with the DataFrame values
updateGoogleDocs(df);

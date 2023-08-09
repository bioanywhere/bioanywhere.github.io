import utils from "./utils.js";

let params = utils.getParamsFromURL(location.href);
let ACCESS_TOKEN = params.access_token;
console.log("Access Token:", ACCESS_TOKEN);
let redirect_url = "https://bioanywhere.github.io/index.html";

let button = document.getElementById("logout");

console.log("params:", params);

//utils.saveOAuth2Info(params, "profile.html", "info");
/*
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

*/


button.onclick = logout;

function logout() {
  utils.logout(params.access_token, redirect_url);
}






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
    name: "My Assesssment", // The name of the file
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





// Main entry point when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Get the OAuth2 information from localStorage
  const info = JSON.parse(localStorage.getItem("info"));

  if (info) {
    // If the OAuth2 information exists, fetch user information from Google API
    fetchUserInfo(info);
  } else {
    // If the OAuth2 information is not available, wait for it to become available before fetching user info
    waitForOAuth2Info().then((params) => {
      fetchUserInfo(params);
    });
  }
});

function waitForOAuth2Info() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      // Get the OAuth2 information from localStorage
      const info = JSON.parse(localStorage.getItem("info"));
      if (info) {
        clearInterval(interval);
        resolve(info);
      }
    }, 200);
  });
}



// Define a global variable to store the access token
let accessToken;
let UserInfo;

function fetchUserInfo(params) {
  // Store the access token in the global variable
  accessToken = params.access_token;

  // Check if the access token is available
  if (!accessToken) {
    console.error("Access token not available.");
    return;
  }

  // Make a fetch request to get user information from the Google API
  fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((info) => {
      console.log("User Info:", info);
      userInfo = info; // Store the user info in the variable



      // Replace the <name> placeholder with the user's full name
      const nameElement = document.getElementById("name");
      if (nameElement) {
        nameElement.textContent = info.name;
        // Show the name element after data is available
        nameElement.style.display = "inline";
      }

      // Set the 'onload' event for the image element to ensure it's displayed after the image is fully loaded
      const imageElement = document.getElementById("image");
      if (imageElement) {
        imageElement.onload = () => {
          // Display the image element after it's loaded
          imageElement.style.display = "inline";
        };
        // Set the 'src' attribute to trigger the image load
        imageElement.src = info.picture;
      }
    })
    .catch((error) => {
      console.error("Error fetching user info:", error);
    });
}

 console.log("User email:", userInfo.email);




// ... (Rest of the code)


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




// Event listener for the "Create Report" button
document.getElementById('Report').addEventListener('click', async () => {
  console.log("Button clicked.");
  // Retrieve the access_token from the local storage
  const access_token = JSON.parse(localStorage.getItem("info")).access_token;
  console.log("Access Token:", access_token);

  // Retrieve the JSON data from the local storage
  const jsonData = JSON.parse(localStorage.getItem("json_data"));

  // Helper function to flatten the nested JSON
  function flattenJson(data, prefix = '') {
    let items = [];
    for (let key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        items = items.concat(flattenJson(data[key], prefix ? prefix + '.' + key : key));
      } else {
        items.push([prefix ? prefix + '.' + key : key, data[key]]);
      }
    }
    return items;
  }

  // Flatten the JSON
  const flattenedData = flattenJson(jsonData);

  // Convert flattened data to DataFrame format
  const df = flattenedData.map(item => {
    return { 'Field': item[0], 'Value': item[1], 'Placeholder': `{{${item[0]}}}` };
  });


  // Display the DataFrame
  console.log(df);

  // Function to store the template document ID in the local storage
  function setTemplateDocumentId(templateDocumentId) {
    localStorage.setItem("templateDocumentId", templateDocumentId);
  }

  const templateDocumentId = '132dW6-cb5w1io1tB8qkc6W1wpA2xpEntugZezycyUa0';
  setTemplateDocumentId(templateDocumentId);
  console.log("Template Document ID:", templateDocumentId);



  // Function to store the template document ID in the local storage
  function setTemplateSheetId(templateSheetId) {
    localStorage.setItem("templateSheetId", templateSheetId);
  }

  const templateSheetId = '1998aLLtmz0tq0RfSAYAdUXc0aF2JU2jE-tl7bVrXbpM';
  setTemplateSheetId(templateSheetId);
  console.log("Template Sheet ID:", templateSheetId);







    // Step 1: Duplicate Google Sheets Template


    console.log("Step 1: Duplicating Google Sheets Template...");
    const duplicateSheetResponse = await makeFetchRequest(`https://www.googleapis.com/drive/v3/files/${templateSheetId}/copy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: "My Data", // The name of the duplicated file
      }),
    });

    const duplicateSheet = await duplicateSheetResponse.json();
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${duplicateSheet.id}`;
    console.log("Step 1: Duplicated sheet ID:", duplicateSheet.id);



    // Step 2: Copy Permissions of Charts
    const originalSheetId = templateSheetId; // Replace this with the ID of the original sheet
    const copiedSheetId = duplicateSheet.id; // ID of the duplicated sheet

    // Fetch original sheet's permissions
    const originalPermissionsResponse = await makeFetchRequest(`https://www.googleapis.com/drive/v3/files/${originalSheetId}/permissions`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const originalPermissions = await originalPermissionsResponse.json();

    // Apply original sheet's permissions to the duplicated sheet
    for (const permission of originalPermissions.permissions) {
      await makeFetchRequest(`https://www.googleapis.com/drive/v3/files/${copiedSheetId}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permission),
      });
    }

    console.log("Step 2: Permissions of individual charts copied successfully.");















// *****************


console.log("*******Sheet ID****:", copiedSheetId);
console.log("******Access Token:*****", accessToken);


/*
async function callWebAppWithAccessTokenAndSpreadsheetId(accessToken, copiedSheetId) {
  console.log("Calling Google Apps Script");
  var webAppUrl = `https://script.google.com/macros/s/AKfycbwFjj2Gk0X3a8kiZW6krKUCR9ZxyKBFeu4dPIKONuZUQ7C8OCCR_XckH8jYLe7de9ia/exec?accessToken=${accessToken}&spreadsheetId=${copiedSheetId}`;


  try {
    var response = await fetch(webAppUrl);
    var data = await response.json();

    // Log the response status and data
    console.log('Response Status:', response.status);
    console.log('Response Data:', data);

    // Process the data received from the web app, if necessary
    // ...
  } catch (error) {
    console.error('Error:', error);
  }
}


callWebAppWithAccessTokenAndSpreadsheetId(accessToken, copiedSheetId);

*/


function callAnvilEndpoint(copiedSheetId, accessToken) {
  // Proxy API
  const apiUrl = "https://sheets.anvil.app/_/api/hello_world_endpoint";

  const data = {
    copiedSheetId: copiedSheetId,
    accessToken: accessToken,
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((message) => {
      // Save the response to a variable
      const responseFromAnvil = message;
      console.log("Response from Anvil:", responseFromAnvil);

    })
    .catch((error) => {
      console.error("Error calling Anvil endpoint:", error);
    });
}


callAnvilEndpoint(copiedSheetId, accessToken);



/*
async function publishAllCharts(copiedSheetId, accessToken) {
  console.log('Fetching spreadsheet data...');
  const sheetsResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${copiedSheetId}?includeGridData=false`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (sheetsResponse.status !== 200) {
    console.error('Failed to fetch spreadsheet data:', sheetsResponse.status, sheetsResponse.statusText);
    return [];
  }

  console.log('Spreadsheet data fetched successfully.');
  const sheetsData = await sheetsResponse.json();

  const chartInfo = [];

  for (const sheet of sheetsData.sheets) {
    const sheetName = sheet.properties.title;
    const charts = sheet.charts || [];
    for (const chart of charts) {
      const chartId = chart.chartId;
      const chartType = chart.chartType;
      const position = chart.position;
      const hiddenDimensionStrategy = chart.hiddenDimensionStrategy;
      const title = chart.spec.title;
      const xAxis = chart.spec.xAxis;
      const yAxis = chart.spec.yAxis;
      const legendPosition = chart.spec.legendPosition;

      chartInfo.push({
        sheetName: sheetName,
        chartId: chartId,
        chartType: chartType,
        position: position,
        hiddenDimensionStrategy: hiddenDimensionStrategy,
        title: title,
        xAxis: xAxis,
        yAxis: yAxis,
        legendPosition: legendPosition
      });
    }
  }

  console.log('Chart information retrieved:', chartInfo);
  return chartInfo;
}


publishAllCharts(copiedSheetId, accessToken)
  .then(result => console.log('Chart Information:', result))
  .catch(error => console.error('Error:', error));


*/


/*
console.log("*******Sheet ID****:", copiedSheetId);
console.log("******Access Token:*****", accessToken);



// Replace 'YOUR_API_ENDPOINT' with the actual URL of your Anvil server endpoint
const apiEndpoint = 'https://sheets.anvil.app/_/api/get_charts_data_proxy';


// Function to print the request details
function printRequestDetails(request) {
  console.log('Request URL:', request.url);
  console.log('Request Method:', request.method);
  console.log('Request Headers:', request.headers);
}

// Create the request object
const request = new Request(`${apiEndpoint}?copiedSheetId=${copiedSheetId}&accessToken=${accessToken}`, {
  method: 'POST',
  mode: 'no-cors', // Set the mode to 'no-cors'
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*' // Include the Access-Control-Allow-Origin header
  },
});

// Print the request details
printRequestDetails(request);

// Make the fetch request
fetch(request)
  .then((response) => response.json())
  .then((data) => {
    // Handle the response data from the server
    console.log('Received Response Data:', data);

    // Your code to process the response data goes here
  })
  .catch((error) => {
    console.error('Error:', error);
    // Handle any errors that occurred during the request
  });



*/

/*

// Function to fetch chart data from Anvil API
async function fetchChartData(copiedSheetId, accessToken) {
  try {
    const anvilEndpointURL = "https://sheets.anvil.app/_/api/get_charts_data_proxy";

    const requestData = {
      sheet_id: copiedSheetId,
      access_token: accessToken
    };

    console.log("Request Data:", requestData);

    const response = await fetch(anvilEndpointURL, {
      method: 'POST',
      mode: 'no-cors', // Set the mode to 'no-cors'
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Include the Access-Control-Allow-Origin header
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const chartData = await response.json();
    console.log("Response Data:", chartData);

    // Use the chart data here as needed
    console.log("Sheet ID (from response):", chartData.sheet_id);
    console.log("Access Token (from response):", chartData.access_token);
    return chartData;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}


const chartData = await fetchChartData(copiedSheetId, accessToken);
console.log("Chart Data:", chartData); // Print the chartData in the console
*/

/*
  // Fetch and print the SVG content of the chart
  const chartData = await getChartData(sheetId, chart.chartId);
  console.log("SVG Content:", chartData.currentChartData);

  // Add the SVG content to the DataFrame
  df.push({
    'Field': chart.chart.title || `Chart ${index + 1}`,
    'Value': chartData.currentChartData,
    'Placeholder': `{{chart${index + 1}}}`,
  });

  console.log("--------------");
}

console.log("Step 2: Finished listing and printing charts.");
*/




// *****************






    // Step 1: Duplicate Google Docs Template
    console.log("Step 1: Duplicating the template document...");
    const duplicateResponse = await makeFetchRequest(`https://www.googleapis.com/drive/v3/files/${templateDocumentId}/copy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: "My Report", // The name of the duplicated file
        description: `This document is linked to the Google Sheet: ${sheetUrl}`, // Set the description during duplication

      }),
    });

    const duplicateData = await duplicateResponse.json();
    const documentUrl = `https://docs.google.com/document/d/${duplicateData.id}`;
    console.log("Step 1: Duplicated document ID:", duplicateData.id);

    // Add URLs at the end of the DataFrames
    df.push({ 'Field': 'documentUrl', 'Value': documentUrl, 'Placeholder': '{{documentUrl}}' });
    df.push({ 'Field': 'sheetUrl', 'Value': sheetUrl, 'Placeholder': '{{sheetUrl}}' });

    

 



// ------------------- Google Sheets -------------------



    // Step 2: Helper function to replace placeholders in a Google Sheets document

        console.log("Step 2: Replacing placeholders with DataFrame values in New Google Sheets...");

        const batchUpdateSheetRequests = df.map((item) => {
          return {
            findReplace: {
              find: item.Placeholder,
              replacement: JSON.stringify(item.Value), // Ensure that the value is properly escaped
              allSheets: true,
            },
          };
        });


        const googleSheetsApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${duplicateSheet.id}:batchUpdate`;
        const googleSheetsApiHeaders = {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        };

        const batchUpdateResponse2 = await makeFetchRequest(googleSheetsApiUrl, {
          method: "POST",
          headers: googleSheetsApiHeaders,
          body: JSON.stringify({
            requests: batchUpdateSheetRequests,
          }),
        });

        const batchUpdateResponseSheet = await batchUpdateResponse2.json();
        console.log("Step 2: Placeholders replaced in Sheets with DataFrame values.");
        console.log("Batch Update Response Sheet:", batchUpdateResponseSheet);



      // Step 3: Set sharing settings to make the **sheet document** publicly accessible
      console.log("Step 3: Setting sharing settings for the sheet...");

      const setSharingResponseSheet = await fetch(`https://www.googleapis.com/drive/v3/files/${duplicateSheet.id}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      });

      const setSharingSheet = await setSharingResponseSheet.json();
      console.log("Step 3: Sharing of sheet settings updated:", setSharingSheet);


      // Step 4: Return the URL of the modified Sheet
      console.log("Step 4: Sheet URL:", sheetUrl);




// ------------------- Google Docs -------------------




  try {


    // Step 2: Use the Google Docs API to replace placeholders with DataFrame values
    console.log("Step 2: Replacing placeholders with DataFrame values in Docs...");

  const batchUpdateRequests = df.map(item => {
    return {
      replaceAllText: {
        containsText: {
          text: item.Placeholder,
          matchCase: false, // Set to false for an exact match
        },
        replaceText: JSON.stringify(item.Value), // Ensure that the value is properly escaped
      },
    };
  });

    const googleDocsApiUrl = `https://docs.googleapis.com/v1/documents/${duplicateData.id}:batchUpdate`;
    const googleDocsApiHeaders = {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    };

    try {
      const batchUpdateResponse = await makeFetchRequest(googleDocsApiUrl, {
        method: 'POST',
        headers: googleDocsApiHeaders,
        body: JSON.stringify({
          requests: batchUpdateRequests,
        }),
      });

      const batchUpdateResponseData = await batchUpdateResponse.json();
      console.log("Step 2: Placeholders replaced in Doc with DataFrame values.");
      console.log("Batch Update Response Data in Doc:", batchUpdateResponseData);


    } catch (error) {
      console.error('Error replacing placeholders in Doc:', error);
      alert('Failed to replace placeholders in Doc. Please try again later.');
    }



      // Step 3: Set sharing settings to make the document publicly accessible
      console.log("Step 3: Setting sharing settings for Doc...");

      const setSharingResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${duplicateData.id}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      });

      const setSharingData = await setSharingResponse.json();
      console.log("Step 3: Sharing of Document settings updated:", setSharingData);



      // Step 5: Return the URL of the modified Document
      console.log("Step 4: Document URL:", documentUrl);

      debugger;
      window.location.href = documentUrl;



  } catch (error) {
    console.error('Error creating the report:', error);
    alert('Failed to create the report. Please try again later.');
  }
});

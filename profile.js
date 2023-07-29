import utils from "./utils.js";

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

// Event listener for the "Create Report" button
document.getElementById('Report').addEventListener('click', async () => {

  // Retrieve the access_token and json_data from the local storage
  const access_token = JSON.parse(localStorage.getItem("info")).access_token;
  const json_data = JSON.parse(localStorage.getItem("json_data"));

  // Retrieve the template document ID from the local storage
  const templateDocumentId = localStorage.getItem("templateDocumentId");


  console.log("Access Token:", access_token);
  console.log("JSON Data:", json_data);

  console.log("Template Document ID:", templateDocumentId);


  try {
    // Step 1: Duplicate the template document
    console.log("Step 1: Duplicating the template document...");
    const templateDocumentId = '132dW6-cb5w1io1tB8qkc6W1wpA2xpEntugZezycyUa0'; // Replace this with your actual Google Docs template document ID
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
    const contentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${duplicateData.id}/export?mimeType=application/vnd.openxmlformats-officedocument.wordprocessingml.document`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const contentBlob = await contentResponse.blob();
    console.log("Step 2: Retrieved document content.");

    // Step 3: Read the content of the duplicated document as text
    console.log("Step 3: Reading the content of the duplicated document as text...");
    const contentText = await contentBlob.text();

// Step 4: Replace the variables in the content with JSON data
console.log("Step 4: Replacing variables in the document content...");

// Function to manually replace variables in the content using the provided JSON data
function replaceVariables(match, variableName) {
  // Manually map the variableName to the corresponding value in the json_data object
  const mapping = {
    "Company.Name": json_data.Company.Name,
    "Company.Date_Founded": json_data.Company.Date_Founded,
    "Company.Address": json_data.Company.Address,
    "Company.Phone_Number": json_data.Company.Phone_Number,
    "Company.Website": json_data.Company.Website,
    "Company.Sector": json_data.Company.Sector,
    "Company.Description": json_data.Company.Description,
    "Company.Gross_Profit": json_data.Company.Gross_Profit,
    "Company.Revenue": json_data.Company.Revenue,
    "Company.Gross_Profit_Margin": json_data.Company.Gross_Profit_Margin,
    "Company.Full_Time_Employees": json_data.Company.Full_Time_Employees,
    "Company.Part_Time_Employees": json_data.Company.Part_Time_Employees,
    "Company.Part_Time_Employee_Composition": json_data.Company.Part_Time_Employee_Composition,
    "Company.Number_of_Owners": json_data.Company.Number_of_Owners,
    "Company.Women_Owners": json_data.Company.Women_Owners,
    "Company.Women_Owners_Ratio": json_data.Company.Women_Owners_Ratio,
    "Company.Indigenous_Owners": json_data.Company.Indigenous_Owners,
    "Company.Indigenous_Owners_Ratio": json_data.Company.Indigenous_Owners_Ratio,
    "Company.Contact_Information": json_data.Company.Contact_Information,
    "Company.Full_Time_Employee_Composition": json_data.Company.Full_Time_Employee_Composition,
    "Company.Governance[0].Purpose": json_data.Company.Governance[0].Purpose,
    "Company.Governance[0].Executive_Responsibilities": json_data.Company.Governance[0].Executive_Responsibilities,
    "Company.Governance[0].Stakeholder_Engagement": json_data.Company.Governance[0].Stakeholder_Engagement,
    "Company.Governance[0].Strategic_Planning": json_data.Company.Governance[0].Strategic_Planning,
    "Company.Governance[0].Risk_Management_Process": json_data.Company.Governance[0].Risk_Management_Process,
    "Company.Governance[0].Disclosures_Reports": json_data.Company.Governance[0].Disclosures_Reports,
    "Company.Governance[0].Decision_Making": json_data.Company.Governance[0].Decision_Making,
    "Company.Governance[0].Research_and_Development": json_data.Company.Governance[0].Research_and_Development,
    "Company.Governance[0].Competency_Maps": json_data.Company.Governance[0].Competency_Maps,
    "Company.Governance[0].Executive_Compensation": json_data.Company.Governance[0].Executive_Compensation,
    "Company.Governance[0].Description": json_data.Company.Governance[0].Description,
    "Company.Governance[0].Overall_Score": json_data.Company.Governance[0].Overall_Score,
    "Company.Business_Model[0].Traditional_Flows": json_data.Company.Business_Model[0].Traditional_Flows,
    "Company.Business_Model[0].Nested_Interdependencies": json_data.Company.Business_Model[0].Nested_Interdependencies,
    "Company.Business_Model[0].Impact_Points": json_data.Company.Business_Model[0].Impact_Points,
    "Company.Business_Model[0].Value": json_data.Company.Business_Model[0].Value,
    "Company.Business_Model[0].Risks": json_data.Company.Business_Model[0].Risks,
    "Company.Business_Model[0].Reputation": json_data.Company.Business_Model[0].Reputation,
    "Company.Business_Model[0].Score": json_data.Company.Business_Model[0].Score,
  };

  // Check if the variableName exists in the mapping
  if (mapping.hasOwnProperty(variableName)) {
    return mapping[variableName];
  } else {
    return `{{${variableName}}}`; // Fallback to the original placeholder if key not found
  }
}

// Use a regular expression to find and replace all variables in the content
const replacedContent = contentText.replace(/\{\{(.+?)\}\}/g, replaceVariables);

console.log("Step 4: Variables replaced in the document content.");

// Step 5: Upload the modified content back to the document
console.log("Step 5: Uploading the modified content to the document...");
const updatedContentBlob = new Blob([replacedContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
const updateContentResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${duplicateData.id}`, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${access_token}`,
    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  body: updatedContentBlob,
});

console.log("Step 5: Document content updated successfully.");

// Step 6: Return the URL of the modified document
const documentUrl = `https://docs.google.com/document/d/${duplicateData.id}`;
console.log("Step 6: Document URL:", documentUrl);
window.location.href = documentUrl;
  } catch (error) {
    console.error('Error creating the report:', error);
    alert('Failed to create the report. Please try again later.');
  }
});
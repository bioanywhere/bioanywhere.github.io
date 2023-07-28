// Event listener for the "Create Report" button
document.getElementById('Report').addEventListener('click', async () => {
  // Retrieve the access_token and json_data from the local storage
  const access_token = JSON.parse(localStorage.getItem("info")).access_token;
  const json_data = JSON.parse(localStorage.getItem("json_data"));

  console.log("Access Token:", access_token);
  console.log("JSON Data:", json_data);

  try {
    // Step 1: Create a new document in Google Docs with JSON content
    console.log("Step 1: Creating a new document in Google Docs...");
    const createFileResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json_data),
      data: {  // Add the data object with name and mimeType
        "name": "Impact Report",
        "mimeType": "application/vnd.google-apps.document"
      }
    });

    const responseData = await createFileResponse.json();
    console.log("Step 1: Response data:", responseData);

    // Step 2: Return the URL of the new document just created
    const documentUrl = `https://docs.google.com/document/d/${responseData.id}`;
    console.log("Step 2: Document URL:", documentUrl);
    window.location.href = documentUrl;
  } catch (error) {
    console.error('Error creating the report:', error);
    alert('Failed to create the report. Please try again later.');
  }
});

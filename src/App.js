import React, { useState, useRef } from "react";
import { faker } from "@faker-js/faker";
import "./App.css";

function App() {
  const [webhookURL, setWebhookURL] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [jsonSchema, setJsonSchema] = useState("");
  const [logs, setLogs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jsonError, setJsonError] = useState(null);

  const generationInterval = useRef(null);


  const validateJson = jsonString => {
    try {
      JSON.parse(jsonString);
      setJsonError(null);
      return true;
    } catch (error) {
      setJsonError("Invalid JSON format");
      return false;
    }
  };

  const isFakerPathValid = path => {
    return path
      .split(".")
      .reduce((acc, curr) => (acc && acc[curr] ? acc[curr] : null), faker);
  };

  const generateDataAndSend = () => {
    const generatedData = JSON.parse(
      jsonSchema.replace(/"\${(.+?)}"/g, (_, match) => {
        const fakerValue = isFakerPathValid(match)
          ? faker.helpers.fake(`{{${match}}}`)
          : faker.random.word(); // Fallback to a random word if the path is invalid.
        return JSON.stringify(fakerValue);
      })
    );
    setLogs(prevLogs => [
      ...prevLogs,
      `Sent: ${JSON.stringify(generatedData)}`,
    ]);

    console.log('URL:', webhookURL);
    console.log('Headers:', {
        "Content-Type": "application/json",
        Authorization: `${authPassword}`,
    });
    console.log('Body:', JSON.stringify(generatedData));

    fetch('https://cors-anywhere.herokuapp.com/' + webhookURL, {
      method: "POST",
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authPassword}`,
      },
      body: JSON.stringify(generatedData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Handle response data if needed
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
        setLogs(prevLogs => [...prevLogs, `Error: ${error.message}`]);
      });
  };

  const startGeneration = () => {
    if (!webhookURL || !authPassword) {
      alert("Webhook URL and Auth Password cannot be empty!");
      return;
    }
    if (validateJson(jsonSchema)) {
      setIsGenerating(true);
      generationInterval.current = setInterval(generateDataAndSend, 1000);
    }
  };

  const stopGeneration = () => {
    setIsGenerating(false);
    clearInterval(generationInterval.current);
    generationInterval.current = null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Webhook Tester</h1>
          <div className="flex space-x-4 mb-4">
            <input
              className="border p-2 flex-1 mr-2"
              placeholder="Webhook URL"
              value={webhookURL}
              onChange={e => setWebhookURL(e.target.value)}
            />
            <input
              className="border p-2 flex-1"
              type="password"
              placeholder="Auth Password"
              value={authPassword}
              onChange={e => setAuthPassword(e.target.value)}
            />
          </div>
          {!isGenerating ? (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={startGeneration}
            >
              Start Generating
            </button>
          ) : (
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={stopGeneration}
            >
              Stop
            </button>
          )}
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              className="border p-2 w-full h-64 resize-none"
              placeholder='Enter JSON schema with faker.js values e.g. { "name": "${name.firstName}" }'
              value={jsonSchema}
              onChange={e => {
                setJsonSchema(e.target.value);
                validateJson(e.target.value);
              }}
            />
            {jsonError && <p className="text-red-500 mt-2">{jsonError}</p>}
          </div>
          <div className="flex-1 p-4 border rounded overflow-y-scroll">
            <p className="font-bold mb-4">Logs:</p>
            <div className="h-64 overflow-y-scroll">
              {logs.map((log, index) => (
                <p key={index} className="border-b border-gray-200 py-1">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

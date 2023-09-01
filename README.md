# Webhook Tester with Faker.js

A simple React application to generate and send fake data based on a JSON schema to a specified webhook. Built with Tailwind CSS for styling and faker.js for data generation.

## Features

- Input field for webhook URL and authentication password.
- TextArea for entering a JSON schema with faker.js syntax.
- Button to start and stop the data generation process.
- Live log of messages being sent.

## Getting Started

### Prerequisites

- Node.js
- `npm`

### Installation

1.  Clone the repository:

    ```sh
    git clone https://github.com/bobbyiliev/webhook-tester.git
    ```

2.  Navigate to the project directory:

    ```sh
    cd webhook-tester
    ```

3.  Install dependencies:

    ```sh
    npm install
    ```

4.  Start the development server:

    ```sh
    npm start
    ```

5.  Example JSON schema:

    ```json
    {
      "user": {
        "firstName": "${name.firstName}",
        "lastName": "${name.lastName}",
        "email": "${internet.email}",
        "avatar": "${image.avatar}",
        "birthdate": "${date.past(30, '2000-01-01')}",
        "address": {
          "city": "${address.city}",
          "state": "${address.state}",
          "country": "${address.country}",
          "zipcode": "${address.zipCode}"
        },
        "website": "${internet.url}",
        "company": {
          "name": "${company.name}",
          "industry": "${company.buzzVerb}"
        }
      }
    }
    ```

Open [http://localhost:3000](http://localhost:3000/) to view the app in the browser.

> **Warning:** As a temporary workaround, you may need to disable CORS by visiting https://cors-anywhere.herokuapp.com/corsdemo and clicking the button to request temporary access to the demo server.

## Usage

1.  Enter your webhook URL and authentication password.
2.  Provide a JSON schema with faker.js placeholders. (Example: `{ "name": "${name.firstName}" }`).
3.  Press 'Start Generating' to begin sending fake data to your webhook.
4.  View the logs on the right side to monitor the sent data.
5.  Press 'Stop' anytime to halt the data generation.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

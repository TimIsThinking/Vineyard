# Vineyard
Collects statistics from Mount & Blade servers and makes them available through an API


## Installation

### Prerequisites

[Node.js](https://nodejs.org/en/) >= 8.11.1

A mongo db database (recommend mlab)

Create a .env file in your project directory and setup environment variables
.env.example contains the used variable names

```
PORT=        Port to run the server on
SECRET=      Secret key for signing JWT tokens
MONGODB_URL= MongoDB connection URL
```

### Setup

Clone the repository

`git clone git@github.com:13Tim37/Vineyard.git`

Install packages

`npm install`

Start the server

`npm run start`

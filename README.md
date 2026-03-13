# SpendSmart 💸

A full-stack expense tracker built with the MERN stack.

## Features
- Add and delete transactions
- Track income and expenses
- Visual breakdown with doughnut chart
- Category-based spending overview
- Dark modern UI

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Styling:** Custom CSS

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Installation

1. Clone the repo
```bash
   git clone https://github.com/YOURUSERNAME/SpendSmart.git
```

2. Install server dependencies
```bash
   cd server
   npm install
```

3. Install client dependencies
```bash
   cd ../client
   npm install
```

4. Create `server/config.env` and add:
```
   ATLAS_URI=your_mongodb_connection_string
   PORT=5000
```

5. Run the server
```bash
   cd server
   node server.js
```

6. Run the client
```bash
   cd client
   npm start
```

THANKYOU!
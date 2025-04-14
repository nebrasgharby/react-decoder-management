# Decoder Management System

A full-stack application for managing clients and their assigned decoders with channel management capabilities.

## Features

- **User Authentication**
  - Role-based access (Admin/Client)
  - Secure JWT token implementation
  - Protected routes

- **Client Management**
  - Create, view, update, and delete clients
  - Assign/unassign decoders to clients
  - Role assignment (Admin/Client)

- **Decoder Management**
  - View decoder status (Active/Inactive)
  - Perform operations (Restart, Reinit, Shutdown)
  - Channel management (Add/Remove channels)

- **Admin Dashboard**
  - Overview of all clients and decoders
  - Quick action buttons for common operations
  - Real-time status updates

## Technologies Used

### Frontend
- React.js
- React Router
- Axios (HTTP client)
- React Icons
- Bootstrap 5 (Styling)
- Context API (State management)

### Backend
- Node.js
- Express.js
- Prisma (ORM)
- PostgreSQL (Database)
- JWT (Authentication)
- Bcrypt (Password hashing)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- Git

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/decoder-management-system.git
   cd decoder-management-system/backend
Install dependencies:

bash
Copy
npm install
Set up environment variables:

bash
Copy
cp .env.example .env
Edit .env with your configuration.

Run database migrations:

bash
Copy
npx prisma migrate dev
Start the server:

bash
Copy
npm start
Frontend Setup
Navigate to the frontend directory:

bash
Copy
cd ../frontend
Install dependencies:

bash
Copy
npm install
Start the development server:

bash
Copy
npm start
Project Structure
Copy
decoder-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── middlewares/      # Authentication middleware
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   ├── prisma/           # Database schema
│   │   └── app.js            # Main application file
│   ├── .env.example          # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # Auth context
│   │   ├── pages/            # Application pages
│   │   ├── utils/            # API calls and utilities
│   │   └── App.js            # Main application component
│   └── package.json
│
├── .gitignore
└── README.md
API Endpoints
Method	Endpoint	Description	Authentication
POST	/api/auth/login	User login	Public
GET	/api/clients	Get all clients	Admin only
POST	/api/clients	Create new client	Admin only
DELETE	/api/clients/:id	Delete client	Admin only
GET	/api/decodeurs	Get all decoders	Authenticated
PUT	/api/decodeurs/:id/assign	Assign decoder to client	Admin only
PUT	/api/decodeurs/:id/unassign	Unassign decoder	Admin only
POST	/api/decodeurs/:id/restart	Restart decoder	Authenticated
Screenshots
Login Screen <!-- Add actual screenshot paths -->
Dashboard
Client Management

Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

License
Distributed under the MIT License. See LICENSE for more information.

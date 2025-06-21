## ⚙️ Project Setup

### 🛠️ Install Dependencies

```bash
npm install
🗃️ MongoDB Setup with Compass
To connect the backend to MongoDB, follow these steps:

Open MongoDB Compass

Use the connection string format below:

mongodb://<username>:<password>@localhost:27017/client_db?authSource=admin
🔐 Replace <username> and <password> with values from your .env file inside the backend (Node.js) project.

▶️ Run the Backend Server
node server.js
Your Node.js server should now be running and connected to MongoDB.

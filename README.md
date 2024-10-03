
# Startup Progress Dashboard

## Code Crafters

## Project Idea

Creating a website for managing startups.
[Watch Demo Video](https://youtu.be/ON9zdNgzaTI)

### TECH STACK used:
- We have used **MERN Stack** for this project
- **Node.js** and **Express.js** were used for the backend
- **MongoDB** is used as the database
- **React** is used for the frontend
- We used **WebSockets** for real-time messaging

### Main Features:
- KYC of the startups (Address, Company details, Contact)
- Track the progress of the startups
- Collect reports on a monthly basis
- Push messages/info on the go to all the startups
- EiR and Grants scheme: collection of information, shortlisting, selection status, fund disbursal, etc.

### Unique Features in Our Website:
- We send emails to the users when their status is changed by the admin, so they get immediately notified of approvals or rejections.
- We visualized user data so the admin can monitor various statistics of the user.
- We implemented a messaging system inside the website so that every user can have a conversation with the admin. We also included a broadcast feature, so the admin can send messages to all users at once.

## Prerequisites:
- **Node.js** and **npm** (Ensure they are installed on your system)
- **MongoDB** (For storing and retrieving startup data)
- **React.js** (Frontend framework for rendering the dashboard)

## Instructions for Running The Code:

```bash
# 1. Clone the repository
git clone https://github.com/koushik8686/bit-n-build/

# 2. Navigate to the project directory
cd bit-n-build/startup-progress-dashboard

# 3. Open two integrated terminals

# In the **first terminal** (backend)
cd backend
npm i
node server.js

# In the **second terminal** (frontend)
cd frontend
npm i
npm start
```
   The frontend will run at **http://localhost:3000**.

   The backend will run at **http://localhost:4000**.

### MongoDB Atlas Configuration:
We are using MongoDB Atlas. Create a `.env` file and place your connection string inside:
```bash
URL="<Please Paste Your Connection Here>"
```
### Admin Credentials:
- **Username**: admin
- **Password**: 12345

## Team Members and their Contributions:

1. **Pinnu Koushik**:
   - Designed the chat between user and admin
   - Frontend part of admin

2. **Monish**:
   - Designed the user backend

3. **Jaswanth**:
   - UI/UX designer
   - Created the landing page
   - User frontend

4. **G Karthikeya**:
   - Backend for the admin
   - Mail sending system
# Ace 🔥- Kanban Board
<img src="https://i.imgur.com/Eim4CFK.png">

Ace Kanban Board is a powerful and intuitive task management tool designed to help individuals and teams organize their workflow efficiently. By leveraging the Kanban methodology, Ace enables users to visually track task progress, improve productivity, and streamline project management. Whether you're managing personal tasks or collaborating on a team project, Ace offers a smooth and responsive experience.

The application is deployed and accessible at [https://kanban-op.web.app/](https://kanban-op.web.app/).

## Technologies Used

- **Angular**: A modern framework for building scalable web applications.
- **Angular Material**: Provides UI components following Google’s Material Design principles.
- **Firebase**: Backend-as-a-Service for authentication, database, and hosting.
- **Tailwind CSS**: A utility-first CSS framework for building responsive designs quickly.

## Features

- **Task Management**: Create, update, and delete tasks across multiple boards.
- **Drag-and-Drop Interface**: Easily move tasks between columns to reflect their current status.
- **Real-time Updates**: Leverages Firebase to provide real-time synchronization across devices.
- **Responsive Design**: Tailwind CSS ensures a mobile-friendly and responsive user experience.


## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/renansouz/kanban-ng.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd kanban-ng
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Set up Firebase**:

   - Create a new project in [Firebase Console](https://console.firebase.google.com/).
   - Add a new web app to your Firebase project.
   - Copy the Firebase configuration settings.
   - In the project, create a `src/app/app.config.ts` file and add your Firebase configuration:

     ```typescript
     export const firebaseConfig = {
       apiKey: 'YOUR_API_KEY',
       authDomain: 'YOUR_AUTH_DOMAIN',
       projectId: 'YOUR_PROJECT_ID',
       storageBucket: 'YOUR_STORAGE_BUCKET',
       messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
       appId: 'YOUR_APP_ID',
     };
     ```

5. **Run the application**:

   ```bash
   ng serve
   ```

   Navigate to `http://localhost:4200/` in your browser to view the application.

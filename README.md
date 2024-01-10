# Knowledgebase App

## Description
The "Knowledgebase" app is a web-based Java Spring Boot/React/MySQL application designed to help you and your organization streamline internal content management. It serves as a central repository for all your internal resources - like self-help guides, employee directories, and company announcements. Its microservices architecture, employing separate backend and frontend components, ensures modularity and ease of maintenance.

## Features
- **Responsive Design**: Adapts to various devices and screen sizes.
- **Role-Based Access Control**: Three user roles with distinct permissions:
    - **Reader**: Access to User Site for reading and pinning articles.
    - **Editor**: Management of articles, topics, assets on Admin Dashboard and User Site access.
    - **Admin**: Full access, including user account management.
- **Microservices Architecture**: Independent backend (Java Spring Boot) and frontend (React) folders.
- **API-Based Architecture**: Secure Spring Boot APIs for database interaction.
- **Media Storage**: A dedicated `resources` folder for media files.

## Getting Started
Follow these steps to set up and run Knowledgebase on your local machine.

### Prerequisites
- Java JDK 20 or higher
- Node.js and npm
- MySQL Server

### Installation
1. **Environment Configuration**:
   - Set the following environment variables:
     - `JAVA_HOME` (path to JDK installation)
     - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (database credentials)
     - `JWT_SECRET` (JWT token secret)
     - `FRONTEND_URL` (URL for frontend app)

2. **Repository Setup**:
   ```
   git clone https://github.com/colinchia/knowledgebase.git
   ```
   Includes backend, frontend, resources folders, and initial database template (`knowledgebase.sql`).

3. **Backend Setup**:
   - Navigate to `backend`.
   - Update `application.properties` with database credentials.
   - Start the server:
     ```
     cd backend
     ./mvnw spring-boot:run
     ```

4. **Frontend Setup**:
   - Navigate to `frontend`.
   - Update `.env` file with URLs.
   - Install dependencies and start the app:
     ```
     npm install
     npm start
     ```

## Usage
Admin users manage content via the Admin Panel, while regular users browse and read articles on the User Site.

## Contributing
We welcome contributions! Please read our contributing guidelines for more information.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments
Special thanks to all contributors and testers.

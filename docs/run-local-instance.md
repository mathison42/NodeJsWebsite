---
layout: default
---

### Run Local Instance
1. Install [Node.js](https://nodejs.org/en/)
2. Install [MongoDB](https://www.mongodb.com/)
3. Create a [Google Cloud](https://console.cloud.google.com) project
    - Enable the required Google Cloud APIs:
        - Google+ (Profile, Email)
        - Google Drive (Read Only)
        - Google Sheets (Read Only)
        - YouTube (Read Only)
4. Clone the [workout-report repository]({{ site.github.repository_url }})
5. Create `./config/auth.js` and `./config/database.js` files.
    - Follow examples in the `/config` directory's `README.md`.
6. Start MongoDB from its `/bin` directory
    - `./mongod` **and** `./mongo`
7. Run in root directory to install all necessary modules
    - `npm install`
8. Run in the project's root directory:
    - `set DEBUG=NodeJsWebsite:* & npm start` **or** `./start_server.sh`
9. View your local instance of [Workout Report](localhost:3000) at localhost:3000

### Docker Instructions
- Create:
    - MonogoDB
    - Google Cloud APIs
    - `./config/auth.js` file
    - `./config/database.js` file
- Build: `docker build -t workout-report .`
- Run: `docker run -p 3000:3000 workout-report`

# Workout Report Project

Monitor your workout and lifting progress through the Workout Report website. Connect to a Google Spreadsheet through Google login. Gain a larger understanding of your most popular lifts on the dashboard. Dive into each lift and find associated videos for form and additional workout plans (soon). Get your teammates to join and compare your overall progress.

### To-Do
- [x] Dashboard
    - [x] Top 5 Workouts Numbers
    - [x] Top 4 Lift Charts
    - [x] Last X Number of Lifts
- [x] Single Lifts
    - [x] All Lift Numbers
    - [x] Lift Graph
    - [x] YouTube Links
        - [x] Query: Lift Form
        - [x] Query: Lift Specific Workout
        - [x] In Parallel: Promise
        - [ ] Randomize Video Queries
- [ ] Team Lifts
    - [x] Select Lift
    - [x] View all Teammates Graph
    - [ ] Chart of individual numbers
- [x] Profile
    - [x] Specify Number of Dashboard Records
    - [x] Specify Sport
    - [x] Specify Team Name
    - [x] Template
- [x] Finalize
    - [x] Prevent weight input errors
    - [x] Prevent date input errors
    - [x] Remove all data points that don't have a date or have future date
    - [x] Google hosting
- [x] Google Pages
    - [x] Homepage
    - [x] To-Do
    - [x] Run Locally
    - [x] Directions

### Run Locally
1. Install [Node.js](https://nodejs.org/en/)
2. Install [MongoDB](https://www.mongodb.com/)
3. Create a [Google Cloud](https://console.cloud.google.com) project
    - Enable the required Google Cloud APIs:
        - Google+ (Profile, Email)
        - Google Drive (Read Only)
        - Google Sheets (Read Only)
        - YouTube (Read Only)
4. Clone the [workout-report repository](https://github.com/mathison42/NodeJsWebsite)
5. Create `./config/auth.js` and `./config/database.js` files.
    - Follow examples in the `/config` directory's `README.md`.
6. Start MongoDB from its `/bin` directory
    - `./mongod` **and** `./mongo`
7. Run in root directory to install all necessary modules
    - `npm install`
8. Run in the project's root directory:
    - `set DEBUG=NodeJsWebsite:* & npm start` **or** `./start_server.sh`
9. View your local instance of [Workout Report](localhost:3000) at localhost:3000

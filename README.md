# Workout Report Website

Monitor your workout and lifting progress through the Workout Report website. Connect to a Google Spreadsheet through Google login. Gain a larger understanding of your most popular lifts on the dashboard. Dive into each lift and find associated videos for form and additional workout plans (soon). Get your teammates to join and compare your overall progress.

### To-Do
- [x] Dashboard
    - [x] Top 5 Workouts Numbers
    - [x] Top 4 Lift Charts
    - [ ] Last X Number of Lifts
- [ ] Single Lifts
    - [x] All Lift Numbers
    - [x] Lift Graph
    - [ ] Youtube Links
        - [ ] Query: Lift Form
        - [ ] Query: Lift Specific Workout
        - [ ] Query: Sport Related Workout
- [ ] Team Lifts
    - [ ] Select Lift
    - [ ] View all Teammates Graph
    - [ ] Chart of individual numbers
- [ ] Profile
    - [ ] Specify Sport
    - [ ] Specify Team Name
    - [ ] Directions

### Run Locally
	1) Install MongoDB -> https://www.mongodb.com/
	2) Create a Google Cloud project -> https://console.cloud.google.com
	    - Required Google Cloud APIs:
	        - Google+
	        - Google Sheets
	        - Youtube
	3) Create `./config/auth.js` and `./config/database.js` files.
	    - Examples in the `/config` folder's README.md.
	4) Run in root directory to install all necessary modules:
	    `npm install`
	5) Start MongoDB in it's bin dir: `./mongod` and `./mongo`
	6) Run in the project's root directory:
	    `set DEBUG=NodeJsWebsite:* & npm start`

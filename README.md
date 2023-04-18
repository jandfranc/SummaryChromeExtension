#Build the extension

To build the extension, follow these steps:

Clone the repository and navigate to the frontdoor-test directory.
Run npm install to install all dependencies.
Run npm run build to build the Chrome extension. This will generate a build directory.
Open Google Chrome and go to chrome://extensions/.
Turn on "Developer mode" in the top right corner.
Click "Load unpacked" and select the build directory.
The Chrome extension is now installed and ready to use!


#Nest.js App

To set up the Nest.js app, follow these steps:

Clone the repository and navigate to the backend directory.
Run npm install to install all dependencies.
Ensure to create a .env with the variable: OPENAI_API_SECRET_KEY
Run npm run start:dev to start the app in development mode.
Alternatively, run npm run start:prod to start the app in production mode.
The Nest.js app is now set up and running!


#How to use:

Open the chrome extension and click 'enable highlighting'
Highlight text on the page, then click on the text to generate the highlight.
Once the highlight is generated, you can hover over highlighted text and a tooltip will show up showing the summary.
Open the extension to see a list of summaries.
Type anything in the search to search for that term. You can also filter from oldest or newest.

#Testing:
To run tests, run npm test in either of the directories and it will run its specific tests

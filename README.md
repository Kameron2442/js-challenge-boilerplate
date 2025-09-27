# KinOcr
This app features a .csv data validator which can be used to process data from Kin's ingenious machine.

Steps for use:
1. Run the app (directions below)
2. Locate the hosted url http://localhost:4200/
3. The home page will show a button with text "Choose File"
4. Click it, and select your file which came from the ingenious machine.
5. Below the button will display sucessful file uploads and errors if they arise.

This app assumes to following:
1. The Ingenious machine's .csv output format remains constant. For example, no file headers.
2. The .csv files uploaded always come from the Ingenious machine

## Installation
Run in terminal: "npm i"

## Running
Run in terminal: "npm run start"

## Testing
Run in terminal: "npm run test"

## Callouts
1. AC acomplished for Story-1 and Story-2
2. Implmements a NgRx signal store to keep the page's state
3. Implmements a light and dark theme which uses the standard color palette (button in the top right of the nav bar)
4. Implemments Angular animations during file uploads

## Future improvements
1. Research more on the best accessibility solution when dealing with a file input. Currently using a label as a trigger, however there are other options.
2. Trigger the error in a unit test

## Components
1. NavBarComponent - This is site-wide navigation bar which includes a light/dark theme changer.
2. PolicyReaderComponent - Serves User-Story-1 & User-Story-2 to allow the user to upload/view csv files from the ingenious machine.

## Data store
1. HomePolicyUploadsStore - This serves as the data store for file uploads in PolicyReaderComponent.

# Solution descisions 
Data store using the NgRx signal store:
Pros - This allows new components / pages to easily access uploaded file data without having to pass data component to component.
Cons - NgRx has a required learning curve in order to use it properly and effectivly.

PolicyReaderComponent has a dedicated error banner in the page:
Pros - Allows dedicated error designs to be made directly in the component's template easily.
Cons - Prevents the app from having standardized error alerts. If more pages are added then a generic popup error modal would be better to implement as it could be shared across the app.

## Questions for the team
1. It's great to see the latest version of angular being used at your company! What does the time split look like for tech debt vs new features?
2. The job listing mentions building Web Components. Is that in relation to non-framework-specific Web Components? If yes, how are they used in the company?
3. What does an average day look like at the company? 
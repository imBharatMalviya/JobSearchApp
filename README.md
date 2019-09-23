# Job Search App

A simple job search application using reactjs 

**software requirement**

 - NodeJS
 - Visual Studio Code
 
 **project setup**
Run the project

    npm install
    npm start
Running unit tests

    npm test

Application endpoint : http://localhost:3000

**Project Description:**
Data in the location, skill, company and experience is stored using API.
Search functionality works as **AND** operation. 
**Experience** : data is cleaned and the max experience is taken as experience 
example - 3-5 yrs, 3-5 yr, 3 to 5, 5 as converted to 5
**Expired Jobs** : jobs which doesn't have the end date is considered as active jobs.


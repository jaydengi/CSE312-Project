# CSE312-Project
Final Project for CSE 312

Web Frameworks: Express / Node.js

Topic: eCommerce (auction house)


- A user must have a way to securely create an account and login to that account
- When logged into their account, a user can view and edit data that is specific to their profile
- Any information that is part of a user profile must be stored in a database that is created by your docker-compose file
- Other users must not be able to edit the profiles of other users
- You must build your own authentication system (OAuth "login with Google/etc." is not allowed). When storing passwords on your server, they must be stored securely
- Users must be provided a way to log out

- Each user account must store the items that user has posted for sale, and all past transactions for that user (both sales and purchases)
- Users must have a way to view their own data, but this data cannot be viewed by anyone except the buyer and seller

Questions:
- How do we build a authentication system?
- What should be the format of the database?

Requirements?
- An HTML file (“home.html”) - This file will have the html of the login and create. We also need to make this the root page.
- Create will create a get request to the path of the “createAccount.html” file. Here is where the username and password will be added to the database that will have all the user’s information. 
- Login will create a get request to the path of the “loginAccount.html” file. Here the username and password must match the information in the database. And if it does it will lead to a get request of the username. Here will be a html page that will be full of templates. Here we will see the items that user has posted for sale, and all past transactions for that user (both sales and purchases)


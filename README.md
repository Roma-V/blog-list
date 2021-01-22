# Blog list
[on heroku](https://blog-list-rv.herokuapp.com/)\

This app lists links to blog posts added by users. It contains a node-based server side as well as react-based frontend.

## Backend
[server](server/)\
The app provides REST API with the following functionality:
- add users to the database;
- get ingormation about users;
- login (required for the actions below);
- add blog post to a list;
- get the list of blog posts;
- update an entry in the list of blog posts;
- delete blog posts.

The "tests" subfolder contains unit tests that ensure proper functionality as well as fiew API tests.

## Frontend
[client](client/)\
The app provides few views for login, looking through the list of posts, editing them, see who's signed up. The following stack is used:
- React
- React Router
- Redux
- Material-ui

## Workflows
Github actions are used to test the code upon pushes and pull requests to the "master" branch.\
The following tags in commit coments trigger additional actions:
- /#deploy - build the frontend and deploy to heroku
- /#newversion - bumps the patch version and adds a corresponding tag to the repo
# Description and Requirements
In this front-end project, a React application will be developed that, in conjunction with the API, allows for the management of shortened URLs.

## Features and Rules

Just like in the API, we have the following features and rules:

- [ ]  It should be possible to create a link
    - [ ]  It should not be possible to create a link with a poorly formatted shortening
    - [ ]  It should not be possible to create a link with an already existing shortening
- [ ]  It should be possible to delete a link
- [ ]  It should be possible to obtain the original URL through the shortening
- [ ]  It should be possible to list all registered URLs
- [ ]  It should be possible to increment the number of accesses to a link
- [ ]  It should be possible to download a CSV with the report of the created links
- [ ]  The creation of a React application in SPA format using Vite as a `bundler` is mandatory;
- [ ]  Follow the Figma layout as closely as possible;
- [ ]  Work with elements that provide a good user experience (`empty state`, loading icons, blocking actions depending on the state of the application);
- [ ]  Focus on responsiveness: this application should work well on both desktops and mobile devices.

## Pages

This application has 3 pages:

- The root page (`/`) that displays the registration form and the list of registered links;
- The redirection page (`/:shortened-url`) that retrieves the dynamic value of the URL and searches the API for that shortened URL;
- The not found resource page (any page that does not follow the above pattern) that is displayed if the user types the wrong address or the provided shortened URL does not exist.
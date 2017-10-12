## Modus
https://modus-app.herokuapp.com/

Like the vibe of a song and looking for a playlist of similar tracks? Modus allows you to enter the artist's name and title of a song and will serve up 100 songs to match the mood. You can save any songs you like to your own list for later. 

Modus is a single page app with a one to many relationship using AngularJS for the front end and Ruby on Rails for the backend, which consumes the Last.fm API. Created in a one week sprint, this application follows MVC file organization and user authentication is handled through JSON Web Tokens.

![screencapture-modus-app-herokuapp-1507838153109](https://user-images.githubusercontent.com/17508245/31516535-c11525e6-af4d-11e7-85d9-0dd597e39a67.png)

<img width="1175" alt="screen shot 2017-10-12 at 1 01 06 pm" src="https://user-images.githubusercontent.com/17508245/31516547-c928f2b2-af4d-11e7-89b6-1c88f732be15.png">

**Team**
Alexandra Alday<br>
Aaron Sato

**Technologies Used:** 
* HTML
* CSS 
* JavaScript
* jQuery
* Node.js
* Express.js
* AngularJS
* Ruby
* Rails

**Server:** 
* https://modus-backend.herokuapp.com/

**Packages Used:** 
* JWT

**API Used:** 
* Last.fm API

**Design**
* Bootstrap
* Font Awesome
* Angular Animate


### User Stories: 
The user profile of this application is twofold:

First, general users of this application are people who wish to search for similar songs without saving them to their profile.

* Users land on the home page and can search for similar songs
* Users can click on more information on each search result

Another user of this application is the registered user who logs in to maintain their own profile and songs.

* Registered users can log in to manage their profile content
* Registered users can add a song to their saved songs
* Registered users can view their saved songs and edit or delete them
* Registered users can delete their account


### Features In Progress:
 - [ ]  Would like to add the ability to play a song directly from the application by incorporating the YoutubeAPI
 - [ ]  Only allow a user to like a song once
 - [ ]  Allow other users to see each others saved songs














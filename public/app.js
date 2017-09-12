const app = angular.module('modus', []);
  angular.module('app', ['ngSanitize']);

// whitelist api address to use result links
  app.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://ws.audioscrobbler.com/**'
    ]);
  }]);

app.controller('mainController', ['$http', function($http) {
  const controller = this;
  // server location
  this.url = 'http://localhost:3000';
  // users
  this.user = {};
  this.users = [];
  this.userPass = {};
  this.userSongs = [];
  this.showRegister = false;
  this.showLogin = false;
  this.loggedin = false;
  this.showProfile = false;
  this.showUpdate = false;
  // songs
  this.showSearch = true;
  this.showResults = false;
  this.searchResults = [];
  this.artist = '';
  this.song = '';
  this.songs = [];
  this.currentSong = {};
  this.formdata = {};
 

  /*****************
     USER CONTROLS
  ******************/

  // user log in and set token in localStorage
  this.login = function(userPass) {
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: { user: { username: userPass.username, password: userPass.password }}
    }).then(function(response) {
      console.log(response);
      this.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
      this.showLogin = false;
      this.showRegister = false;
      this.loggedin = true;
    }.bind(this));
  }

  //user log out
  this.logout = function() {
    localStorage.clear('token');
    this.loggedin = false;
    location.reload();
  }

  // show a list of all users if user logged in
  this.getUsers = function() {
    $http({
      url: this.url + '/users',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      console.log(response);
      if (response.data.status == 401){
        this.error = 'Unauthorized';
      } else {
        this.users = response.data;
      }
    }.bind(this));
  }

  // User Profile
  // this.showUser = function() {
  //   $http({
  //     url: this.url + '/users/' + id,
  //     method: 'GET',
  //   }).then(response => {
  //     console.log(response);
  //     this.users = response.data
  //   })
  // }

  // create new user
  this.registerUser = function(userReg){
    $http({
      method: 'POST',
      url: this.url + '/users/',
      data: { user: {
        username: userReg.username,
        password: userReg.password
      }},
    }).then(function(response) {
      console.log(response);
      controller.login(userReg);
    })
  }

  // update user IN PROGRESS
  this.updateUser = function(updatedUser){
    console.log(this.user.id)
    console.log(updatedUser)
    $http({
      method: 'PUT',
      url: this.url + '/users/' + this.user.id,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      },
      data: this.formdata
    }).then(function(response){
      console.log(response);
    }, function(err){
      console.log(err);
    })
  }

  // delete user IN PROGRESS
  this.deleteUser = function(id){
    $http({
      method: 'DELETE',
      url: this.url + '/users/' + id
    }).then(function(response){
      console.log(response);
      controller.logout();
    }, function(err){
      console.log(err);
    })
}

// display/hide user forms
  this.goRegister = function(){
    this.showRegister = true;
    this.showLogin = false;
  }
  this.goLogin = function(){
    this.showLogin = true;
    this.showRegister = false;
  }
  this.goProfile = function() {
    this.showSearch = false;
    this.showProfile = true;
  }
  this.goUpdate = function() {
    this.showUpdate = true;
  }
  this.registerForm = function(){
    if(this.showRegister) {
    }
    else {
      this.showRegister = !this.showRegister;
    }
  }
  this.loginForm = function(){
    if(this.showLogin){
    }
    else {
      this.showLogin = !this.showLogin;
    }
  }
  this.updateForm = function(){
    if(this.showUpdate) {
    }
    else {
      this.showUpdate = !this.showUpdate;
    }
  }
  

/*****************
 SEARCH CONTROLS
 *****************/


  this.searchMood = function(artist, song){
  this.artist = this.artist.split(' ').join('+');
  console.log(this.artist)
  this.song = this.song.split(' ').join('+');
  console.log(this.song)
  console.log("http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=" + this.artist + "&track=" + this.song +"&api_key=6103b97161ff0685106c6c3ee068dd6f&format=json")
    $http({
      method: 'GET',
      url: "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=" + this.artist + "&track=" + this.song +"&api_key=6103b97161ff0685106c6c3ee068dd6f&format=json"
    }).then(function(response){
      console.log(response.data.similartracks.track)
      controller.showResults = true;
      controller.searchResults = response.data.similartracks.track;
      controller.artist = '';
      controller.song = '';
    }, function(error){
      console.log(error);
    })
};


  /*****************
     SONG CONTROLS
  ******************/

  this.addSong = function(songToAdd){
    console.log(this.user)
    this.currentSong = songToAdd;
    $http({
      method: 'POST',
      url: this.url + '/users/' + this.user.id + '/songs',
      data: {song: {
        artist: songToAdd.artist.name,
        title: songToAdd.name,
        image: songToAdd.image[0]['#text'],
        user_id: controller.user.id
      }}
    }).then(response=>{
      console.log(response);
      // this.userSongs.unshift(response.data);
    }).catch(err=> console.log(err))
  }
  
  

// planned feature to delete song from user's saved songs list
  this.deleteSong = function(id){
    $http({
      method: 'DELETE',
      url: this.url + '/songs/' + id
    }).then(function(response){
      console.log(response);
      controller.logout();
    }, function(err){
      console.log(err);
    })
}





}]);

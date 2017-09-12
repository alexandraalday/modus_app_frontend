const app = angular.module('modus', []);
  angular.module('app', ['ngSanitize']);

// whitelist api address to use result links
  app.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://ws.audioscrobbler.com/**'
    ]);
  }]);

app.controller('mainController', ['$http', function($http) {
  const controller = this;
  // server location
  this.url = 'https://modus-backend.herokuapp.com';
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
  this.showEdit = false;
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
    console.log(userReg.username)
    console.log(userReg.password)
    $http({
      method: 'POST',
      url: this.url + '/users',
      data: { user: {
        username: userReg.username,
        password: userReg.password
      }},
    }).then(function(response) {
      console.log(response);
      controller.login(userReg);
    })
  }



// {"user"=>{"username"=>"Poopie", "password"=>"Poopie"}, "controller"=>"users", "action"=>"create"}


  // update user IN PROGRESS
  // this.updateUser = function(updatedUser){
  //   console.log(this.user.id)
  //   console.log(updatedUser)
  //   $http({
  //     method: 'PUT',
  //     url: this.url + '/users/' + this.user.id,
  //     headers: {
  //       Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
  //     },
  //     data: this.formdata
  //   }).then(function(response){
  //     console.log(response);
  //   }, function(err){
  //     console.log(err);
  //   })
  // }

  // delete user IN PROGRESS
  // this.deleteUser = function(id){
  //   $http({
  //     method: 'DELETE',
  //     url: this.url + '/users/' + id
  //   }).then(function(response){
  //     console.log(response);
  //     controller.logout();
  //   }, function(err){
  //     console.log(err);
  //   })
  // }

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
    this.showResults = false;
    this.showProfile = true;
    this.getSongs(this.user);
  }
  this.goSearch = function() {
    this.showSearch = true;
    this.showResults = false;
    this.showProfile = false;
    this.userSongs = [];
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
  console.log("https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=" + this.artist + "&track=" + this.song +"&api_key=6103b97161ff0685106c6c3ee068dd6f&format=json")
    $http({
      method: 'GET',
      url: "https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=" + this.artist + "&track=" + this.song +"&api_key=6103b97161ff0685106c6c3ee068dd6f&format=json"
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

  // user can add a song to their saved songs list
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
  
 // show a list of all songs if user logged in
  this.getSongs = function(user) {
    $http({
      url: this.url + '/users/' + this.user.id,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      console.log(response.data.songs);
      controller.userSongs = response.data.songs
    }.bind(this));
  }

  // edit saved song
  this.goEdit = function(song) {
    this.showEdit = true;
    this.song = song;
    console.log(song)
  }

  this.editSong = function(updatedSong){
    $http({
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      },
      url: this.url + '/songs/' + this.song.id,
      data: { song: { artist: updatedSong.artist, title: updatedSong.title }}
    }).then(function(response){
      console.log(response);
      controller.song = '';
      controller.goProfile();
      controller.showEdit = false;
    }, function(err){
      console.log(err);
      
    })
}

  // delete saved song
  this.deleteSong = function(song){
    console.log(song.id)
    $http({
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      },
      url: this.url + '/songs/' + song.id
    }).then(function(response){
      console.log(response);
      controller.song = '';
      controller.goProfile();
    }, function(err){
      console.log(err);
    })
}





}]);

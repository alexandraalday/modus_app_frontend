const app = angular.module('modus', []);
  angular.module('app', ['ngSanitize']);

// whitelist last.fm
  app.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://ws.audioscrobbler.com/**'
    ]);
  }]);

app.controller('mainController', ['$http', function($http) {
  const controller = this;
  // let key = process.env.API_KEY;
  // server location
  this.url = 'http://localhost:3000';
  // users
  this.user = {};
  this.users = [];
  this.userPass = {};
  this.showRegister = false;
  this.showLogin = false;
  this.loggedin = false;
  this.showProfile = false;
  this.showUpdate = false;
  // songs
  this.showSearch = true;
  this.showResults = false;
  this.songs = [];
  this.formdata = {};
  this.searchResults = [];



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
  this.showUser = function() {
    $http({
      url: this.url + '/users/' + id,
      method: 'GET',
    }).then(response => {
      console.log(response);
      this.users = response.data
    })
  }

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

  // update user
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

  // delete user
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


  this.searchMood = function(key){
    $http({
      method: 'GET',
      url: "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=cher&track=believe&api_key=6103b97161ff0685106c6c3ee068dd6f&format=json"
    }).then(function(response){
      console.log(response.data.similartracks.track)
      controller.showResults = true;
      controller.searchResults = response.data.similartracks.track;
    }, function(error){
      console.log(error);
    })
};


  /*****************
     SONG CONTROLS
  ******************/



// planned feature to delete song from user's saved songs list
//   this.deleteSong = function(id){
//     $http({
//       method: 'DELETE',
//       url: this.url + '/songs/' + id
//     }).then(function(response){
//       console.log(response);
//       controller.logout();
//     }, function(err){
//       console.log(err);
//     })
// }


  this.processForm = function() {
    console.log('processForm function ...');
    console.log('Formdata: ', this.formdata);
    $http({
      method: 'POST',
      url: this.url + '/songs',
      data: this.formdata
    }).then(function(result) {
      console.log('Data from server: ', result);
    })
      .catch(err => console.log(err));
  }

  function filterSongs() {
    let input = document.getElementById('filter');
    let filter = input.value.toUpperCase();
    let ul = document.getElementById("myUL");
    let li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        let p = li[i].getElementsByTagName("p")[0];
        if (p.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}


}]);

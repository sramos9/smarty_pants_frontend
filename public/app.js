// console.log('connected to app.js');
const app = angular.module('smartypants', []);

app.controller('spController', ['$http', '$scope', function($http, $scope) {
  $scope.modalShown = false;
  $scope.modalShown2 = false;
  $scope.modalShown3 = false;
  $scope.modalShown4 = false;
  $scope.modalShown5 = false;

  const controller = this;
  this.message = "controller works";
  this.url = 'https://smartypantsbackend.herokuapp.com';
  // this.url = 'http://localhost:3000';
  this.post = {};
  this.formData = {};
  // this.testArray = [1, 2, 3];
  this.commentData = [];
  this.user = {};
  this.users = [];
  this.userPass = {};
  this.loggedIn = false;
  this.displayReg = false;
  this.displayLog = false;
  this.commentToDelete;
  this.commentToEdit;

  $scope.toggleAboutModal = function() {
    $scope.modalShown5 = !$scope.modalShown5;
  };

  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.togglePostModal = function() {
    $scope.modalShown2 = !$scope.modalShown2;
  };

  $scope.toggleDeleteModal = function(commentsId) {
    $scope.modalShown3 = !$scope.modalShown3;
    this.commentToDelete = commentsId;
    controller.currentComment(this.commentToDelete);
    console.log(this.commentToDelete);
  };

  $scope.toggleEditModal = function(commentsId) {
    $scope.modalShown4 = !$scope.modalShown4;
    this.commentToEdit = commentsId;
    controller.currentComment(this.commentToEdit);
    console.log(this.commentToEdit);
  };

  this.toggleAbout = function(){
     this.about = !this.about;
  };
  // ----------------------------------
  //   login user  --> /user/login
  // ----------------------------------
this.login = function(userPass) {
  $http({
    method: 'POST',
    url: this.url + '/users/login',
    data: { user: { username: userPass.username, password: userPass.password }},
  }).then(function(response) {
    console.log(response);
    this.user = response.data.user;
    localStorage.setItem('token', JSON.stringify(response.data.token));
    if(this.user === undefined){
      this.loggedIn = false;
    } else {
      this.loggedIn = true;
    }
    console.log('user logged in? ', this.loggedIn);
    console.log('user is: ', this.user);
    // this.getUsers();
    this.userId = response.data.user.id;
    console.log(this.userId);

  }.bind(this));
};


//-------------------------------
//    /users/logout

this.logout = function(){
  localStorage.clear('token');
  console.log('logout');
  console.log(localStorage);
  location.reload();
};
// ----------------------------
 // new user:   /users
// ---------------------------------

this.createUser = function(userPass){
    $http({
      url: this.url + '/users',
      method: 'post',
      data: {user: {username: userPass.username, password: userPass.password}}
    }).then(function(response){
      console.log(response);
      this.user = response.data.user;
      this.loggedIn = true;
      // controller.getUsers();
    }.bind(this))
  };
// ----------------------------------
//      News API  to GET news sortby Latest
// ----------------------------------

this.getNews = function() {
  $http({
    method: 'GET',
    url: ' https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=5ab72b6b78cf4774a491ce5a6cc808ab'
  }).then(function(response) {
    controller.news = response.data;
    console.log(response);

  })
};
this.getNews();
// ----------------------------------
//     end of news api
// ----------------------------------
//             POSTS SECTION

this.grabTitle = function(param1){
  this.title = param1.title
}

// -------------------------------
//    ^^  grab news api title and store to variable
// ----------------------------------

this.newPost = function() {
  this.formData.title = this.title;
  console.log(this.formData, 'this is formData');
  $http({
    method: 'POST',
    url: this.url + '/posts',
    data: this.formData
      //how to use schema properties in ajax
  }).then(function(response) {
    console.log(response);

    // this.post = response.data;
    // console.log('this is this.post: ', this.post);
    console.log(this);
    this.getPosts();
  }.bind(this),function(error) {
    console.log(error);
  })
  controller.clearForm();
};

this.clearForm = function(){
  this.formData = '';
}

// -----------------------------------------------------------------------------
//      create new post & clear form
// -----------------------------------------------------------------------------

//Get posts
this.getPosts = function() {
  $http({
    method: 'GET',
    url: this.url + '/posts'
  }).then(function(response) {
    console.log(response);
    // console.log(this);
    this.newFormPost = response.data;
    // this.post_id = response.data.id;
    console.log(response.data);
    // console.log('typeof response.data', typeof response.data );
  }.bind(this),function(error) {
      console.log(error);
    }
  )
};

this.getPosts();

//-----------------------------------------------------------------------------
//        show all posts on window onload
// -----------------------------------------------------------------------------

// this grabs the current post id on ng-click
this.currentPost = function(id) {
  $http({
    method: 'GET',
    url: this.url + '/posts/' + id
  }).then(function(response) {
    controller.currentPostId = response.data.id
    console.log(controller.currentPostId);

  })
};
// this.currentPost();

//-------------------------------------------
//                COMMENTS SECTION
//-------------------------------------------

// user_post_comments GET
//   ***    /users/:user_id/posts/:post_id/comments

// GET ROUTE TO SHOW COMMENTS ON POSTS
this.getComments = function() {
  $http({
    method: 'GET',
    url: this.url + '/users/' + this.userId + '/posts/' + this.currentPostId +'/comments/'

  }).then(function(response) {
    this.postComment = response.data;
    console.log(this.postComment);
    console.log(response.data.articles);
    console.log(this.userId);
    console.log(response);
    // console.log(this);
    // console.log(controller.post_id);
  }.bind(this),function(error) {
      console.log(error);
    }
  )
};
this.getComments();
// -----------------------------------------------------------------------------
//      CREATE COMMENT POST ROUTE
// user_post_comments POST
//   ***    /users/:user_id/posts/:post_id/comments

  this.createComment = function(){
    if(this.loggedIn === false){
    console.log('cannot create comment, not logged in');
    } else {
      this.loggedIn = true;

    $http({
      method: 'POST',
      url: this.url + '/users/' + this.userId + '/posts/' + this.currentPostId +'/comments/',
      data: { comment: {username: this.commentData.username, addComment: this.commentData.addComment, post_id: this.currentPostId,
      user_id: this.userId}}
    }).then(function(response) {

      console.log(response);
      this.getPosts();
      // console.log(this);
      // console.log(this.post_id);
    }.bind(this),function(error) {
        console.log(error);
      })
  };

}


//-------------------------------------------
//               GRAB COMMENT ID
//-------------------------------------------
this.currentComment = function(commentsId) {
  this.commentToDelete = commentsId;
  this.deleteComment();
  this.commentToEdit = commentsId;
  this.editComment();
  console.log(commentsId, 'commentsId in current comment function line 258');
};

//------------------------------------------
//                COMMENTS UPDATE
//  /users/:user_id/posts/:post_id/comments/:id
//-------------------------------------------

this.editComment = function(commentsId){
  console.log(commentsId, '******* comment to edit');
  if(this.loggedIn === false){
    console.log('cannot edit comment, not logged in');
  } else {
    this.loggedIn = true;

    $http({
      method: 'PUT',
      url: this.url + '/users/' + this.userId + '/posts/' + this.currentPostId +'/comments/' + commentsId,
      data: { comment: {username: this.updatedCommentData.username, addComment: this.updatedCommentData.addComment, post_id: this.currentPostId,
      user_id: this.userId}}
    }).then(function(response) {
      console.log(response);
      this.newEditComment = response.data;
      console.log(this.newEditComment);
      $scope.modalShown4 = false;
      this.getPosts();
    }.bind(this),function(error) {
      console.log(error);
    })
  }
};




//-------------------------------------------
//                COMMENTS DELETE
//  /users/:user_id/posts/:post_id/comments/:id
//-------------------------------------------

this.deleteComment = function(commentsId){
  console.log(commentsId, '******* comment to delete');
  if(this.loggedIn === false){
    console.log('cannot delete comment, not logged in');
  } else {
    this.loggedIn = true;

    $http({
      method: 'DELETE',
      url: this.url + '/users/' + this.userId + '/posts/' + this.currentPostId +'/comments/' + commentsId
    }).then(function(response) {
      console.log(response);
      $scope.modalShown3 = false;
      this.getPosts();
    }.bind(this),function(error) {
      console.log(error);
    })
  }
};

//end of spController
}]);

app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
      template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});

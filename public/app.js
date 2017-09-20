// console.log('connected to app.js');
const app = angular.module('smartypants', []);

app.controller('spController', ['$http', '$scope', function($http, $scope) {
  $scope.modalShown = false;
  const controller = this;
  this.message = "controller works";
  this.url = 'http://localhost:3000'
  this.post = {};
  this.formData = {};
  // this.testArray = [1, 2, 3];
  this.commentData = [];

  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.togglePostModal = function() {
    $scope.modalShown2 = !$scope.modalShown2;

  }
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

this.grabTitle = function( param1){
  this.title = param1.title
      // this.modal = function() {
      //   $('#myModal').on('shown.bs.modal', function () {
      //   $('#myInput').focus()
      // })
    // }
}
// -------------------------------
//      grab news api title and store to variable
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
//add a comment to a post
// /posts/post_id/comments


// GET ROUTE TO SHOW COMMENTS ON POSTS
this.getComments = function() {
  $http({
    method: 'GET',
    url: this.url + '/posts/' + this.currentPostId +'/comments/'

  }).then(function(response) {
    this.postComment = response.data;
    console.log(this.postComment);
    console.log(response.data.articles);
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


this.createComment = function(){
  $http({
    method: 'POST',
    url: this.url + '/posts/' + this.currentPostId +'/comments',
// this doesn't work (can't get the id)
    data: { comment: {username: this.commentData.username, addComment: this.commentData.addComment, post_id: this.currentPostId}}

  }).then(function(response) {
    // controller.comment = response.data;
    //
    //
    // console.log(controller.comment);
    // console.log('this should be response.data: ', resonse.data);
    console.log(response);
    // console.log(this);
    // console.log(this.post_id);
  }.bind(this),function(error) {
      console.log(error);
      this.getPosts();
    }
  )
};
// this.getComments();



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

console.log('connected to app.js');
const app = angular.module('smartypants', []);

app.controller('spController', ['$http', '$scope', function($http, $scope) {
  const controller = this;
  this.message = "controller works";
  this.url = 'http://localhost:3000'
  this.post = {};
  this.formData = {};
  this.testArray = [1, 2, 3];


// -----------------------------------------------------------------------------
//      News API  to GET news sortby Latest
// -----------------------------------------------------------------------------

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
// -----------------------------------------------------------------------------
//                end of news api
// -----------------------------------------------------------------------------
//             POSTS SECTION

this.grabTitle = function( param1){
  this.title = param1.title
      // this.modal = function() {
      //   $('#myModal').on('shown.bs.modal', function () {
      //   $('#myInput').focus()
      // })
    // }
}

// -----------------------------------------------------------------------------
//      grab news api title and store to variable
// -----------------------------------------------------------------------------


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
    controller.post = response.data;
    console.log('this is response.data: ', response.data);

    console.log(this);
    this.getPosts();
  }.bind(this),function(error) {
    console.log(error);
  }
  )
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
    console.log(this);
    this.newFormPost = response.data;
    controller.post_id = response.data.id;
    console.log(response.data, 'this is response.data');
    console.log(this.post_id);
  }.bind(this),function(error) {
      console.log(error);
    }
  )
};

this.getPosts();
//add a comment to a post
// /posts/post_id/comments

// -----------------------------------------------------------------------------
//        show all posts on window onload
// -----------------------------------------------------------------------------
//                COMMENTS SECTION

// GET ROUTE TO SHOW COMMENTS ON POSTS
this.getComments = function() {
  console.log(this.post_id);
  $http({
    method: 'GET',
    url: this.url + '/posts/' + this.post_id +'/comments/'
  }).then(function(response) {
    console.log(response);
    console.log(this);
    console.log(controller.post_id);
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
    url: this.url + '/posts' + controller.post_id +'/comments'
  }).then(function(response) {
    console.log(response);
    console.log(this);
    console.log(controller.post_id);
  }.bind(this),function(error) {
      console.log(error);
    }
  )
};


//end of spController
}]);

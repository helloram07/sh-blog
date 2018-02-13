angular
    .module('createPost')
    .component('createPost', {
        templateUrl: 'create-post/create-post.template.html',
        controller: function CreatePostController($scope, $http) {

            $(document).ready(function () {
                $('#blog_category').material_select();
            });

            this.createPost = function (blogPost) {
                var blogPostFormData = new FormData();

                blogPostFormData.append('title', blogPost.title);
                blogPostFormData.append('category', blogPost.category);
                blogPostFormData.append('shortDescription', blogPost.shortDescription);
                blogPostFormData.append('description', blogPost.description);
                blogPostFormData.append('coverImage', blogPost.coverImage);

                $http.post('/api/blogPost', blogPostFormData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).then(function (data) {
                    console.log(data);
                    this.blogPost = {};
                    $scope.$apply();
                });
            };
        }
    });

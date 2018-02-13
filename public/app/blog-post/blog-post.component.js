'use strict';

angular
	.module('blogPost')
	.component('blogPost', {
		templateUrl: 'blog-post/blog-post.template.html',
		controller: ['$routeParams', '$scope', '$http',
            function BlogPostController($routeParams, $scope, $http) {
				$(document).ready(function () {
					// the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
					$('.modal').modal();
					$('#blog_category').material_select();
				});
				this.blogId = $routeParams.blogId;
				this.post = {};

				this.getPostById = function (postId) {
					var self = this;

					$http.get('/api/blogPost/' + postId)
						.then(function (response) {
							if (response && response.data) {
								self.post = response.data;
							}
						});
				};

				this.updatePost = function (post) {
					var self = this;
					$http.put('/api/blogPost/' + post._id, post)
						.then(function (response) {
							if (response && response.status) {
								self.getPostById(post._id)
							}
						});
				};

				this.formatDate = function (date, dateFormat) {
					var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
					var monthFullNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Noveber", "December"];
					if (date) {
						if (dateFormat == "ddMMMMyyyy") {
							var formattedDate = new Date(Number(date));
							return formattedDate.getDate() + ' ' + monthFullNames[formattedDate.getMonth()] + ' ' + formattedDate.getFullYear();
						}
					}
				};

				this.getImageSource = function (name) {
					if (name) {
						return './uploads/' + name;
					}
				};

				this.getPostById(this.blogId);
            }
        ]
	});
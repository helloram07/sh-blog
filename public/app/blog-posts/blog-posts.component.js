'use strict';

angular
	.module('blogPosts')
	.component('blogPosts', {
		templateUrl: 'blog-posts/blog-posts.template.html',
		controller: ['$routeParams', '$scope', '$http',
            function BlogPostsController($routeParams, $scope, $http) {

				this.category = $routeParams.category;
				this.posts = [];
				this.dummyItems = _.range(1, 151); // dummy array of items to be paged
				this.pager = {};

				initController();

				function initController() {
					// initialize to page 1
					this.setPage(1);
				}

				this.setPage = function (page) {
					if (page < 1 || page > this.pager.totalPages) {
						return;
					}

					// get pager object from service
					this.pager = PagerService.GetPager(this.dummyItems.length, page);

					// get current page of items
					this.items = this.dummyItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
				};

				this.getPosts = function (category) {
					var self = this;
					$http.get('/api/blogPost', {
						params: {
							start: 1,
							end: 5,
							category: category
						},
						headers: {
							'Accept': 'application/json'
						}
					}).then(function (response) {
						if (response && response.data) {
							self.posts = response.data.docs;
							self.totalPost = response.data.total;
						}
					});
				};

				this.deletePost = function (postId) {
					var self = this;
					$http.delete('/api/blogPost/' + postId)
						.then(function (response) {
							if (response && response.status) {
								self.getPosts(self.category);
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

				this.getPosts(this.category);
            }
        ]
	});
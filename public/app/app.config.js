'use strict';

angular
    .module('blogApp')
    .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider
                .when('/home', {
                    template: '<blog-home></blog-home>'
                })
                .when('/category/:category', {
                    template: '<blog-posts></blog-posts>'
                })
                .when('/post/:blogId', {
                    template: '<blog-post></blog-post>'
                })
                .when('/createPost', {
                    template: '<create-post></create-post>'
                })
                .otherwise('/home');
        }
    ]);

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const mongoosePagination = require('mongoose-pagination');
const passport = require('passport');
const cors = require('cors');
const config = require('./config/database');

const app = express();

// Port
app.listen(3000, function () {
	console.log("Node started at http://localhost:3000/");
});

//CORS Middleware
app.use(cors());

// BodyParser Middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname)
	}
});

var upload = multer({
	storage: storage
});

app.use(express.static(__dirname + '/public/app'));
app.use('/uploads', express.static(__dirname + '/uploads/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/materialize-css', express.static(__dirname + '/node_modules/materialize-css/dist/'));
app.use('/material-design-icons', express.static(__dirname + '/node_modules/material-design-icons/'));
app.use('/angular', express.static(__dirname + '/node_modules/angular/'));
app.use('/angular-route', express.static(__dirname + '/node_modules/angular-route/'));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(config.database, {
	useMongoClient: true
});
mongoose.Promise = global.Promise;

var BlogPostSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	shortDescription: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	coverImage: {
		type: String,
		required: true
	},
	category: {
		type: String,
		enum: ['Entertainment', 'Sports', 'Travel', 'Style', 'Health', 'Food', 'Tech', 'Business', 'Analytics', 'Politics'],
		required: true
	},
	author: {
		type: String,
		required: true
	},
	createdDate: {
		type: String,
		default: Date.now()
	},
	modifiedDate: {
		type: String,
		default: Date.now()
	}
}, {
	collection: 'BlogPost'
});

var BlogPostModel = mongoose.model('BlogPostModel', BlogPostSchema);

app.post("/api/blogPost", upload.single('coverImage'), createPost);
app.get("/api/blogPost", getAllPosts);
app.get("/api/blogPost/:id", getPostById);
app.get("/api/blogPost/:category", getPostsByCategory);
app.put("/api/blogPost/:id", updatePost);
app.delete("/api/blogPost/:id", deletePost);


function createPost(request, response) {
	console.log(request);
	var blogPost = {
		title: request.body.title,
		category: request.body.category,
		shortDescription: request.body.shortDescription,
		description: request.body.description,
		coverImage: request.file.filename,
		author: "Admin"
	};
	BlogPostModel
		.create(blogPost)
		.then(
			function (success) {
				response.json(success);
			},
			function (error) {
				console.log("Error: " + error);
				response.sendStatus(400);
			}
		);
}

function getAllPosts(request, response) {
	BlogPostModel
		.find()
		.paginate(1, 10, function (err, docs, total) {
			if (err) {
				console.log("Error: " + err);
				response.sendStatus(400);
			} else {
				var result = {
					total: total,
					docs: docs
				};
				response.json(result);
			}
		});
}

function getPostById(request, response) {
	var postId = request.params.id;
	BlogPostModel
		.findById(postId)
		.then(
			function (success) {
				response.json(success);
			},
			function (error) {
				response.sendStatus(400);
			}
		);
}

function getPostsByCategory(request, response) {
	var category = request.params.category;
	BlogPostModel
		.find({
			category: category
		})
		.then(
			function (success) {
				response.json(success);
			},
			function (error) {
				response.sendStatus(400);
			}
		);
}

function updatePost(request, response) {
	var postId = request.params.id
	var blogPost = {
		title: request.body.title,
		category: request.body.category,
		shortDescription: request.body.shortDescription,
		description: request.body.description,
		author: "Admin",
		modifiedDate: Date.now()
	};

	BlogPostModel
		.update({
			_id: postId
		}, {
			title: request.body.title
		})
		.then(
			function (success) {
				response.sendStatus(200);
			},
			function (error) {
				response.sendStatus(400);
			}
		)
}

function deletePost(request, response) {
	var postId = request.params.id;
	BlogPostModel
		.remove({
			_id: postId
		})
		.then(
			function (success) {
				response.sendStatus(200);
			},
			function () {
				response.sendStatus(400);
			}
		);
}
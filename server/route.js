const { Router } = require("express");
const AttentionController = require("./controllers/attention");
const AuthController = require("./controllers/auth");
const NotificationController = require("./controllers/notification");
const ProfileController = require("./controllers/profile");
const TopicController = require("./controllers/topic");

const AuthValidator = require("./validators/auth");

const AuthorizationMiddleware = require("./middlewares/authorization");
const QuestionController = require("./controllers/question");
const QuestionValidator = require("./validators/question");
const BlogController = require("./controllers/blog");
const BlogValidator = require("./validators/blog");

class MainRoute {
    router;
    attentionController;
    authController;
    notificationController;
    profileController;
    topicController;
    questionController;
    blogController;

    authValidator;
    questionValidator;
    blogValidator;

    authorizationMiddleware;

    constructor() {
        this.attentionController = new AttentionController();
        this.authController = new AuthController();
        this.notificationController = new NotificationController();
        this.profileController = new ProfileController();
        this.topicController = new TopicController();
        this.questionController = new QuestionController();
        this.blogController = new BlogController();

        this.authValidator = new AuthValidator();
        this.questionValidator = new QuestionValidator();
        this.blogValidator = new BlogValidator()

        this.authorizationMiddleware = new AuthorizationMiddleware();

        this.router = Router();
        this.setRoutes();
    }

    setRoutes() {
        // attentions
        this.router.get(
            "/attentions",
            this.authorizationMiddleware.verifyUser,
            this.attentionController.getAttentionList
        );
        this.router.put(
            "/attentions/add",
            this.authorizationMiddleware.verifyUser,
            this.attentionController.addTopicToAttentionList
        );
        this.router.put(
            "/attentions/remove",
            this.authorizationMiddleware.verifyUser,
            this.attentionController.removeTopicFromAttentionList
        );
        this.router.get(
            "/attentions/suggestions",
            this.authorizationMiddleware.verifyUser,
            this.attentionController.getUnsubscribedTopics
        );

        // auth
        this.router.post("/auth/signin", this.authValidator.validateSignInData, this.authController.signin);

        // notifications
        this.router.get(
            "/notifications",
            this.authorizationMiddleware.verifyUser,
            this.notificationController.getNotifications
        );
        this.router.put(
            "/notifications/turnOn",
            this.authorizationMiddleware.verifyGeneralUser,
            this.notificationController.turnOnNotification
        );
        this.router.put(
            "/notifications/turnOff",
            this.authorizationMiddleware.verifyGeneralUser,
            this.notificationController.turnOffNotification
        );

        // profile
        this.router.get("/profile", this.authorizationMiddleware.verifyUser, this.profileController.getProfile);

        // topics
        this.router.get("/topics", this.topicController.getAllTopics);

        // questions
        this.router.post("/questions/create", this.authorizationMiddleware.verifyGeneralUser, this.questionValidator.validateQuestionData, this.questionController.createQuestion);
        this.router.get("/questions/:titleSlug", this.questionController.getQuestion)

        // blogs
        this.router.post("/blogs/create", this.authorizationMiddleware.verifyDoctor, this.blogValidator.validateBlogData, this.blogController.createBlog);
        this.router.get("/blogs/:titleSlug", this.blogController.getQuestion)
    }
}

module.exports = MainRoute;

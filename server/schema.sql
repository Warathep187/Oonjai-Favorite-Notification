CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(55) NOT NULL,
    email VARCHAR(55) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM("ADMINISTRATOR", "DOCTOR", "PATIENT") NOT NULL,
    unread_notification INT DEFAULT 0,
    turn_on_notification BOOLEAN DEFAULT 0,
    
    INDEX(email)
);

CREATE TABLE IF NOT EXISTS profile_images (
    user_id VARCHAR(36),
    url VARCHAR(255),

    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(36) PRIMARY KEY,
    topic VARCHAR(55) UNIQUE NOT NULL,

    INDEX(topic)
);

CREATE TABLE IF NOT EXISTS interested_in (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    topic_id VARCHAR(36) NOT NULL,

    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(topic_id) REFERENCES topics(id)
);

CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    title_slug VARCHAR(365) NOT NULL UNIQUE,
    content VARCHAR(255) NOT NULL,
    topic_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT NOW(),

    INDEX(title_slug),

    FOREIGN KEY(topic_id) REFERENCES topics(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_slug VARCHAR(365) NOT NULL UNIQUE,
    content VARCHAR(255) NOT NULL,
    topic_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT NOW(),

    INDEX(title_slug),

    FOREIGN KEY(topic_id) REFERENCES topics(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    to_user_id VARCHAR(36) NOT NULL,
    type ENUM("QUESTION", "BLOG") NOT NULL,
    blog_id VARCHAR(36),
    question_id VARCHAR(36),
    created_at DATETIME,

    FOREIGN KEY(to_user_id) REFERENCES users(id),
    FOREIGN KEY(blog_id) REFERENCES blogs(id),
    FOREIGN KEY(question_id) REFERENCES questions(id)
);

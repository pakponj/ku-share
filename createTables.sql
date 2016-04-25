DROP TABLE IF EXISTS `user`;
CREATE TABLE user(
    userID INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    admin BIT NOT NULL DEFAULT 0,
    PRIMARY KEY (`userID`)
);

DROP TABLE IF EXISTS `category`;
CREATE TABLE category(
    categoryID INT NOT NULL AUTO_INCREMENT,
    categoryName VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
    PRIMARY KEY (`categoryID`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `subject`;
CREATE TABLE subject(
    subjectID INT NOT NULL AUTO_INCREMENT,
    subjectName VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
    categoryID INT NOT NULL,
    PRIMARY KEY (`subjectID`),
    FOREIGN KEY (`categoryID`) REFERENCES category(`categoryID`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `file`;
CREATE TABLE file(
    fileID INT NOT NULL AUTO_INCREMENT,
    fileName VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
    filePath VARCHAR(255) NOT NULL,
    subjectID INT NOT NULL,
    ownerID INT NOT NULL,
    PRIMARY KEY (`fileID`),
    FOREIGN KEY (`subjectID`) REFERENCES subject(`subjectID`),
    FOREIGN KEY (`ownerID`) REFERENCES user(`userID`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `comment`;
CREATE TABLE comment(
    commentID INT NOT NULL AUTO_INCREMENT,
    detail LONGTEXT COLLATE utf8_unicode_ci NOT NULL,
    userID INT NOT NULL,
    fileID INT NOT NULL,
    PRIMARY KEY (`commentID`),
    FOREIGN KEY (`userID`) REFERENCES user(userID),
    FOREIGN KEY (`fileID`) REFERENCES file(fileID)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

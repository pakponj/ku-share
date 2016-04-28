DROP TABLE IF EXISTS `user`;
CREATE TABLE user(
    userID INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    joinDate DATETIME NOT NULL DEFAULT NOW(),
    admin INT(2) NOT NULL DEFAULT 0,
    PRIMARY KEY (`userID`)
);

DROP TABLE IF EXISTS `category`;
CREATE TABLE category(
    categoryID INT NOT NULL AUTO_INCREMENT,
    categoryName VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
    PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO category(categoryName) VALUES ('Apply Art'),('English'),('Fine Art'),('Foreign'),('Health'),('Language'),('Lifeskills'),('Mathematics'),('Other'),('Physical Education'),('Science'),('Social Study'),('Special Education'),('Thai'),('Computer');

DROP TABLE IF EXISTS `subject`;
CREATE TABLE subject(
    subjectID INT NOT NULL AUTO_INCREMENT,
    subjectName VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
    categoryID INT NOT NULL,
    PRIMARY KEY (`subjectID`),
    FOREIGN KEY (`categoryID`) REFERENCES category(`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO subject(subjectName,categoryID) VALUES ('Computer Aided Design',1),('Digital Media',1),('Photography',1),('Videography',1),('History of Film',1),('Film Production',1),('Leather Working',1),('Drafting',1),('Metal Work',1),('Small Engine Mechanics',1),('English I',2),('English II',2),('English III',2),('English IV',2),('Remedial English',2),('ESL - English as Second Language',2),('World Literature',2),('Ancient Literature',2),('Medival Literature',2),('Renaissance Literature',2),('Modern Literature',2),('British Literature',2),('American Literature',2),('Composition',2),('Creative Writing',2),('Poetry',2),('Grammar',2),('Vocabulary',2),('Debate',2),('Speech',2),('Journalism',2),('Publishing Skills',2),('Photojournalism',2),('Yearbook',2),('Study Skills',2),('Research Skills',2),('Art I',3),('Art II',3),('Art III',3),('Art IV',3),('Art Appreciation',3),('Art History',3),('Drawing',3),('Painting',3),('Sculpture',3),('Ceramics',3),('Pottery',3),('Instrumental Music',3),('Music Appreciation',3),('Music History',3),('Music Theory',3),('Music  Fundamentals',3),('Band',3),('Orchestra',3),('Choir',3),('Voice',3),('Classical Music Studies',3),('Performing Arts',3),('Theater Arts',3),('Dance',3),('Health',5),('Basic First Aid and Safety',5),('Nutriton',5),('Healthful Living',5),('Personal Health',5),('Spanish',6),('Japanese',6),('German',6),('Latin',6),('Greek',6),('Hebrew',6),('Chinese',6),('Conversational',6),('Language Literature',6),('Language Culture',6),('Language History',6),('Sign Language',6),('Culinary Arts',7),('Child Development',7),('Home Management',7),('Home Organization',7),('Basic Yard Care',7),('Financial Management',7),('Driver’s Education',7),('Personal Organization',7),('Social Skills',7),('Career Planning ',7),('Remedial Math',8),('Fundamental Math or Basic Math',8),('Mathematics',8),('Pre-Algebra',8),('Introduction to Algebra',8),('Algebra I',8),('Algebra II',8),('Intermediate Algebra',8),('Geometry',8),('Trigonometry',8),('Precalculus',8),('Calculus',8),('Statistics',8),('Business Math',8),('Consumer Math',8),('Accounting',8),('Personal Finance and Investing',8),('Team Sports',10),('Gymnastics',10),('Track and Field',10),('Archery',10),('Fencing',10),('Golf',10),('Rock Climbing',10),('Outdoor Survival Skills',10),('Hiking',10),('Equestrian Skills',10),('Weightlifting',10),('Physical Fitness',10),('Aerobics',10),('Yoga',10),('Martial Arts',10),('Ice Skating',10),('Figure skating',10),('Cycling',10),('Bowling',10),('Drill Team, Honor Guard, Pageantry, Flag, Cheer',10),('Adapted P.E.',10),('General Science',11),('Physics',11),('Physical Science',11),('Chemistry',11),('Organic Chemistry',11),('Life Science',11),('Biology',11),('Zoology',11),('Marine Biology',11),('Botany',11),('Earth Science',11),('Geology',11),('Oceangraphy',11),('Meteorolory',11),('Astronomy',11),('Animal Science',11),('Equine Science',11),('Veterinary Science',11),('Forensic Science',11),('Ecology',11),('Environmental Science',11),('Gardening',11),('Food Science',11),('Ancient History',12),('Medival History',12),('Greek and Roman History',12),('Renaissance History with US History',12),('Modern History with US History',12),('World History',12),('World Geography',12),('US History',12),('World Religions',12),('World Current Events',12),('Global Issues',12),('Government',12),('Civics',12),('Economics',12),('Political Science',12),('Social Sciences',12),('Psychology',12),('Sociology',12),('Anthropology',12),('Genealogy',12),('Philosophy',12),('Logic I',12),('Logic II',12),('Critical Thinking',12),('Rhetoric',12),('Resource Program',13),('Special Day Class',13),('Keyboarding',15),('Word Processing',15),('Computer Aided Drafting',15),('Computer Applications',15),('Computer Graphics',15),('Digital Arts',15),('Photoshop',15),('Computer Programming',15),('Web Design',15),('Desktop Publishing',15),('Object-Oriented Programming I',15),('Object-Oriented Programming II',15),('Abstract Data Type',15),('Problem Solving',15),('Algorithm',15),('Software Specification & Design',15),('Computer Organization & Architecture',15),('Operating System',15),('Individual Software Development Process',15),('Software Pattern',15);

DROP TABLE IF EXISTS `file`;
CREATE TABLE file(
    fileID INT NOT NULL AUTO_INCREMENT,
    fileName VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
    filePath VARCHAR(255) NOT NULL,
    uploadTime DATETIME NOT NULL,
    subjectID INT NOT NULL,
    ownerID INT NOT NULL,
    PRIMARY KEY (`fileID`),
    FOREIGN KEY (`subjectID`) REFERENCES subject(`subjectID`),
    FOREIGN KEY (`ownerID`) REFERENCES user(`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `comment`;
CREATE TABLE comment(
    commentID INT NOT NULL AUTO_INCREMENT,
    detail LONGTEXT COLLATE utf8_unicode_ci NOT NULL,
    commentTime DATETIME NOT NULL,
    userID INT NOT NULL,
    fileID INT NOT NULL,
    PRIMARY KEY (`commentID`),
    FOREIGN KEY (`userID`) REFERENCES user(userID),
    FOREIGN KEY (`fileID`) REFERENCES file(fileID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

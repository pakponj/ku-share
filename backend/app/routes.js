// app/routes.js
var mysql = require('mysql');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '1234',
    database: 'kushare'
});

var fs = require('fs');
var path = require('path');

module.exports = function(app, passport, multer) {
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.html', {
            user: req.user
        }); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile.html', {
			user : req.user // get the user out of session and pass to template
		});
	});

    app.get('/api/profile/information', (req,res) => {
        var userID = req.session.passport.user;
        var info = [];
        connection.query('SELECT u.username,u.email,u.joinDate FROM user AS u WHERE u.userID = ?',[userID], (err,result) => {
            info.push(result);
            console.log(info);
            connection.query('SELECT f.filename,f.fileID,f.uploadTime,cat.categoryID,cat.categoryName,s.subjectID,s.subjectName FROM file AS f,user AS u, category AS cat, subject AS s WHERE f.ownerID = u.userID AND u.userID = ? AND s.subjectID = f.subjectID AND s.categoryID = cat.categoryID',[userID], (err, result) => {
                info.push(result);
                console.log(info);
                connection.query('SELECT com.detail,com.commentTime,u.userID,username,f.fileID,f.fileName FROM file AS f, comment AS com, user AS u WHERE com.userID = u.userID AND u.userID = ? AND f.fileID = com.fileID',[userID], (err, result) => {
                    info.push(result);
                    console.log(info);
                    return res.json(info);
                });
            });
        });
    });

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
    // =====================================
	// UPLOAD ==============================
	// =====================================
    // shows the upload form
	app.get('/upload', isLoggedIn, (req, res) => {
        res.render('uploadFilePage.html', {
			user: req.user
		});
	});

    app.get('/api/upload/show/subject',(req, res) => {
         connection.query('select * from subject order by subjectName',(err,result) => {
            return res.json(result)
        });
    });

    // process upload
	app.post('/upload',(req,res) => {
		multer(req,res,(err) => {
            if (err) {
				console.log(err);
                res.end('Error uploading file.')
            }
            connection.query('INSERT INTO file (fileName,filePath,uploadTime,subjectID,ownerID) values (?,?,NOW(),?,?)',[req.body.filename,req.file.filename,req.body.subjectID,req.user.userID],(err,result) => {
                if(err) throw err;
                console.log(req.body); //form fields
            	console.log(req.file); //form files
            });
            console.log(req.file.filename);
            console.log('/'+req.file.filename);
            console.log(req.body); //form fields
            console.log(req.file); //form files
		    res.redirect('/');
        });
	});

    // =====================================
    // SEARCH ==============================
    // =====================================
    app.get('/search',(req, res) => {
        res.render('table.html');
    });

    // =====================================
    // SEARCH ==============================
    // =====================================
    app.get('/category/:categoryID', (req, res) => {
        res.render('showFilesByCategory.html')
    });

    app.get('/subject/:subjectID', (req, res) => {
        res.render('showFilesBySubject.html')
    });

    // =====================================
	// VIEWS ===============================
	// =====================================
    // render view page
    app.get('/view/:openfile',(req,res) => {
        res.render('viewDocumentPage.html');
    });

    app.get('/uploads/:path', (req,res) => {
	    fs.createReadStream(path.join('./uploads/', req.params.path)).pipe(res)
	});

    // get path of file
    app.get('/api/view/file/:openfile', (req,res) => {
        connection.query('select filePath from file where fileName = ?',[req.params.openfile], (err, result) => {
            res.json(result);
        });
    });

    // =====================================
	// BROWSE ==============================
	// =====================================
    app.get('/browse', (req,res) => {
        res.render('table.html');
    });

    app.get('/api/show/browse', (req,res) => {
        connection.query('SELECT f.fileID,f.fileName,f.filePath,s.subjectID,s.subjectName,c.categoryID,c.categoryName,u.userID,u.username FROM file as f INNER JOIN subject AS s ON f.subjectID = s.subjectID INNER JOIN user AS u ON u.userID = f.ownerID INNER JOIN category AS c ON c.categoryID = s.categoryID', (err,result) => {
            if(err) throw err;
            return res.json(result);
        });
    });

    // =====================================
	// OTHER API ===========================
	// =====================================
    app.get('/api/show/catagories', (req,res) => {
        connection.query('select * from category order by categoryName',(err, result) => {
            if(err) throw err;
            return res.json(result);
        });
    });

    // query by subject
    app.get('/api/search/by/subject/:item', (req,res) => {
        connection.query('SELECT f.fileID,f.fileName,f.filePath,s.subjectID,s.subjectName,c.categoryID,c.categoryName,u.userID,u.username FROM file AS f INNER JOIN subject AS s ON f.subjectID = s.subjectID INNER JOIN category AS c ON c.categoryID = s.categoryID INNER JOIN user as u ON u.userID = f.ownerID WHERE s.subjectID = ?', [req.params.item], (err,result) => {
            if(err) throw err;
            return res.json(result);
        });
    });

    // query by category
    app.get('/api/search/by/category/:item', (req,res) => {
        connection.query('SELECT f.fileID,f.fileName,f.filePath,s.subjectID,s.subjectName,c.categoryID,c.categoryName,u.userID,u.username FROM file AS f INNER JOIN subject AS s ON f.subjectID = s.subjectID INNER JOIN category AS c ON c.categoryID = s.categoryID INNER JOIN user as u ON u.userID = f.ownerID WHERE c.categoryID = ?', [req.params.item], (err, result) => {
            if(err) throw err;
            return res.json(result);
        });
    });

    // search all item in database
    app.get('/api/search/all/:item',(req,res) => {
        var searchItem = '%'+req.params.item+'%'
        connection.query('SELECT DISTINCT f.fileID,f.fileName,f.filePath,s.subjectID,s.subjectName,c.categoryID,c.categoryName,u.userID,u.username FROM file as f INNER JOIN subject AS s ON f.subjectID = s.subjectID INNER JOIN user AS u ON u.userID = f.ownerID INNER JOIN category AS c ON c.categoryID = s.categoryID WHERE f.fileName like ? OR u.username LIKE ? OR s.subjectName LIKE ? OR c.categoryName LIKE ?',[searchItem,searchItem,searchItem,searchItem], (err,result) => {
            if(err) throw err;
            return res.json(result)
        });
    });

    //api delete file
	app.delete('/api/delete/:path',(req,res) => {
        connection.query('DELETE FROM file WHERE fileName = ? ',[req.params.path],(err, result) => {
    	    fs.unlink(path.join('./uploads/',req.params.path), (err) => {
    	        if(err) throw err;
    	        console.log('Successfully delete!!');
    	    });
        });
	    res.redirect('/');
	});

    app.get('/api/username', (req,res) => {
        var userID = req.session.passport.user;
        connection.query('SELECT username FROM user WHERE userID = ?', [userID], (err, result) => {
            return res.json(result);
        });
    });
    // 404 redirect to homepage
    //app.get('*', (req, res) => {
    //    res.redirect('/');
    //});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

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
	// PROFILE SECTION =====================
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
            connection.query('SELECT f.filename,f.fileID,f.uploadTime,cat.categoryID,cat.categoryName,s.subjectID,s.subjectName FROM file AS f,user AS u, category AS cat, subject AS s WHERE f.ownerID = u.userID AND u.userID = ? AND s.subjectID = f.subjectID AND s.categoryID = cat.categoryID',[userID], (err, result) => {
                info.push(result);
                connection.query('SELECT com.commentID,com.detail,com.commentTime,u.userID,username,f.fileID,f.fileName FROM file AS f, comment AS com, user AS u WHERE com.userID = u.userID AND u.userID = ? AND f.fileID = com.fileID',[userID], (err, result) => {
                    info.push(result);
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
            });
		    res.redirect('/browse');
        });
	});

    // =====================================
    // COMMENT =============================
    // =====================================
    app.get('/api/comment',(req,res) => {
        res.end()
    });

    app.get('/api/comments/:fileId', (req,res) => {
        connection.query('SELECT * FROM comment AS com INNER JOIN user AS u ON com.userID = u.userID where fileID = ?', [req.params.fileId], (err,result) => {
            return res.json(result);
        });
    });

    app.post('/api/comment', (req, res) => {
        connection.query('INSERT INTO comment(detail,userID,fileID,commentTime) values(?,?,?,NOW())',[req.body.commentDetail,req.session.passport.user,req.body.fileID], (err,result) => {
                if(err) throw err;
                connection.query('SELECT * FROM comment AS com INNER JOIN user AS u ON com.userID = u.userID where fileID = ?',[req.body.fileID], (err, result) => {
                    return res.json(result);
            });
        });
    });

    // =====================================
    // SEARCH ==============================
    // =====================================
    app.get('/search',(req, res) => {
        res.render('table.html',{
			user: req.user
		});
    });

    // =====================================
    // SEARCH ==============================
    // =====================================
    // Render category page
    app.get('/category/:categoryID', (req, res) => {
        res.render('showFilesByCategory.html',{
			user: req.user
		})
    });

    // query by category
    app.get('/api/search/by/category/:item', (req,res) => {
        connection.query('SELECT f.fileID,f.fileName,f.filePath,s.subjectID,s.subjectName,c.categoryID,c.categoryName,u.userID,u.username FROM file AS f INNER JOIN subject AS s ON f.subjectID = s.subjectID INNER JOIN category AS c ON c.categoryID = s.categoryID INNER JOIN user as u ON u.userID = f.ownerID WHERE c.categoryID = ?', [req.params.item], (err, result) => {
            if(err) throw err;
            return res.json(result);
        });
    });

    // Render subject page
    app.get('/subject/:subjectID', (req, res) => {
        res.render('showFilesBySubject.html',{
			user: req.user
		})
    });

    // query by subject
    app.get('/api/search/by/subject/:item', (req,res) => {
        connection.query('SELECT f.fileID,f.fileName,f.filePath,s.subjectID,s.subjectName,c.categoryID,c.categoryName,u.userID,u.username FROM file AS f INNER JOIN subject AS s ON f.subjectID = s.subjectID INNER JOIN category AS c ON c.categoryID = s.categoryID INNER JOIN user as u ON u.userID = f.ownerID WHERE s.subjectID = ?', [req.params.item], (err,result) => {
            if(err) throw err;
            return res.json(result);
        });
    });

    // =====================================
	// VIEWS ===============================
	// =====================================
    // render view page
    app.get('/view/:openfile',isLoggedIn,(req,res) => {
        res.render('viewDocumentPage.html',{
			user: req.user
		});
    });

    // return file in server
    app.get('/uploads/:path', (req,res) => {
	    return fs.createReadStream(path.join('./uploads/', req.params.path)).pipe(res)
	});

    // get path of file
    app.get('/api/view/file/:openfile', (req,res) => {
        connection.query('select * from file where fileName = ?',[req.params.openfile], (err, result) => {
            res.json(result);
        });
    });

    // =====================================
	// BROWSE ==============================
	// =====================================
    // browse all file
    app.get('/browse', (req,res) => {
        res.render('browse.html',{
			user: req.user
		});
    });

    // query in browse page
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

    // search all item in database
    app.get('/api/search/all/:item',(req,res) => {
        var searchItem = '%'+req.params.item+'%'
        connection.query('SELECT DISTINCT f.fileID,f.fileName,f.filePath,s.subjectID,s.subjectName,c.categoryID,c.categoryName,u.userID,u.username FROM file as f INNER JOIN subject AS s ON f.subjectID = s.subjectID INNER JOIN user AS u ON u.userID = f.ownerID INNER JOIN category AS c ON c.categoryID = s.categoryID WHERE f.fileName like ? OR u.username LIKE ? OR s.subjectName LIKE ? OR c.categoryName LIKE ?',[searchItem,searchItem,searchItem,searchItem], (err,result) => {
            if(err) res.redirect('/search');
            return res.json(result)
        });
    });

    //api delete file
	app.get('/api/delete/:id',(req,res) => {
        connection.query('DELETE FROM comment WHERE fileID = ?',[req.params.id],(err,result) => {
            connection.query('SELECT * FROM file WHERE fileID = ?', [req.params.id], (err,result) => {
                fs.unlink(path.join('./uploads/',result[0].filePath), (err) => {
        	        if(err) throw err;
                    connection.query('DELETE FROM file WHERE fileID = ? ',[req.params.id],(err, result) => {
                        if(err) throw err;
                        console.log('Successfully delete!!');
                    });
        	    });
            });
        });
        res.redirect('/profile');
	});

    app.get('/api/delete/comment/:id',(req,res) => {
        connection.query('DELETE FROM comment WHERE commentID = ? ',[req.params.id],(err, result) => {
            if(err) throw err;
            console.log('Delete comment Successfully...');
        });
	    res.redirect('/profile');
	});

    app.get('/api/username', (req,res) => {
        if(req.session.passport) {
            var userID = req.session.passport.user;
            console.log("Current session username: ", userID);
            connection.query('SELECT username FROM user WHERE userID = ?', [userID], (err, result) => {
                return res.json(result);
            });
        }
        else {
            res.end()
        }
    });
    // 404 redirect to homepage
    app.get('*', (req, res) => {
        res.redirect('/');
    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

// app/routes.js
var mysql = require('mysql');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '1234',
    database: 'kushare'
})

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
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
    // =====================================
	// UPLOAD ==============================
	// =====================================
    // shows the upload form
	app.get('/upload', isLoggedIn, function (req, res) {
        res.render('uploadFilePage.html', {
			user: req.user
		});
	});

    // process upload
	app.post('/upload', function(req,res){
		multer(req,res,(err) => {
            if (err) {
				console.log(err);
                res.end('Error uploading file.')
            }
            connection.query('INSERT INTO file (fileName,filePath,subjectID,ownerID) values (?,?,?,?)',[req.file.filename,req.file.filename,req.body.subjectID,req.user.userID],(err,result) => {
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
	// SUBJECTS ==============================
	// =====================================
    // render subject page
    app.get('/subject/:subjectName', (req,res) => {
        res.render('showSubject.html')
    })

	app.get('/uploads/:path', (req,res) => {
	    fs.createReadStream(path.join('./uploads/', req.params.path)).pipe(res)
	});

    // =====================================
	// VIEWS ============================
	// =====================================
    // render view page
    app.get('/view/:openfile',(req,res)=>{
        res.render('viewDocumentPage.html');
    });

    // get path of file
    app.get('/api/view/file/:openfile', (req,res) => {
        connection.query('select filePath from file where fileName = ?',[req.params.openfile], (err, result) => {
            res.json(result);
        });
    });

    // access individual category page
    app.get('/category/:categoryName', (req,res) => {
        res.render('individualCategory.html');
    });

    // api get subjects
    app.get('/api/show/:categoryName/subjects', (req,res) => {
        connection.query('select * from subject as s,category as cat where cat.categoryID = s.categoryID and categoryName = ? order by s.subjectName',[req.params.categoryName],(err, result) => {
            console.log("result: "+result);
            if(err) throw err;
            return res.json(result);
        });
    });

    // =====================================
    // CATEGORY ==============================
    // =====================================
    // shows categories page
    app.get('/category', (req,res) => {
        res.render('showCategory.html');
    });

    // query all catagories
    app.get('/api/category',(req,res) => {
        connection.query('select * from category order by categoryName', (err, result) => {
            return res.json(result);
        });
    });

    // =====================================
	// API =================================
	// =====================================
    app.get('/api/show/catagories', (req,res) => {
        connection.query('select * from category order by categoryName',(err, result) => {
            if(err) throw err;
            return res.json(result);
        });
    });

    app.get('/api/search/:item',(req,res) => {
        var itemArrays = []
        connection.query('select fileID,fileName from file where file.fileName like ?',[
            '%'+req.params.item+'%'],(err,result) => {
            if(err) throw err;
            itemArrays = itemArrays.concat(result);
            connection.query('select userID,username from user where username like ?',['%'+req.params.item+'%'], (err, result) => {
                if(err) throw err;
                itemArrays = itemArrays.concat(result);
                connection.query('select subjectID,subjectName from subject where subjectName like ?', ['%'+req.params.item+'%'], (err, result) => {
                    if(err) throw err;
                    itemArrays = itemArrays.concat(result);
                    connection.query('select * from category where categoryName like ?',['%'+req.params.item+'%'], (err,result) => {
                        if(err) throw err;
                        itemArrays = itemArrays.concat(result);
                        return res.json(itemArrays)
                    })
                })
            })
        })
    });
    //api delete file
	app.get('/api/delete/:path',(req,res) => {
        connection.query('DELETE FROM file WHERE fileName = ? ',[req.params.path],(err, result) => {
    	    fs.unlink(path.join('./uploads/',req.params.path), (err) => {
    	        if(err) throw err;
    	        console.log('Successfully delete!!');
    	    });
        });
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


var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var { exec } = require("child_process");
var { execSync } = require("child_process");
var sha512 = require("sha512crypt-node/sha512crypt.js").b64_sha512crypt;
var session = require('express-session')
var MemoryStore = require('memorystore')(session)
var formidable = require('formidable')
var util = require('util')
var fs = require('fs');
var https = require('https')
var csrf = require('csurf')

function validate() {
	for (var i = 0; i < arguments.length; i++) {
    	if (/[^\w.-]/gi.test(arguments[i]) == true) {
			return false;

		}
  	}
  	return true;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('static/js'));
app.use(express.static('static/css'));
app.use(express.static('static/images'));
app.use(session({
  secret: 'ZF9dadOJRZ5gsYpZZtJsuAUQClq1Kx9UF8bxsovA',
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: { secure: true, maxAge: 1800000},
  store: new MemoryStore({
      checkPeriod: 1800000
    }),
}))

app.use(cookieParser())
app.use(csrf({ cookie: true }))

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(8000, '0.0.0.0', function () {
  console.log('Listening on https://localhost:8000/')
})

app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  	res.render('index.ejs', {token: req.csrfToken()});
});

app.post('/session', function(req, res) {
	if (req.session.userId == req.session.id) {
		var user = JSON.parse('[ {"user":"'+req.session.sessionUser+'"} ]');
		var response = JSON.parse('{"response":"Valid session"}');
		data = user.concat(response)
		res.send(data)
	}
	else {
		req.session.destroy();
		res.send()
	}
});

app.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var check = /^(^[a-z_]([a-z0-9_-]{0,31}))$/.test(username);
	var passwordHash = execSync("mkpasswd -m sha-512 " + password).toString()
	passwordHash = (passwordHash).trim()
	var status = 0;
	if (check == false) {
		res.send("Error")
	}
	else {
		test: try {
		    return execSync("id -u "+username).toString();
		} 
		catch (error) {
		    error.status;
		    status = error.status;
		}
		finally {
			if (status == 1) {
				execSync("useradd -m -p '"+passwordHash+"' "+username).toString()
		   		res.send("Successful registration")
	   		}
	   		else if (status == 0) {
	   			req.session.destroy();	
				res.send("User already exists");
				return;
	   		}
	   		else {
	   			req.session.destroy();	
				res.send("Error");
	   		}
		}
	}
	
});

app.post('/login', function(req, res) {
	if (validate(req.body.username) == false) {
		res.send("Input error")
	}
	else {
		var username = req.body.username
		req.session.userId = req.session.id;
		req.session.sessionUser = req.body.username
		req.session.save();
		if (fs.existsSync("/home/"+username)) {
		    var salt = execSync("grep -m 1 " +username+ " /etc/shadow | awk -F'$' '{print $3}'").toString();
	   		salt = (salt).trim()
	   		var passwordHash = sha512(req.body.password, salt);
	   		passwordRealHash = execSync("grep -m 1 " +username+ " /etc/shadow | awk -F':' '{print $2}'").toString();
	   		passwordRealHash = (passwordRealHash).trim()
	   		if (passwordHash == passwordRealHash && req.session.userId == req.session.id) {
	   			req.session.user = username;
	   			req.session.back = 0;
	   			req.session.filterParameter = ""
	   			req.session.pwd = "/home/"+req.session.user
				res.send("Successful authentication");
			}
			else {
				req.session.destroy();
				res.send("Authentication failed");
			}
	 	} 
	 	else {
		    req.session.destroy();    		
	   		res.send("User does not exists");
	  	}
	}	
});


app.post('/directories', function(req, res) {
	if (validate(req.body.directoryName, req.body.filter) == false) {
		res.send("Input error")
	}
	else {
		req.session.back = req.body.back
		req.session.filterParameter = req.body.filter
		req.session.reqDirectory = ""+req.body.directoryName+""
		req.session.ppwd = (execSync("dirname $PWD", {cwd: req.session.pwd}).toString()).trim()
		if (req.session.back == 1){
			if (req.session.ppwd == "/home") {
				req.session.pwd = "/home/"+req.session.user
			}
			else {
				req.session.pwd = req.session.ppwd
			}
		}
		else if (req.body.directoryName === undefined){
			req.session.pwd = req.session.pwd
		}
		else {
			req.session.pwd = req.session.pwd+"/"+req.session.reqDirectory
		}
		req.session.ppwd = (execSync("dirname $PWD", {cwd: req.session.pwd}).toString()).trim()
		if (req.session.ppwd == "/home") {
			req.session.pwd = "/home/"+req.session.user
		}
		req.session.sortOption = req.body.sort
		if (req.session.sortOption == 0) {
			req.session.sortParameter = ""
		}
		else if (req.session.sortOption == 1) {
			req.session.sortParameter = " -r "
		}
		else if (req.session.sortOption == 2) {
			req.session.sortParameter = " -t "
		}
		else if (req.session.sortOption == 3) {
			req.session.sortParameter = " -t -r "
		}
		else if (req.session.sortOption == 4) {
			req.session.sortParameter = " --sort=size "
		}
		else {
			req.session.sortParameter = ""
		}
		if (req.session.userId != req.session.id) {
			req.session.destroy();
			res.send("Invalid session")
			return;
		}
		else {
			req.session.pwdObj = JSON.parse((JSON.stringify({currentPath:(req.session.pwd).trim()})).replace(/\\n/g, ''))
			tree = execSync("tree -J -L 1 --matchdirs --ignore-case --prune -P '*"+req.session.filterParameter+"*' --noreport --dirsfirst"+req.session.sortParameter, {cwd: req.session.pwd}).toString()
			if (tree.match(/,/g).length >= 3) {
				tree = tree.replace(/,(?=[^,]*$)/, '')
			}
			treeObj = JSON.parse(tree)
			for (i = 0; i < Object.keys(treeObj[0].contents).length; i++) {
				var fileName = treeObj[0].contents[i].name
	            var fileType = (execSync("file -b "+"'"+fileName+"'", {cwd: req.session.pwd}).toString()).trim()
	            treeObj[0].contents[i].type = fileType
	        }
	        req.session.userPwd = tree.toString()
			data = treeObj.concat(req.session.pwdObj)
			res.send(data)
		}
	}
});

app.post('/update', function(req, res) {
	if (req.session.userId != req.session.id) {
		req.session.destroy();
		res.send("Invalid session")
		return;
	}
	req.session.comparePwd = execSync("tree -J -L 1 --matchdirs --ignore-case --prune -P '*"+req.session.filterParameter+"*' --noreport --dirsfirst"+req.session.sortParameter, {cwd: (req.session.pwd).trim()}).toString()
	req.session.comparePwd = (req.session.comparePwd).replace(/,(?=[^,]*$)/, '')
	if (req.session.userPwd != req.session.comparePwd) {
		res.send("Changed")
		return;
	}
	else {
		res.send("Not changed")
		return;
	}
});

app.post('/rename', function(req, res) {
	if (req.session.userId != req.session.id) {
		req.session.destroy();
		res.send("Invalid session")
		return;
	}
	else if (validate(req.body.file, req.body.newName) == false) {
		res.send("Input error")
	}
	else {
		var file = req.body.file
		var newName = req.body.newName
		if (fs.existsSync((req.session.pwd).trim()+"/"+newName)) {
			res.send("Already exists")
		}
		else {
			fs.renameSync((req.session.pwd).trim()+"/"+file, (req.session.pwd).trim()+"/"+newName)
			res.send("Renamed")
		}	
	}
		
});

app.post('/delete', function(req, res) {
	if (req.session.userId != req.session.id) {
		req.session.destroy();
		res.send("Invalid session")
		return;
	}
	else if (validate(req.body.file) == false) {
		res.send("Input error")
	}
	else {
		var file = req.body.file
		var fileType = req.body.fileType
		if (fileType == "directory") {
			fs.rmdirSync((req.session.pwd).trim()+"/"+file, {recursive: true})
			res.send("Removed")
		}
		else if (fileType != "") {
			fs.unlinkSync((req.session.pwd).trim()+"/"+file)
			res.send("Removed")
		}
		else {
			res.send("Error")
		}	
	}	
});

app.post('/info', function(err, req, res) {
	if (req.session.userId != req.session.id) {
		req.session.destroy();
		res.send("Invalid session")
		return;
	}
	var file = req.body.file
	var fileType = req.body.fileType
	if (fileType == "directory") {
		var ls = (execSync("du -sh "+file, {cwd: (req.session.pwd).trim()})).toString()
		var size = ls.split('\t')
		res.send("Success")
	}
	else if (fileType == "file") {
		var ls = (execSync("ls -sh "+file, {cwd: (req.session.pwd).trim()})).toString()
		var size = ls.split(' ')
		res.send("Success")
	}
	else {
		res.send("Error")
	}
});

app.post('/download', function(req, res) {
	if (req.session.userId != req.session.id) {
		req.session.destroy();
		res.send("Invalid session")
		return;
	}
	else if (validate(req.body.file, req.body.fileType) == false) {
		res.send("Input error")
	}
	else {
		var file = req.body.file
		var fileType = req.body.fileType
		var filePath =  (req.session.pwd).trim()+"/"+file
      	if (fs.existsSync(filePath)) {
	      	if (fileType == "directory") {
				res.writeHead(200, {
	          	"Content-Type": "application/octet-stream",
	          	"Content-Disposition": "attachment; filename=" + file
	        	});
	        	fs.createReadStream(filePath).pipe(res);
			}
			else if (fileType !== "") {
				res.writeHead(200, {
				"Content-Type": "application/octet-stream",
	          	"Content-Disposition": "attachment; filename=" + file
	        	});
	        	fs.createReadStream(filePath).pipe(res);	
			}
			else {
				res.send("Error")
			}
      	} 
      	else {
        	res.send("Error")
      	}
	}
});


app.post('/newfolder', function(req, res) {
	if (req.session.userId != req.session.id) {
		req.session.destroy();
		res.send("Invalid session")
		return;
	}
	else if (validate(req.body.folderName) == false) {
		res.send("Input error")
	}
	else {
		var folderName = req.body.folderName
		if (fs.existsSync((req.session.pwd).trim()+"/"+folderName)) {
			res.send("Already exists")
		}
		else {
			fs.mkdirSync((req.session.pwd).trim()+"/"+folderName);
			res.send("Folder created")
		}
	}	
});

app.post('/newfile', function(req, res) {
	if (req.session.userId != req.session.id) {
		req.session.destroy();
		res.send("Invalid session")
	}
	else if (validate(req.body.fileName) == false) {
		res.send("Input error")
	}
	else {
		var fileName = req.body.fileName
		if (fs.existsSync((req.session.pwd).trim()+"/"+fileName)) {
			res.send("Already exists")
		}
		else {
			fs.writeFileSync((req.session.pwd).trim()+"/"+fileName)
			res.send("File created")
		}
	}	
});

app.post('/upload', function(req, res) {
	if (req.session.userId != req.session.id) {
		req.session.destroy();
		res.send("Invalid session")
	}
	else {
		var form = new formidable.IncomingForm();
		form.multiples = true;
		form.keepExtensions = true;
		form.uploadDir = req.session.pwd
		form.on('error', function(err) {
			res.send("Input error")
	        res.end()
		});
		form.on('file', (name, file) => {
				fs.rename((file.path).toString(), (form.uploadDir).toString()+"/"+(file.name).toString(), function (err) {
					if(err) {
						res.send("Error")
					}
				});
	    })
	    form.onPart = function (part) {

			if (validate(part.filename) == false) {
				form.handlePart(part);
				res.send("Input error")
				res.end()
			}
		}
	    form.parse(req, function(err, fields, files){
	    	if(err) {
				res.send("Error")
			}
			else {
				res.send("Uploaded")
			}
	    })
	}
});

app.post('/visualizer', function(req, res) {
	if (req.session.userId != req.session.id) {
		req.session.destroy();
		res.send("Invalid session")
		return;
	}
	else if (validate(req.body.file) == false) {
		res.send("Input error")
	}
	var file = req.body.file
	req.session.path =  (req.session.pwd).trim()
	var fileType = (execSync("file -b "+"'"+file+"'", {cwd:req.session.path}).toString()).trim()
	if (req.session.userId != req.session.id) {
		req.session.destroy();
		res.send("Invalid session")
		return;
	}
	else if (fileType.includes("ASCII")) {
		var cat = fs.readFileSync(req.session.path+"/"+file)
		res.send(cat)
	}
	else {
		res.send("Not viewable")
	}
});

app.post('/logout', function(req, res) {
	if (req.session.userId != req.session.id) {
		req.session.destroy();
		res.send("Invalid session")
		return;
	}
	req.session.destroy();
	res.send("success")
});
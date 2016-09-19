var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/treats';
var port = process.env.PORT || 8080;

//spin up server
app.listen(port, function(){
	console.log('server up and running on port', port);
});

//base url
app.get('/', function (req, res){
	console.log('base url hit');
	res.sendFile(path.resolve('public/views/index.html'));
}); //end base url

//get Treats
app.get('/treats', function (req, res){
	console.log('in get treats');
	pg.connect(connectionString, function (err, client, done){
		if(err){
			console.log(err);
		} //end err
		 else{
			console.log('connected to db');
			//array to hold our results:
			var results = [];

			var queryResults = client.query('SELECT * FROM treats');
			queryResults.on('row', function(row){
				//push each row into results array
				results.push(row);
			}); //end on row
			queryResults.on('end', function(){
				//done then send the results to client
				done();
				res.send(results);
			}); //end done
		}
	});//end pgconnect
});//end getTreats

app.post('/treats', urlencodedParser, function (req, res){
	console.log('in newTreat:', req.body);
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log(err);
		}
		else{
			console.log('connected to db for POST');
			//insert new treat into db
			client.query('INSERT INTO treats(treat_name, treat_description, treat_image_url) VALUES ($1, $2, $3)', [req.body.name, req.body.description, req.body.image_url]);
		} //end no error

	})//end pg.connect
	//send back something to client will get to success
	res.send(true);
});//end app.post
//static file
app.use( express.static( 'public' ) );

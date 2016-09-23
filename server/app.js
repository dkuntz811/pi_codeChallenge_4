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
				return res.json(results);
				console.log('results are', results);
			}); //end done
		}
	});//end pgconnect
});//end getTreats

app.post('/treats', urlencodedParser, function (req, res){
	console.log('in newTreat:', req.body);

	var name = req.body.name;
	var description = req.body.description;
	var url = req.body.url;
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log(err);
		}
		else{
			console.log('connected to db for POST');
			//insert new treat into db
			var queryResults = client.query('INSERT INTO treats (name, description, imageurl) VALUES ($1, $2, $3)', [name, description, url]);
          done();
		} //end else
        queryResults.on('end', function(){
					done();
					//send back something to client will get to success
					res.send({success: true});
				});//end queryResult on
	})//end pg.connect


});//end app.post
//static file
app.use( express.static( 'public' ) );

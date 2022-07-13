//connect
var mysql = require('mysql');
var XMLHttpRequest = require('xhr2');
var con = mysql.createConnection({
  host: "fleet.iad1-mysql-e2-20a.dreamhost.com",
  user: "seesi",
  password: "saml3651",
  database: "bazaar_data"
});
//define
let filtered = []
let products = []
let results = []
let anum = 0
let results2 = []
let results3 = []
let results4 = []
let results5 = []
let results6 = []
//insert the data
function run(somedata, sql) {
  con.connect(function(err) {
    //Insert a record in the "customers" table:
	var values = somedata;
    con.query(sql, [values], function(err, result) {
    });
  });

  values = []
}
//deleate the data
function deleateSQL(){
	con.connect(function(err) {
	  var sql = "DELETE FROM Closed_Sell_Orders";
	  con.query(sql, function (err, result) {
	  });
	});
}
results2 = []
function runothers(sql) {
	  con.connect(function(err) {
		//Insert a record in the "customers" table:
		con.query(sql, function (err, result, fields) {
		for (y in result){
			results2.push(Object.values(JSON.parse(JSON.stringify(result[y]))));
		}
		return results2;
		});
	});
}
let Active = []
let Cloased = []
function Sort(){
	Active = runothers("SELECT * FROM Active_Sell_Orders")
	//Closed = runothers("SELECT * FROM Closed_Sell_Orders")
	Cloased = []
	for (x in Cloased){
		Active.push(Cloased[x])
	}
	setTimeout(function(){ Sort_The_Rest(); }, 7000);
}
function Sort_The_Rest(){
	anum += 1
	console.log("S_C_O", anum)
	results3 = Object.entries(results2.reduce((r, [name, value]) => {
		 if (!(name in r) || r[name] > value) r[name] = value;
				return r;
	}, {}));
	for (x in results3){
		results4.push([results3[x]])
	}
	for (z in results2){
	  let index = results4.findIndex(x => x[0][0] === results2[z][0])
	  if (index != -1){
		results4[index].push(results2[z])
	  }
	}
	for (y in results4){
		results4[y].shift()
		results4[y].sort((a, b, c, d) => a[3] - b[3]);
		if (results4[y].length == 0){
			results4.splice(y, 1)
		}

	}
	for (x in results4){
		results5.push(results4[x].slice(-20))
	}
	results6.push(results5.flat(1))
	results6 = results6.flat(1)
	for (x in results6){
	}
	deleateSQL()

	run(results6, "INSERT INTO Closed_Sell_Orders (Item_Name, Price, Increase, Time_In) VALUES ?")
	filtered = []
	products = []
	results = []
	results2 = []
	results3 = []
	results4 = []
	results5 = []
	results6 = []
}
setInterval(function(){ Sort() }, 10000);
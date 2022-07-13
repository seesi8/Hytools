var mysql = require('mysql');
var XMLHttpRequest = require('xhr2');
var con = mysql.createConnection({
  host: "fleet.iad1-mysql-e2-20a.dreamhost.com",
  user: "seesi",
  password: "saml3651",
  database: "bazaar_data"
});
let filtered = []
let anum = 0;
let products = []
let results = []
function run(somedata) {
  con.connect(function(err) {
    //Insert a record in the "customers" table:
    var sql = "INSERT INTO Active_Buy_Orders (Item_Name, Quantity) VALUES ?";
	var values = somedata;
    con.query(sql, [values], function(err, result) {
    });
  });
}

function Create(data, color) {
  var table = document.getElementById("table");
  var row = table.insertRow(0);
  row.style.backgroundColor = color;
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  cell1.innerHTML = data[3];
  cell2.innerHTML = data[0];
}

function httpGet() {
  results = [];
  products = [];
  filtered = [];
  anum += 1;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://api.hypixel.net/skyblock/bazaar"); // false for synchronous request
  xmlHttp.send(null);
  xmlHttp.onload = function () {
	  const obj = JSON.parse(xmlHttp.responseText);
	  filtered = obj.products;
	  for (x in filtered) {
		  for (z in filtered[x].buy_summary){
			products.push([filtered[x].product_id, filtered[x].buy_summary[z].amount])
		  }
	  }
	  sort()
  }
}
async function sort() {
  runothers();
  setTimeout(function(){ sorttherest(); }, 7000);

}
async function sorttherest() {
  deleateSQL()
  let filteredArray = results.filter(value => products.includes(value));
  let results2 = []
  for (y in results){
   results2.push(Object.values(JSON.parse(JSON.stringify(results[y]))))
  }
  results = results2;
  for (z in products) {
	if (results.find(x => x[0] === products[z][0] && x[1] === products[z][1]) != undefined){
		filteredArray.push(results.find(x => x[0] === products[z][0] && x[1] === products[z][1]))
	}
  }
  for (y in filteredArray){
  results.splice(results.findIndex(x => x[0] === filteredArray[y][0] && x[1] === filteredArray[y][1]),1)
  products.splice(products.findIndex(x => x[0] === filteredArray[y][0] && x[1] === filteredArray[y][1]),1)
  }
  B_C_O();
  run(products);
  run(filteredArray);
}
async function runothers() {
	  con.connect(function(err) {
		//Insert a record in the "customers" table:
		con.query("SELECT * FROM Active_Buy_Orders", function (err, result, fields) {
		results = result
		});
	});
	
}
async function deleateSQL(){
	con.connect(function(err) {
	  var sql = "DELETE FROM Active_Buy_Orders";
	  con.query(sql, function (err, result) {
	  });
	});
}

async function B_C_O(){
	console.log("B_C_O", anum)
	let results3 = [];
	for (p in results){
		results3.push([results[p][0], results[p][1], new Date(results[p][2]), new Date(), new Date() - new Date(results[p][2])])
	}
	con.connect(function(err) {
    //Insert a record in the "customers" table:
    var sql = "INSERT INTO Closed_Buy_Orders (Item_Name, Quantity, Time_In, Time_Out, Time_To_Cloase) VALUES ?";
	var values = results3;
    con.query(sql, [values], function(err, result) {
    });
  });
}
setInterval(function(){ httpGet(); }, 10000);
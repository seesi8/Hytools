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
let results2 = []
let results3 = []
let results5 = []
let anum = 0
//insert the data
function run(somedata, sql) {
  con.connect(function(err) {
    //Insert a record in the "customers" table:
    var sql = "INSERT INTO Active_Sell_Orders (Item_Name, Price, Increase) VALUES ?";
	var values = somedata;
    con.query(sql, [values], function(err, result) {
		if (err){
			let errmsg = err.sqlMessage;
		}
    });
  });

  values = []
}
//deleate the data
function deleateSQL(){
	con.connect(function(err) {
	  var sql = "DELETE FROM Active_Sell_Orders";
	  con.query(sql, function (err, result) {
	  });
	});
}
//pull from API
function httpGet() {
  results = [];
  products = [];
  tempproducts = [];
  filtered = [];
  var xmlHttp = new XMLHttpRequest();
  anum +=1
  xmlHttp.open("GET", "https://api.hypixel.net/skyblock/bazaar"); // false for synchronous request
  xmlHttp.send(null);
  xmlHttp.onload = function () {
	  const obj = JSON.parse(xmlHttp.responseText);
	  filtered = obj.products;
	  //get only the order info
	  for (x in filtered) {
		  for (z in filtered[x].buy_summary){
			tempproducts.push([filtered[x].product_id, filtered[x].buy_summary[z].pricePerUnit])
		  }
		  products.push(tempproducts);
		  tempproducts = [];
	  }
	  sort()
  }
}
//initialise sorting the rest after it has time to finsih reading 
function sort() {
  runothers();
  setTimeout(function(){ sorttherest(); }, 7000);

}
//finish sorting the data
function sorttherest() {

	for (y in results){
		//clarify the data
		results2.push(Object.values(JSON.parse(JSON.stringify(results[y]))))
		results5.push(Object.values(JSON.parse(JSON.stringify(results[y]))))
	}
	//make sure they are the correct length as not to cause a error inserting into sql
	for (x in results2){
		results2[x].length = 2
		results5[x].length = 4
	}
	//resudce results2 that way it is onlt the latist so we have something to compare it to later
	let results3 = Object.entries(results2.reduce((r, [name, value]) => {
		 if (!(name in r) || r[name] > value) r[name] = value;
				return r;
	}, {}));
	//add results3 to the coresponding part of the list
	for (h in products){
		for (p in results3){
		if (products[h][0] != undefined){
			if (results3[p][0] == products[h][0][0]){ 
				products[h].unshift(results3[p])
				break
		 }
		}

		}
	}
	//sort them so that lowest is first that way we can run increase data
	for (x in products){
		products[x].sort((a, b) => a[2] - b[2]);
	}
	//add increase over last
	for  (x in products){
		for (y in products[x]){
			//the y != 0 is becaosue the increase over the last is not needed for the first one becaosue it is already in the databse
			if (y != 0){
				products[x][y].push(products[x][y][1]- products[x][y-1][1]);
			}
			else {
				products[x][y].push(0);
			}
		}
		
	}
	//remove the first becaoseu it is already in the db
	for (x in products)
	{
		products[x].shift()
		
	}

	// i guess i made products 2 the same as products without refrence i dont know why?
	let products2 = []
	for (x in products){
		products2.push(products[x])
	}
	//flatten to remove item group
	products2 = products2.flat(1)
	let filteredArray = [];
	//find ones were it is the same in both lists
	for (z in products2) {
		if (results2.find(x => x[0] === products2[z][0] && x[1] === products2[z][1]) != undefined){
			filteredArray.push(results5.find(x => x[0] === products2[z][0] && x[1] === products2[z][1]))
		}
    }
	//remove the sames from both lists
	for (y in filteredArray){
		results5.splice(results5.findIndex(x => x[0] === filteredArray[y][0] && x[1] === filteredArray[y][1]),1)
		products2.splice(products2.findIndex(x => x[0] === filteredArray[y][0] && x[1] === filteredArray[y][1]),1)
	}
	
	//insert the products2
	console.log("S_O_O",anum)
	deleateSQL();
	run(products2, "INSERT INTO Active_Sell_Orders (Item_Name, Price, Increase) VALUES ?");
	run(filteredArray, "INSERT INTO Active_Sell_Orders (Item_Name, Price, Increase, Time_In) VALUES ?");
	filteredArray = []
	results2 = []
	products2 = []
	tempproducts = []
	products = []
	filtered = []
	
}
function runothers() {
	  con.connect(function(err) {
		//Insert a record in the "customers" table:
		con.query("SELECT * FROM Active_Sell_Orders", function (err, result, fields) {
		results = result
		});
	});
	
}

setInterval(function(){ httpGet(); }, 10000);
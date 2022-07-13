var mysql = require('mysql');
var XMLHttpRequest = require('xhr2');
var con = mysql.createConnection({
  host: "fleet.iad1-mysql-e2-20a.dreamhost.com",
  user: "seesi",
  password: "saml3651",
  database: "bazaar_data"
});

function run(somedata) {
  console.log(somedata);
  con.connect(function(err) {
    console.log("Connected!");
    //Insert a record in the "customers" table:
    var sql = "INSERT INTO Bazaar_Orders_Price (name, address, city, state) VALUES ?";
	var values = somedata;
    con.query(sql, [values], function(err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}
let filered = []
const products = []

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
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://api.hypixel.net/skyblock/bazaar"); // false for synchronous request
  xmlHttp.send(null);
  xmlHttp.onload = function () {
	  const obj = JSON.parse(xmlHttp.responseText);
	  filtered = obj.products;

	  for (x in filtered) {
		let buyPrice = filtered[x].quick_status.buyPrice;
		let sellPrice = filtered[x].quick_status.sellPrice;
		products.push([filtered[x].product_id, buyPrice, sellPrice, buyPrice - sellPrice])
	  }
	  sort()
  }
}
async function sort() {
  products.sort((a, b) => a[3] - b[3]);
  run(products);
}
httpGet();
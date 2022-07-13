var mysql = require('mysql');

var con = mysql.createConnection({
  host: "fleet.iad1-mysql-e2-20a.dreamhost.com",
  user: "seesi",
  password: "saml3651",
  database: "bazaar_data"
});
let filered = []
const products = []
async function read() {
  con.connect(function(err) {
    //Insert a record in the "customers" table:
    con.query("SELECT * FROM Closed_Buy_Orders", function(err, result, fields) {
      let results = result
    });
  });

}

function real() {
  read()
  setTimeout(function() {
    Sort_The_Rest();
  }, 7000);
}

function Sort_The_Rest() {
  let results2 = []
  for (y in results) {
    results2.push(Object.values(JSON.parse(JSON.stringify(results[y]))))
  }
  console.log(results2)
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
  var XMLHttpRequest = require('xhr2');
  real()
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://api.hypixel.net/skyblock/bazaar", false); // false for synchronous request
  xmlHttp.send(null);
  const obj = JSON.parse(xmlHttp.responseText);
  filtered = obj.products;
  console.log(filtered);

  for (x in filtered) {
    let buyPrice = filtered[x].quick_status.buyPrice;
    let sellPrice = filtered[x].quick_status.sellPrice;
    products.push([filtered[x].product_id, buyPrice, sellPrice, buyPrice - sellPrice])
  }
  sort()
}
async function sort() {
  products.sort((a, b) => a[3] - b[3]);
  for (z in products) {
    if (z % 2 == 0) {
      Create(products[z], "rgba(16, 96, 224, .5)");
    } else {
      Create(products[z], "rgba(78, 163, 36, .5)");
    }
  }
}


<html>

  <head>
    <link rel="stylesheet" href="/CSS/baazar.css">
    <title>Bazaar Flipper</title>
    </script>
  </head>

  <body>

    <div>
      <pt>Bazaar Flipper<br></pt>
	  <form action="javascript:(go())" method="POST" id = "form">
        <label for="fname">How much money are you willing to spend:</label>
        <input type="text" id="tmoney" name="tmoeny" value="1000000000"><br>
		<label for="fname">How long to compleate order:</label>
		<input type="text" id="ltime" name="ltime" value="2"><br>
        <input type="submit">
		</div>
		<table id="table">
		  <tr>
			<td></td>
			<td></td>
			<td></td>
		  </tr>
		</table>
		<body>
			<?php
			echo "hi";
			$servername = "fleet.iad1-mysql-e2-20a.dreamhost.com";
			$username = "seesi";
			$password = "saml3651";
			$dbname = "bazaar_data";

			// Create connection
			$conn = new mysqli($servername, $username, $password, $dbname);
			// Check connection
			if ($conn->connect_error) {
				die("Connection failed: " . $conn->connect_error);
			}

			$sql = "SELECT * FROM Active_Sell_Orders";
			$stmt = DB::run($sql);
			while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				$number= $row['number'];
				$data = $row['data'];
				$array[$number][] = $data;
				echo "$array";
				echo "done";
			}

			$conn->close();
			?>
			<script type="text/javascript">
			// pass PHP array to JavaScript array
			function go(){
				var products = <?php echo json_encode( $array ) ?>;

				// result seen through view source
				// var products = [["choc_cake","Chocolate Cake",15],["carrot_cake","Carrot Cake",12],["cheese_cake","Cheese Cake",20],["banana_bread","Banana Bread",14]];

				// how to access elements in multi-dimensional array in JavaScript
				alert( products ); // Chocolate Cake
			}
			</script>
		</body>

</html>

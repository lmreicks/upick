<?php
//Get all categories for the DB and return them to the client
$app->get('/api/categories', function () {
    require_once('../dbconnect.php');

    $query = 'SELECT id,title FROM categories ORDER BY views DESC';

    $result = $db->query($query);

    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($data);
});
?>
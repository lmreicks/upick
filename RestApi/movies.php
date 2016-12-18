<?php
//Get the movie at a specified ID
$app->get('/api/movies/{id}', function ($request, $response, $args) {
    require_once('../dbconnect.php');

    $id = $request->getAttribute('id');

    $query = "SELECT * FROM movies WHERE `id`='$id'";
    
    $result = $db->query($query);

    $data = $result->fetch_assoc();

    header('Content-Type: application/json');
    echo json_encode($data);
});

//Get all the movies from a specific category
$app->get('/api/categories/{id}/movies', function ($request, $response, $args) {
    require_once('../dbconnect.php');

    $id = $request->getAttribute('id');

    $query = "SELECT * FROM movies WHERE `categoryId`='$id'";
    
    $result = $db->query($query);

    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($data);
});

//Get a random movie from a specific category
$app->get('/api/categories/{id}/movies/random', function ($request, $response, $args) {
    require_once('../dbconnect.php');

    $id = $request->getAttribute('id');

    $query = "SELECT * FROM movies WHERE `categoryId`='$id'";
    
    $result = $db->query($query);

    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $rand = rand(0, count($data));

    header('Content-Type: application/json');
    echo json_encode($data[$rand]);
});
?>
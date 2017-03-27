<?php
//Get genres, $app->get is configured in routing.php
$app->get('/genre', function () {
    require_once('dbconnect.php');

    $query = 'SELECT id, name FROM genres LIMIT 50';

    $result = $db->query($query);

    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($data);

});

//get all movies from one genre
$app->get('/genre/{id}', function ($request, $response, $args) {
    require_once('dbconnect.php');

    $id = $request->getAttribute('id');

    $movielookup = "SELECT movieId FROM genre_lookup WHERE genreId='$id'";

    $movieIdresult = $db->query($movielookup);
    
    while($movId = $movieIdresult->fetch_assoc()) {
        $movieId = $movId['movieId'];
        $movieList = "SELECT * FROM movies WHERE id='$movieId' LIMIT 200";
        $movieResult = $db->query($movieList);
        while($movie = $movieResult->fetch_assoc()) {
            $data[] = $movie;
        }
    }

    header('Content-Type: application/json');
    echo json_encode($data);

});

?>
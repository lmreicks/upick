<?php
//get all movie titles from this genre
$app->get('/api/genres/{id}', function ($request, $response, $args) {
    require_once('../dbconnect.php');

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

//Get random movie from genre
$app->get('/api/genres/{id}/random', function ($request, $response, $args) {
    require_once('../dbconnect.php');

    $id = $request->getAttribute('id');

    $query = "SELECT * FROM genre_lookup WHERE `genreId`='$id'";

    $result = $db->query($query);

    while($row = $result->fetch_assoc()) {
        $data[] = $row['movieId'];
    }

    $rand = rand(0, count($data));
    
    $randmovid = $data[$rand];

    $moviequery = "SELECT * FROM movies WHERE `id`='$randmovid'";
    $movresult = $db->query($moviequery);

    while($movie = $movresult->fetch_assoc()) {
        $movdata[] = $movie;
    }

    header('Content-Type: application/json');
    echo json_encode($movdata[0]);
});

$app->get('/api/movies', function ($request, $response, $args) {
    require_once('../dbconnect.php');

    $query = "SELECT id FROM movies";
    $result = $db->query($query);

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $moviequery = "SELECT * FROM `movies` WHERE `id` = " . $rand;

    $movieresult = $db->query($moviequery);

    while ($movie = $movieresult->fetch_assoc()) {
        $moviedata[] = $movie;
    }

    echo json_encode($moviedata);
});

//get top movies
$app->get('/api/top', function ($request, $response, $args) {
    require_once('../dbconnect.php');

    $query = "SELECT * FROM `movies` ORDER BY `movies`.`popularity` DESC LIMIT 10";

    $result = $db->query($query);

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
})

?>
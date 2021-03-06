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

$app->get('/genre/{id}/random', function ($request, $response, $args) {
    require_once('dbconnect.php');

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

    //echo var_dump($movdata[0]);
    header('Content-Type: application/json');
    echo json_encode($movdata[0]);

});

//get all movie titles from this genre
$app->get('/genre/{id}/movies/{page}', function ($request, $response, $args) {
    require_once('dbconnect.php');

    $id = $request->getAttribute('id');
    $page = $request->getAttribute('page');
    $queryString = $request->getQueryParams();

    $startYear = $queryString['startYear'];
    $endYear = $queryString['endYear'];
    $ratingStart = $queryString['ratingStart'];
    $ratingEnd = $queryString['ratingEnd'];

    if (!isset($startYear)) {
        $startYear = 1890;
    }
    if (!isset($endYear)) {
        $endYear = 2017;
    }

    if (!isset($ratingStart)) {
        $ratingStart = 0;
    }

    if (!isset($ratingEnd)) {
        $ratingEnd = 10;
    }

    $page  = ($page - 1) * 20;
    $movielookup = "SELECT movieId FROM genre_lookup WHERE genreId='$id'";

    header('Content-Type: application/json');

    $movieIdresult = $db->query($movielookup);
    while($movId = $movieIdresult->fetch_assoc()) {
        $movieIds[] = $movId['movieId'];
    }

    $movieList = "SELECT * FROM movies WHERE id IN (" . implode(",", $movieIds) . ") && release_date > '$startYear' && release_date < '$endYear' && vote_average > '$ratingStart' && vote_average < '$ratingEnd'";

    $movieResult = $db->query($movieList);
    while($movie = $movieResult->fetch_assoc()) {
        $data[] = $movie;
    }

    if ($data !== null && count($data) > 0 ) {
        echo json_encode(array_slice($data, $page, 20));
    } else {
        echo json_encode($error);
    }
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
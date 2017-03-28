<?php
//get all movie titles from this genre
$app->get('/genres/{id}/{page}', function ($request, $response, $args) {
    require_once('dbconnect.php');

    $id = $request->getAttribute('id');
    $page = $request->getAttribute('page');

    $movielookup = "SELECT movieId FROM genre_lookup WHERE genreId='$id'";

    $movieIdresult = $db->query($movielookup);

    while($movId = $movieIdresult->fetch_assoc()) {
        $movieId = $movId['movieId'];
        $movieList = "SELECT * FROM movies WHERE id='$movieId'";
        $movieResult = $db->query($movieList);
        while($movie = $movieResult->fetch_assoc()) {
            $data[] = $movie;
        }
    }
    header('Content-Type: application/json');
    $movies = array_slice($data, 20 * ($page - 1), 20);
    echo json_encode($movies);
});

//Get random movie from genre
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
        $movdata = $movie;
    }

    //echo var_dump($movdata[0]);
    header('Content-Type: application/json');
    echo json_encode($movdata);

});

//get top movies
$app->get('/top', function ($request, $response, $args) {
    require_once('dbconnect.php');

    $query = "SELECT * FROM `movies` ORDER BY `movies`.`popularity` DESC LIMIT 10";

    $result = $db->query($query);

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
});

$app->get('/movies', function ($request, $response, $args) {
    require_once('dbconnect.php');

    $query = "SELECT * FROM movies";
    $result = $db->query($query);

    while ($row = $result->fetch_assoc()) {
        $data[] = $row['id'];
    }

    $rand = rand(0, count($data));

    $moviequery = "SELECT * FROM `movies` WHERE `id` = " . $data[$rand];

    $movieresult = $db->query($moviequery);

    echo json_encode($movieresult->fetch_assoc());
});

function curl($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    $data = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);
    if ($data) {
        return $data;
    }
    else {
        return $err;
    }
}

// Get more info about a movie, if we dont have it in the db, query the movie api
$app->get('/movies/{id}/more', function ($request, $response, $args) {
    require_once('dbconnect.php');
    $id = $request->getAttribute('id');
    $query = "SELECT * FROM movies WHERE id =". $id;
    $movie = $db->query($query)->fetch_assoc();
    $releaseDate[] = explode('-', $movie['release_date']);
    if($movie['hasMoreInfo'] == 1) {
        echo json_encode($movie);
    } else {
        // We haven't fetched additional data yet, lets do it now
        $netflixApi = "http://netflixroulette.net/api/api.php?title=" . $movie['title'] . "&year=" . $releaseDate[0];
        $getTrailerUrl = "https://api.themoviedb.org/3/movie/" . $id . "/videos?api_key=733865115819c8da6e8cc41c46684ed8&language=en-US";
        $netflixresponse = curl($netflixApi);
        $trailerResponse = curl($getTrailerUrl);

        $trailerResponseArray = json_decode($trailerResponse, true);
        $netflixresponseArray = json_decode($netflixresponse, true);
        $trailerKey =  "'" . $trailerResponseArray['results'][0]['key'] . "'";
        $netflixid = "NULL";
        $cast = "NULL";
        $director = "NULL";
        $actors = "NULL";
        if ($netflixresponseArray['errorcode'] == 404) {
            // Movie is not on netflix
        } else {
            foreach ($netflixresponseArray as $movie) {
                $netflixid = "'" . $movie['show_id'] . "'";
                $cast = "'" . $movie['cast'] . "'";
                $director = "'" . $movie['director'] . "'";
            }
        }
        $query = "UPDATE movies SET `hasMoreInfo`= 1, `netflix_id` = " . $netflixid . ", `actors` = " . $actors . ", `trailer_url` = " . $trailerKey . ", `director` = " . $director . " WHERE id=" . $id;
        $db->query($query);
        $movie = $db->query("SELECT * FROM movies WHERE id =". $id)->fetch_assoc();
        echo json_encode($movie);
    }
});


?>
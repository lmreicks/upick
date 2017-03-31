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
    //if we don't have an imdb key, get it.'
    if ($movie['imdb_id'] == NULL) {
        $getIMDB = "https://api.themoviedb.org/3/movie/" . $id . "?api_key=733865115819c8da6e8cc41c46684ed8&language=en-US";
        $imdbresponse = curl($getIMDB);
        $imdbresponseArray = json_decode($imdbresponse, true);
        $imdbId = $imdbresponseArray['imdb_id'];
        $imdbkey = "'" . $imdbresponseArray['imdb_id'] . "'";
        $query = "UPDATE movies SET `imdb_id`= " . $imdbkey;
        $db->query($query);
    }

    if($movie['hasMoreInfo'] == 1) {
        echo json_encode($movie);
    } else {
        // We haven't fetched additional data yet, lets do it now
        $netflixApi = "http://netflixroulette.net/api/api.php?title=" . $movie['title'] . "&year=" . $releaseDate[0][0];
        $getTrailerUrl = "https://api.themoviedb.org/3/movie/" . $id . "/videos?api_key=733865115819c8da6e8cc41c46684ed8&language=en-US";
        $openMovieRequest = "http://www.omdbapi.com/?i=" . $imdbId;
        $recommendedRequest = "https://api.themoviedb.org/3/movie/" . $id . "/recommendations?api_key=733865115819c8da6e8cc41c46684ed8&language=en-US";

        $netflixresponse = curl($netflixApi);
        $trailerResponse = curl($getTrailerUrl);
        $openMovieResponse = curl($openMovieRequest);
        $recommendedResponse = curl($recommendedRequest);

        $trailerResponseArray = json_decode($trailerResponse, true);
        $netflixresponseArray = json_decode($netflixresponse, true);
        $openMovieResponseArray = json_decode($openMovieResponse, true);
        $recommendedResponseArray = json_decode($recommendedResponse, true);

        echo json_encode($openMovieResponseArray);

        $trailerKey =  "'" . $trailerResponseArray['results'][0]['key'] . "'";

        $Netid = "NULL";
        $cast = "NULL";
        $director = "NULL";
        $actors = "NULL";
        $recommended = "NULL";

        $parental_rating = "'" . $openMovieResponseArray['Rated'] . "'";
        $ratings = $openMovieResponseArray['Ratings']['Source'];
        $rottentomatoes = "'" . $ratings['Rotten Tomatoes']['Value'] . "'";
        $imdbrating = "'" . $openMovieResponseArray['imdbRating'] . "'";
        $plot = "'" . $openMovieResponseArray['Plot'] . "'";

        //come back to this, should we just return the title, id, poster path?
        //$recommended = "'" . $recommendedResponseArray['']

        if ($netflixresponseArray['errorcode'] == 404) {
            // Movie is not on netflix
            // get cast/director from imdb
            $cast = "'" . $openMovieResponseArray['Actors'] . "'";
            $director = "'" . $openMovieResponseArray['Director'] . "'";
        } else {
            $Netid = "'" . $netflixresponseArray["show_id"] . "'";
            $cast = "'" . $netflixresponseArray['show_cast'] . "'";
            $director = "'" . $netflixresponseArray['director'] . "'";
        }
        $query = "UPDATE movies SET `hasMoreInfo`= 1, `netflix_id` = " . $Netid . ", `actors` = " . $cast . ", `trailer_url` = " . $trailerKey . ", `director` = " . $director . ", `imdb_rating` = " . $imdbrating . ", `parental_rating` = " . $parental_rating . ", `rotten_tomatoes` = " . $rottentomatoes . ", `recommended` = " . $recommended . " WHERE id=" . $id;
        $db->query($query);
        $movie = $db->query("SELECT * FROM movies WHERE id =". $id)->fetch_assoc();
        echo json_encode($movie);
    }
});


?>
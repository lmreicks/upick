<?php
//get top movies
$app->get('/movies/top', function ($request, $response, $args) {
    require_once('dbconnect.php');

    $query = "SELECT * FROM `movies` ORDER BY `movies`.`popularity` DESC LIMIT 10";

    $result = $db->query($query);

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
});

$app->get('/movies/random', function ($request, $response, $args) {
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

$app->get('/movies/netflix/random', function ($request, $response, $args) {
    require_once('dbconnect.php');

    $query = "SELECT * FROM movies WHERE `netflix_id` != 'NULL'";
    $result = $db->query($query);

    while ($row = $result->fetch_assoc()) {
        $data[] = $row['id'];
    }
    
    $rand = rand(0, count($data));

    $moviequery = "SELECT * FROM `movies` WHERE `id` = " . $data[$rand];

    $movieresult = $db->query($moviequery);
    if ($movieresult) {
        echo json_encode($movieresult->fetch_assoc());
    } else {
        echo 'null';
    }
});

$app->get('/movies/search', function ($request, $response, $args) {
    require_once('dbconnect.php');
    $queryString = $request->getQueryParams();

    $query = "SELECT * FROM movies WHERE `title` LIKE '" . rawurldecode($queryString['param']) . "'";
    
    $result = $db->query($query);

    while ($row = $result->fetch_assoc()) {
        $movies[] = $row;
    }
    echo json_encode($movies);    
});

$app->get('/movies/netflix', function ($request, $response, $args) {
    require_once('dbconnect.php');

    $query = "SELECT * FROM movies WHERE `netflix_id` != 'NULL'";
    $result = $db->query($query);

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
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
    if ($movie['imdb_id'] == 'NULL' || $movie['imdb_id'] == NULL) {
        $getIMDB = "https://api.themoviedb.org/3/movie/" . $id . "?api_key=733865115819c8da6e8cc41c46684ed8&language=en-US";
        $imdbresponse = curl($getIMDB);
        $imdbresponseArray = json_decode($imdbresponse, true);
        $imdbId = $imdbresponseArray['imdb_id'];
        $imdbkey = "'" . $imdbId . "'";
        $query = "UPDATE movies SET `imdb_id`=" . $imdbkey . " WHERE `id`=" . $id;
        $db->query($query);
    } else {
        $imdbId = $movie['imdb_id'];
    }

    if($movie['hasMoreInfo'] == 1) {
        $recommendedIds = explode(',', $movie['recommended']);
        shuffle($recommendedIds);
        $recommendedString = implode(',', $recommendedIds);
        $query = "SELECT * FROM movies WHERE id in (". $recommendedString.")";
        $movieResult = $db->query($query);

        while($movieRes = $movieResult->fetch_assoc()) {
            $movies[] = $movieRes;
        }
        $movie['recommended'] = $movies;
        echo json_encode($movie);
    } else {
        // We haven't fetched additional data yet, lets do it now
        $netflixApi = "http://netflixroulette.net/api/api.php?title=" . rawurlencode($movie['title']) . "&year=" . $releaseDate[0][0];
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
        //echo $openMovieRequest . "<br>";
        //var_dump($recommendedResponseArray['results']);
        //echo "<br>";
        //echo "<br>";
        $results = array();
        foreach ($recommendedResponseArray['results'] as $result) {
            array_push($results, $result['id']);
        }
        $results = "'" . implode(',', $results) . "'";
        $trailerKey =  "'" . $trailerResponseArray['results'][0]['key'] . "'";
        //echo $results;
        //echo json_encode($openMovieResponseArray);

        $Netid = "NULL";
        $cast = "NULL";
        $director = "NULL";
        $recommended = "NULL";

        if ($openMovieResponseArray['Response'] == true) {
            $parental_rating = "'" . $openMovieResponseArray['Rated'] . "'";
            //echo $parental_rating . "<br>";
            $rottentomatoes = "'" . $openMovieResponseArray['Ratings'][1]['Value'] . "'";
            //echo $rottentomatoes . "<br>";
            $imdbrating = "'" . $openMovieResponseArray['imdbRating'] . "'";
            //echo $imdbrating . "<br>";
            $plot = "'" . addslashes($openMovieResponseArray['Plot']) . "'";
            //echo $plot . "<br>";
            $cast = "'" . addslashes($openMovieResponseArray['Actors']) . "'";
            //echo $cast . "<br>";
            $director = "'" . addslashes($openMovieResponseArray['Director']) . "'";
            //echo $director . "<br>";
        }

        //come back to this, should we just return the title, id, poster path?
        //$recommended = "'" . $recommendedResponseArray['']

        if ($netflixresponseArray['errorcode'] != 404) {
            $Netid = "'" . $netflixresponseArray["show_id"] . "'";
        }

        $query = "UPDATE movies SET `hasMoreInfo`= 1, `netflix_id` = " . $Netid . ", `actors` = " . $cast . ", `trailer_url` = " . $trailerKey . ", `director` = " . $director . ", `imdb_rating` = " . $imdbrating . ", `parental_rating` = " . $parental_rating . ", `rotten_tomatoes` = " . $rottentomatoes . ", `recommended` = " . $results . ", `overview` = " . $plot . " WHERE id=" . $id;
        //echo $query;
        $db->query($query);

        $movie = $db->query("SELECT * FROM movies WHERE id =". $id)->fetch_assoc();
        $recommendedIds = explode(',', $movie['recommended']);
        shuffle($recommendedIds);
        $recommendedString = implode(',', $recommendedIds);
        $query = "SELECT * FROM movies WHERE id in (". $recommendedString.")";
        $movieResult = $db->query($query);
        while($movieRes = $movieResult->fetch_assoc()) {
            $movies[] = $movieRes;
        }
        $movie['recommended'] = $movies;
        echo json_encode($movie);
    }
});


?>
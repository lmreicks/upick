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

//get now playing
$app->get('/movies/nowplaying', function ($request, $response, $args) {
    require_once('dbconnect.php');

//query the movie db for movies now playing
    $requestUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=733865115819c8da6e8cc41c46684ed8&language=en-US";
    $response = curl($requestUrl);
    $responseArray = json_decode($response, true);

    $movieIds = Array();

    foreach ($responseArray['results'] as $movie) {
        array_push($movieIds, $movie['id']);
    }

    $idString = implode(',', $movieIds);

    $query = "SELECT * FROM `movies` WHERE id in (" . $idString . ")";
    $result = $db->query($query);

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
});

$app->get('/movies/random', function ($request, $response, $args) {
    require_once('dbconnect.php');

    $query = "SELECT id FROM movies";
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

    $query = "SELECT * FROM movies WHERE `title` LIKE '%" . rawurldecode($queryString['query']) . "%' ORDER BY `movies`.`rotten_tomatoes` DESC LIMIT 10";

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

    $movie = $db->query($query);
    if ($movie->num_rows <= 0) {
        // query tmdb, add new movie
        echo "no results";
    }
    
    else {
    $movie = $movie->fetch_assoc();

    $queryGenre = "SELECT * FROM genre_lookup WHERE `movieId`= " . $id;
    $genreList = $db->query($queryGenre);

    while($row = $genreList->fetch_assoc()) {
        $genreIdArray[] = $row['genreId'];
    }

    $queryGenreTitle = "SELECT * FROM genres WHERE id in (" . implode(",", $genreIdArray) . ")";

    $genreTitleList = $db->query($queryGenreTitle);

    if(! $genreTitleList) {
        die("could not enter data: " . $db->error);
    }
    else {

        while($row = $genreTitleList->fetch_assoc()) {
            $genres[] = $row;
        }
    }

    if ($movie['gomovies_id'] == 'NULL' || $movie['gomovies_id'] == NULL || $movie['gomovies_id'] == "") {
        $badchars = array(':', '&', '!', '?', '.', ',');
        $title = substr(preg_replace("/ /", "+", $movie['title']), 0, 50);
        $title = str_replace($badchars, "", $title);
        $title = strtolower($title);

        $getMovie = "https://gomovies.to/movie/search/" . $title;
        $fileoutput = @file_get_contents($getMovie);

        if ($fileoutput == TRUE) {
            $doc = new DOMDocument();
            libxml_use_internal_errors(true);
            $doc->loadHTML($fileoutput);
            libxml_use_internal_errors(false);
            $items = $doc->getElementsByTagName("div");
            $gomovieid = "";
            foreach ($items as $item) {
                if ($item->getAttribute('data-movie-id') !== "") {
                    $gomovieid = "'" . $item->getAttribute('data-movie-id') . "'";
                    break;
                }
            }
            $query = "UPDATE movies SET `gomovies_id`=" . $gomovieid . " WHERE `id`=" . $id;
            $db->query($query);
        }
    }

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
    //if have more info, just get recommended and genres, echo result
    if($movie['hasMoreInfo'] == 1) {
        $recommendedIds = explode(',', $movie['recommended']);
        shuffle($recommendedIds);
        $recommendedString = implode(',', $recommendedIds);
        $query = "SELECT * FROM movies WHERE id in (". $recommendedString.")";
        $movieResult = $db->query($query);
//if no result skip

        if ($movieResult) {
            while($movieRes = $movieResult->fetch_assoc()) {
                $movies[] = $movieRes;
            }
        }
        $movie['recommended'] = $movies;
        $movie['genres'] = $genres;
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
        if ($movieResult->num_rows > 0 ) {
            while($movieRes = $movieResult->fetch_assoc()) {
                $movies[] = $movieRes;
            }
        }
        else {
            $movies[] = null;
        }
        $movie['recommended'] = $movies;
        $movie['genres'] = $genres;

        echo json_encode($movie);
    }
    }
});

$app->get('/test/{id}', function ($request, $response, $args) {
    require_once('dbconnect.php');

    $id = $request->getAttribute('id');
    $query = "SELECT * FROM movies WHERE id =". $id;

    $movie = $db->query($query)->fetch_assoc();

    if ($movie['gomovies_id'] == 'NULL') {
        $getMovie = "https://gomovies.to/movie/search/" . preg_replace("/ /", "+", $movie['title']);
        $fileoutput = file_get_contents($getMovie);
        $doc = new DOMDocument();
        $doc->loadHTML($fileoutput);
        $items = $doc->getElementsByTagName("div");
        foreach ($items as $item) {
            $movieid = $item->getAttribute('data-movie-id');
        }
    }
});

?>
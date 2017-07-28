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

$app->post('/movies/pick-three', function ($request, $response, $args) {
    require_once('dbconnect.php');
    $data = json_decode($request->getBody(), true);

    $recommended = Array();

    $moviesArray = array();
    
    $keywordList = array();
    $releaseDates = array();
    foreach($data as $movie) {
        $releaseDates[] = substr($movie['release_date'], 0, 4);
        $tempMovie = json_decode(json_encode(more($movie['id'])), true);
        $keywords = explode(', ', $tempMovie['keywords']);
        $keywordList = array_merge($keywordList, $keywords);
        $movieIds = array();

        $queryGenre = "SELECT movieId FROM genre_lookup WHERE `genreId` IN (SELECT `genreId` FROM genre_lookup WHERE `movieId`=" . $movie['id'] . ")";
        echo $queryGenre;
        for ($i = 0; $i < count($keywords); $i++) {
            $query = "SELECT * FROM movies WHERE `overview` LIKE '%" . $keywords[$i] . "%'";
            $result = $db->query($query);

            while ($row = $result->fetch_assoc()) {
                $ids[] = $row['id'];
            }
            $movieIds = array_merge($movieIds, $ids);
        }
    }

    // foreach ($keywordList as $word) {
    //     echo $word;
    //     echo "<br/>";
    // }


$result = array_filter( array_count_values($movieIds), function( $el) {
    return $el > 1; 
});

if (count($result) > 0 ) {
    while($element = current($result)) {
        $id =  key($result);
        asort($releaseDates);
        $query = "SELECT * FROM movies WHERE id =". $id . "&& `release_date` > " . ($releaseDates[0] - 5) . " && release_date < " . ($releaseDates[2] + 5);

        $movie = $db->query($query);
        if ($movie->num_rows <= 0) {
            next($result);
        } else {
            $movie = $movie->fetch_assoc();
            array_push($moviesArray, $movie);
        }
        next($result);
    }
}

echo json_encode($moviesArray);

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

$app->get('/movies/{id}/trailer', function ($request, $response, $args) {
    require_once('dbconnect.php');
    $id = $request->getAttribute('id');
    
    $getTrailerUrl = "https://api.themoviedb.org/3/movie/" . $id . "/videos?api_key=733865115819c8da6e8cc41c46684ed8&language=en-US";
    $trailerResponse = curl($getTrailerUrl);
    $trailerResponseArray = json_decode($trailerResponse, true);
    $trailerKey =  "'" . $trailerResponseArray['results'][0]['key'] . "'";

    $query = "UPDATE movies SET `trailer_url` = " . $trailerKey . " WHERE id=" . $id;
    
    $db->query($query);

    echo json_encode($trailerKey);
});

// Get more info about a movie, if we dont have it in the db, query the movie api
$app->get('/movies/{id}/more', function($request, $response, $args) {
    $id = $request->getAttribute('id');
    echo json_encode(more($id));
});

function more($id) {
    require('dbconnect.php');
    $blacklist = [
    'is',
    'as',
    'the',
    'he',
    'she',
    'a',
    'and',
    'it',
    'by',
    'that',
    'this',
    'which',
    'what',
    'was',
    'now',
    'are',
    'in',
    'her',
    'him',
    'his',
    'hers',
    'yet',
    'so',
    'for',
    'after',
    'although',
    'if',
    'because',
    'cause',
    'once',
    'even',
    'where',
    'while',
    'until',
    'not',
    'only',
    'whether',
    'about',
    'above',
    'across',
    'after',
    'against',
    'along',
    'amidst',
    'among',
    'around',
    'at',
    'before',
    'behind',
    'below',
    'beneath',
    'beside',
    'besides',
    'between',
    'beyond',
    'except',
    'for',
    'from',
    'into',
    'on',
    'off',
    'over',
    'past',
    'through',
    'with',
    'without',
    'an',
    'to',
    'how',
    'out',
    'but',
    'also',
    'of',
    'their',
    'themselves',
    'them',
    'they',
    'really',
    'get',
    'gets',
    'daughter',
    'son',
    'bring',
    'brings',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'find',
    'finds',
    'true',
    'false'
];
    $query = "SELECT * FROM movies WHERE id=". $id;

    $movie = $db->query($query);
    if ($movie->num_rows <= 0) {
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

        $overview  = $movie['overview'];
        // replaces all punctuation
        $overview = preg_replace("#[[:punct:]]#", "", $overview);
        $overview = preg_replace('/[0-9]+/', '', $overview);
        $overview = explode(' ', $overview);

        $keywords = array();

        if ($movie['keywords'] == null || $movie['keywords'] == 'NULL') {
            foreach ($overview as $word) {
                if (!in_array($word, $blacklist) && !ctype_upper($word[0])) {
                    array_push($keywords, $word);
                }
            }
            $keywords = "'" . implode(', ', $keywords) . "'";
            $movie['keywords'] = $keywords;
            $query = "UPDATE movies SET `keywords`=" . $keywords . " WHERE `id`=" . $id;
            $db->query($query);
        }

        $movie['recommended'] = $movies;
        $movie['genres'] = $genres;

        return $movie;
    } else {
        // We haven't fetched additional data yet, lets do it now
        $openMovieRequest = "http://www.omdbapi.com/?i=" . $imdbId . "&apikey=7df26ca8";
        $recommendedRequest = "https://api.themoviedb.org/3/movie/" . $id . "/recommendations?api_key=733865115819c8da6e8cc41c46684ed8&language=en-US";

        $openMovieResponse = curl($openMovieRequest);
        $recommendedResponse = curl($recommendedRequest);

        $openMovieResponseArray = json_decode($openMovieResponse, true);
        $recommendedResponseArray = json_decode($recommendedResponse, true);


        $results = array();
        foreach ($recommendedResponseArray['results'] as $result) {
            array_push($results, $result['id']);
        }
        $results = "'" . implode(',', $results) . "'";

        $cast = "NULL";
        $director = "NULL";
        $recommended = "NULL";

        if ($openMovieResponseArray['Response'] == true) {
            $parental_rating = "'" . $openMovieResponseArray['Rated'] . "'";
            $rottentomatoes = "'" . $openMovieResponseArray['Ratings'][1]['Value'] . "'";
            $imdbrating = "'" . $openMovieResponseArray['imdbRating'] . "'";
            $plot = "'" . addslashes($openMovieResponseArray['Plot']) . "'";
            $cast = "'" . addslashes($openMovieResponseArray['Actors']) . "'";
            $director = "'" . addslashes($openMovieResponseArray['Director']) . "'";
        }

        $overview = preg_replace("#[[:punct:]]#", "", $overview);
        $overview = preg_replace('/[0-9]+/', '', $overview);
        $overview = str_replace( ',', '', $overview);
        $overview = explode(' ', $overview);

        $keywords = array();
        foreach ($overview as $word) {
            if (!in_array($word, $blacklist) && !ctype_upper($word[0])) {
                array_push($keywords, $word);
            }
        }

        $keywords = "'" . implode(', ', $keywords) . "'";

        $query = "UPDATE movies SET `hasMoreInfo`= 1, `actors` = " . $cast . ", `director` = " . $director . ", `imdb_rating` = " . $imdbrating . ", `parental_rating` = " . $parental_rating . ", `rotten_tomatoes` = " . $rottentomatoes . ", `recommended` = " . $results . ", `overview` = " . $plot . ", `keywords` = " . $keywords . " WHERE id=" . $id;
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

        $movie['keywords'] = $keywords;
        $movie['recommended'] = $movies;
        $movie['genres'] = $genres;

        return $movie;
    }
}
}


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

?>
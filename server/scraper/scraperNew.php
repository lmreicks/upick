<?php
//request example: https://api.themoviedb.org/3/movie/550?api_key=733865115819c8da6e8cc41c46684ed8

$apiKey = "733865115819c8da6e8cc41c46684ed8";
$genreRequest = "https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=733865115819c8da6e8cc41c46684ed8";
$movieRequest = "https://api.themoviedb.org/3/genre/{genreId}/movies?&language=en-US&api_key=733865115819c8da6e8cc41c46684ed8";

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

function getGenres() {
    $genreRequest = "https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=733865115819c8da6e8cc41c46684ed8" . $apiKey;
    require_once('../dbconnect.php');

    $response = curl($genreRequest);
    $response = json_decode($response);
    
    $genreList = array();

    foreach ($response as $genres) {
        foreach ($genres as $genre) {
            $genreId = $genre -> {'id'};
            $genreTitle = $genre -> {'name'};
            array_push($genreList, "('" . $genreId . "', '" . $genreTitle . "')");
        }
    }

    //$query = "INSERT INTO genres (id, name) VALUES " . implode(", " , $genreList) . ";";
        //$result = $db->query($query);
        //if(! $result) {
        //    die("could not enter data: " . $db->error);
        //}

        //echo "Data entered correctly";
        //$db->close();
}

function getMoviesByGenre() { 
    require_once('../dbconnect.php');

    $movieRequest = "https://api.themoviedb.org/3/discover/movie?api_key=733865115819c8da6e8cc41c46684ed8&language=en-US&include_adult=true&page=";
    //15599 pages

    for ($i = 1; $i < 40; $i++) {
        $response = curl($movieRequest . $i);
        $responseArray = json_decode($response, true);

        $movieArray = Array();
        $genreIdArray = Array();
        $lookupArray = Array();

        if (sizeof($responseArray) != 0) {
            foreach ($responseArray as $page) {
                if (is_array($page)) {
                    foreach ($page as $movie) {
                        if (is_array($movie)) {
                            $adult = $movie['adult'];
                            $title = $movie['title'];
                            $title = addslashes($title);
                            $movieId = $movie['id'];
                            $language = $movie['original_language'];
                            $overview = $movie['overview'];
                            $overview = addslashes($overview);
                            $releasedate = $movie['release_date'];
                            $popularity = $movie['popularity'];
                            $voteAverage = $movie['vote_average'];
                            $voteCount = $movie['vote_count'];
                            $posterPath = $movie['poster_path'];
                            // put each movie into an array in sql form
                            array_push($movieArray, "('" . $adult . "', '" . $movieId . "', '" . $language . "', '" . $title . "', '" . $overview . "', '" . $releasedate . "', '" . $popularity . "', '" . $voteAverage . "', '" . $voteCount . "', '" . $posterPath . "')");
                            echo var_dump($movieArray);

                            // loop through genres and put them into aray with movie id
                            //use this genre ids array to make a genre lookup table with movie ids
                            $genreIdArray = $movie['genre_ids'];

                            for ($j = 0; $j < sizeof($genreIdArray); $j++) {
                                array_push($lookupArray, "('" . $genreIdArray[$j] . "', '" . $movieId . "')");
                            }
                        }
                    }
                }
            }

            $query = "INSERT INTO movies (adult, id, original_language, title, overview, release_date, popularity, vote_average, vote_count, poster_path) VALUES " . implode(", " , $movieArray) . ";";

            //echo var_dump($movieArray);
            $result = $db->query($query);
                if(! $result) {
                    die("could not enter data: " . $db->error);
                    continue;
                }

                echo "Data entered correctly";
        

            $lookupQuery = "INSERT INTO genre_lookup (genreId, movieId) VALUES " . implode(", ", $lookupArray) . ";";
            $lookupresult = $db->query($lookupQuery);
                if(! $lookupresult) {
                    die("could not enter data: " . $db->error);
                    continue;
                }

                echo "Data entered correctly";


        }
    }
    $db->close();
}

function fillgenrelookup() {
    require_once('../dbconnect.php');

    $movieQuery = "SELECT id FROM movies";
    $movResult = $db->query($movieQuery);

    $genreQuery = "SELECT id FROM genres";

    while($row = $movResult->fetch_assoc()) {
        $movieId = $row['id'];
    }
}
//getMoviesByGenre();
//getGenres();

?>
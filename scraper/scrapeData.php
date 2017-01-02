<?php

function curl($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}

function scrape_between($data, $start, $end){
    $data = stristr($data, $start);
    $data = substr($data, strlen($start));
    $stop = stripos($data, $end);
    $data = substr($data, 0, $stop);
    return $data;
}

//Returns a view count string as an int. ie: 1.9K -> 1900
function viewsStringToInt($view) {
    //has a K at the end such as 1K views, needs to be 1000
    if(substr($view, -1) == 'k'){
        //if its the format of 1.9K, remove the K,
        if(substr($view, -3,1) == '.') {
            $view = str_replace('.', '', $view);
            $view = substr($view, 0, -1);
            $view = intval($view . '00');
        } else {
            $view = substr($view, 0, -1);
            $view = intval($view . '000');
        }
    }
    if(substr($view, -1) == 'M'){
        if(substr($view, -3,1) == '.') {
            $view = str_replace('.', '', $view);
            $view = substr($view, 0, -1);
            $view = intval($view . '00000');
        } else {
            $view = substr($view, 0, -1);
            $view = intval($view . '000000');
        }
    }
    return $view;
}


//Gets a number of categories from the film section of ranker
function getCategories($count) {
    $db = new mysqli('localhost', 'root', 'root', 'scotchbox');

    $url = 'http://www.ranker.com/tag/facetedListSearch.htm?tagIds=5&limit='. $count .'&pagetype=CATEGORYPAGE';
    $result_page = curl($url);
    $titles_containers = explode('<h3 class="block robotoC width100 center">', $result_page);
    $views_containers = explode('<span class="relative box width100 center uppercase">', $result_page);
    $URl_Containers = explode('<a role="link" class="img center flex"', $result_page);

    foreach($titles_containers as $titles_container) {
        if($titles_container != "") {
            $category_titles[] = addslashes(scrape_between($titles_container, '<span class="black">', '</span>'));
        }
    }

    foreach($views_containers as $views_container) {
        if($views_container != "") {
            $view = scrape_between($views_container, '<span class="relative robotoC rnkrBlue"> ', '</span>');
            $view = substr(rtrim($view), 0, -6);

            $views[] = viewsStringToInt($view);
        }
    }

    foreach($URl_Containers as $URl_Container) {
        if($URl_Container != "") {
            $urls[] = scrape_between($URl_Container, 'href=', '>');
        }
    }

    for($i=1; $i<count($category_titles); $i++) {
        $categories[] = '("' . $category_titles[$i] . '",'.$views[$i].',' . $urls[$i] . ')';
    }

    $query = "INSERT INTO categories (title, views, url) VALUES " . implode(',',$categories) . ";";
    $result = $db->query($query);
    if(! $result) {
        die("could not enter data: " . $db->error);
    }

    echo "Data entered correctly";
    $db->close();
}

function getMoviesByCategory($url) {
    $page = curl($url);
    $listid = scrape_between($page, 'mainList_', '"');
    //$page = scrape_between($page, '<section id="mainListCnt" class=" relative">','</section>');
    $movie_containers = explode('role="listitem"', $page);
    array_shift($movie_containers);
    echo count($movie_containers);
    foreach ($movie_containers as $movie_container) {
        $title = addslashes(trim(scrape_between($movie_container, 'itemprop="name">', '</span>')));
        $movieid = scrape_between($movie_container, '<div id="n_', '_hb"');
        $url1 = "http://api.ranker-dev.com/lists/" . $listid . "/items/" . $movieid . "?include=wikiText&propertyFetchType=ALL";
        $movie = get_details($url1);
        $movies[] = $movie;

    }
    echo $movies[1]->{'title'}."<br>";
    echo $movies[1]->{'description'}."<br>";
    echo $movies[1]->{'trailer_url'}."<br>";
    echo $movies[1]->{'parental_rating'}."<br>";
    echo $movies[1]->{'genre'}."<br>";
    echo $movies[1]->{'releasedate'}."<br>";
    echo $movies[1]->{'director'}."<br>";
    echo $movies[1]->{'actors'}."<br>";
    return $movies;
}

//Gets extra details about movie in list
function get_details($url) {
    $json = curl($url);
    $data = json_decode($json);
    $description = $data->{'node'}->{'nodeWiki'}->{'wikiText'};
    $title = $data->{'node'}->{'name'};
    $trailer_url = 'empty';
    if (isset($data->{'node'}->{'video'}->{'embedUrl'})) {
      $trailer_url = $data->{'node'}->{'video'}->{'embedUrl'};
    }
    $nodeProperties = $data->{'node'}->{'nodeProperties'};
    for($i=0; $i<count($nodeProperties); $i++) {
      if ($nodeProperties[$i]->{'propertyId'} == 681) {//propertyName = rating
        $parental_rating = $nodeProperties[$i]->{'propertyValue'};
      }
      if ($nodeProperties[$i]->{'propertyId'} == 691) {//propertyName = genre
        $genre = $nodeProperties[$i]->{'propertyValue'};
      }
      if ($nodeProperties[$i]->{'propertyId'} == 673) {//propertyName = initial_release_date
        $releasedate = $nodeProperties[$i]->{'propertyValue'};
      }
      if ($nodeProperties[$i]->{'propertyId'} == 674) {//propertyName = directed_by
        $director = $nodeProperties[$i]->{'propertyValue'};
      }
      if ($nodeProperties[$i]->{'propertyId'} == 208164) {//propertyName = actors
        $actors = $nodeProperties[$i]->{'propertyValue'};
      }
    }
    return (object) array('title' => $title, 'description' => $description, 'trailer_url' => $trailer_url,
    'parental_rating' => $parental_rating, 'genre' => $genre, 'releasedate' => $releasedate,
    'director' => $director, 'actors' => $actors);
  }

function populateMoviesTable() {
    $db = new mysqli('localhost', 'root', 'root', 'scotchbox');

    $query = 'SELECT * FROM categories LIMIT 1';

    $result = $db->query($query);
    while ($row = $result->fetch_assoc()) {
        $movies = getMoviesByCategory($row['url']);
        for($i=0; $i<count($movies); $i++) {
            $moviesString[] = "('" . $movies[$i]->{'title'} . "',".$row['id'] . ",'" .
            $movies[$i]->{'trailer_url'} . "','" . $movies[$i]->{'parental_rating'} . "','" . $movies[$i]->{'description'} . "','" .
            $movies[$i]->{'genre'} . "'," . $movies[$i]->{'releasedate'} . ",'" . $movies[$i]->{'director'} . "','" . $movies[$i]->{'actors'} . "')";
        }
    }
    $query = 'INSERT INTO movies (title, categoryId, trailer_url, parental_rating, description, genre, releasedate, director,
      actors) VALUES ' . implode(',',$moviesString) . ';';

      echo $query;

    $result->free();

    //$result = $db->query($query);
    //if(! $result) {
    //    die("Could not enter data: " . $db->error);
    //} else {
    //    echo "Successfully inserted " . count($titlesString) . " movies into the database";
    //}
}

populateMoviesTable();
//getMoviesByCategory('http://www.ranker.com/list/best-films-directed-by-famous-actors/ranker-film');
//getCategories(500);
//get_details("http://api.ranker-dev.com/lists/1457930/items/1237311?include=wikiText&propertyFetchType=ALL");


?>

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
    $page = scrape_between($page, '<section id="mainListCnt" class=" relative">','</section>');
    $title_containers = explode('<p class="tableAlign visible">', $page);
    foreach ($title_containers as $title_container) {
        $title = addslashes(trim(scrape_between($title_container, 'itemprop="name">', '</span>')));
        $titles[] = $title;
    }
    return $titles;
}

function populateMoviesTable() {
    $db = new mysqli('localhost', 'root', 'root', 'scotchbox');

    $query = 'SELECT * FROM categories LIMIT 100';

    $result = $db->query($query);
    while ($row = $result->fetch_assoc()) {
        $titles = getMoviesByCategory($row['url']);
        for($i=1; $i<count($titles); $i++) { 
            $titlesString[] = "('" . $titles[$i] . "',".$row['id'].")";
        }
    }
    $query = 'INSERT INTO movies (title, categoryId) VALUES ' . implode(',',$titlesString) . ';';

    $result->free();

    $result = $db->query($query);
    if(! $result) {
        die("Could not enter data: " . $db->error);
    } else {
        echo "Successfully inserted " . count($titlesString) . " movies into the database";
    }
}

//populateMoviesTable();
//getMoviesByCategory('http://www.ranker.com/list/best-films-directed-by-famous-actors/ranker-film', 11);



?>
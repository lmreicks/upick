<?php
$db = new mysqli('localhost', 'root', 'root', 'scotchbox');


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

$url = 'http://www.ranker.com/tag/facetedListSearch.htm?tagIds=5&limit=100&pagetype=CATEGORYPAGE';
$result_page = curl($url);
$seperate_results = explode('<h3 class="block robotoC width100 center">', $result_page);
$views_containers = explode('<span class="relative box width100 center uppercase">', $result_page);



foreach($seperate_results as $seperate_result) {
    if($seperate_result != "") {
        $category_titles[] = scrape_between($seperate_result, '<span class="black">', '</span>');
    }
}

foreach($views_containers as $views_container) {
    if($views_container != "") {
        $view = scrape_between($views_container, '<span class="relative robotoC rnkrBlue"> ', '</span>');
        $view = substr(rtrim($view), 0, -6); 
        if(substr($view, -1) == 'k'){
            $view = substr($view, 0, -1);
            $view = intval($view . '000');
        }
        $views[] = $view;
    }
}

for($i=1; $i<count($category_titles); $i++) { 
    $categories[] = '("' . $category_titles[$i] . '","'.$views[$i].'")';
}

$query = "INSERT INTO categories (title, views) VALUES " . implode(',',$categories) . ";";
$result = $db->query($query);
if(! $result) {
    die("could not enter data: " . $db->error);
}

echo "Data entered correctly";

$db->close();
?>
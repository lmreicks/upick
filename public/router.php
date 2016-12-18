<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
header("Access-Control-Allow-Origin: *");

$app = new \Slim\App;

$app->get('*', function() {
    echo file_get_contents("../index.html");
});

require_once("../RestApi/categories.php");
require_once("../RestApi/movies.php");

$app->run();

?>
<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require './vendor/autoload.php';
header("Access-Control-Allow-Origin: *");

$app = new \Slim\App;

require_once("./RestApi/categories.php");
require_once("./RestApi/movies.php");
require_once("./RestApi/genre.php");

$app->run();

?>
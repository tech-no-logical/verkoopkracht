<?php

namespace Desk\VK;

require __DIR__ . '/../../vendor/autoload.php';

use Slim\App;
use Slim\Http\Request;
use Slim\Http\Response;
// use Tuupola\Middleware\JwtAuthentication;

// start
$app = new App([
    "settings" => [
        "determineRouteBeforeAppMiddleware" => false
    ]
]);

$container = $app->getContainer();

// $container["jwt"] = function ($container) {
//     return new \stdClass();
// };

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

// $app->add(new JwtAuthentication([
// "path" => "/",
// "secure" => false,
// "passthrough" => "/login",
// "secret" => Config::$jwtSecret,
// "callback" => function (Request $request, Response $response, $arguments) use ($container) {
// $container["jwt"] = $arguments["decoded"];
// }
// ]));

$app->add(function (Request $req, Response $res, $next) {
    $response = $next($req, $res);
    return $response->withHeader('Cache-Control', 'private,max-age=0')->withHeader('Access-Control-Allow-Origin', '*')->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization, X-Language, X-Filename')->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$app->get('/organizations/statuses', OrganizationController::class.':statuses');
$app->get('/organizations/sectors', OrganizationController::class.':sectors');
$app->get('/organizations/list', OrganizationController::class.':shortlist');
$app->get('/organizations', OrganizationController::class.':list');
$app->post('/organizations/', OrganizationController::class.':post');
$app->get('/organizations/{id}/firstpersonid', OrganizationController::class.':getFirstPersonId');
$app->get('/organizations/{id}', OrganizationController::class.':get');
$app->put('/organizations/{id}', OrganizationController::class.':put');
$app->delete('/organizations/{id}', OrganizationController::class.':delete');


$app->get('/persons', PersonController::class.':list');
$app->get('/persons/list', PersonController::class.':shortlist');
$app->post('/persons/', PersonController::class.':post');
$app->get('/persons/{id}', PersonController::class.':get');
$app->put('/persons/{id}', PersonController::class.':put');
$app->delete('/persons/{id}', PersonController::class.':delete');

$app->get('/tasks', TaskController::class.':list');
$app->post('/tasks/', TaskController::class.':post');
$app->get('/tasks/{id}', TaskController::class.':get');
$app->put('/tasks/{id}', TaskController::class.':put');
$app->delete('/tasks/{id}', TaskController::class.':delete');

$app->get('/notes', NoteController::class.':list');
$app->post('/notes/', NoteController::class.':post');
$app->get('/notes/{id}', NoteController::class.':get');
$app->put('/notes/{id}', NoteController::class.':put');
$app->delete('/notes/{id}', NoteController::class.':delete');

// $app->post('/token', Token::class . '::generate');

// $app->get('/scan/{id}', ScanController::class . ':get');
// $app->get('/scan/{id}/accept', ScanController::class . ':accept');
// $app->put('/scan/{id}', ScanController::class . ':put');
// $app->get('/scan/{id}/content', ScanController::class . ':content');
// $app->get('/scan/{id}/privaccept', ScanController::class . ':privaccept');
// $app->get('/scan/{id}/checkprivaccepted', ScanController::class . ':checkprivaccepted');

// // $app->get('/scan/{id}/invites', ScanController::class.':invites');

// $app->get('/scan/{id}/instance', ProductInstanceController::class . ':get');
// $app->get('/scan/{id}/rapportage', ProductInstanceController::class . ':report');
// $app->post('/scan/{id}/instance/invite', ProductInstanceController::class . ':invite');
// $app->get('/scan/{id}/instance/uninvite/{sid}', ProductInstanceController::class . ':uninvite');
// $app->get('/scan/{id}/instance/resend/{sid}', ProductInstanceController::class . ':resend');

// $app->get('/profile', ProfileController::class . ':get');
// $app->post('/profile/userdata', ProfileController::class . ':setUserData');

// $app->post('/profile/wishprofile', ProfileController::class . ':createWishProfile');
// $app->delete('/profile/wishprofile/{id}', ProfileController::class . ':deleteWishProfile');
// $app->get('/profile/wishprofile/{id}', ProfileController::class . ':getWishProfile');
// $app->post('/profile/wishprofile/{id}/addscan', ProfileController::class . ':addScanToWishProfile');
// $app->delete('/profile/wishprofile/{id}/removescan/{sid}', ProfileController::class . ':removeScanFromWishProfile');
// $app->get('/profile/wishprofile/{id}/bulkreport', ProfileController::class . ':bulkWishProfile');

// $app->post('/profile/instanceset', ProfileController::class . ':createInstanceSet');
// $app->delete('/profile/instanceset/{id}', ProfileController::class . ':deleteInstanceSet');
// $app->get('/profile/instanceset/{id}', ProfileController::class . ':getInstanceSet');
// $app->get('/profile/instanceset/{id}/getnumreminders/{role}', ProfileController::class . ':getNumReminders');
// $app->get('/profile/instanceset/{id}/remind/{role}', ProfileController::class . ':remind');
// $app->post('/profile/instanceset/{id}', ProfileController::class . ':addBulk');
// $app->post('/profile/instanceset/{id}/addinstance', ProfileController::class . ':addInstance');
// $app->delete('/profile/instanceset/{id}/delete/{iid}', ProfileController::class . ':deleteInstance');

// $app->get('/profile/instance/{id}', ProfileController::class . ':getInstance');
// $app->get('/profile/instance/{id}/close', ProfileController::class . ':closeInstance');
// $app->post('/profile/instance/{id}/addscan', ProfileController::class . ':addScan');
// $app->delete('/profile/instance/{id}/removescan/{sid}', ProfileController::class . ':removeScan');
// $app->get('/profile/instance/{id}/resend/{sid}', ProfileController::class . ':resend');
// $app->get('/profile/instance/{id}/report/{sid}', ProfileController::class . ':report');
// $app->get('/profile/instance/{id}/bulkreport', ProfileController::class . ':bulkreport');
// $app->get('/profile/instance/{id}/queuepdf', ProfileController::class . ':queuepdf');

$app->map([
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH'
], '/{routes:.+}', function ($req, $res) {
    $handler = $this->notFoundHandler; // handle using the default Slim page not found handler
    return $handler($req, $res);
});

$app->run();

Config::getDbObj()->commit();

exit();
            
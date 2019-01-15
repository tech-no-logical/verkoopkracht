<?php
namespace Desk\VK;

use Slim\Http\Request;
use Slim\Http\Response;
use Psr\Container\ContainerInterface;
use PDO;

class TaskController
{

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function list(Request $req, Response $resp)
    {
        $dbObj = Config::getDbObj();
        $params = $req->getQueryParams();
        $where = "";
        
        if (isset($params['org'])) {
            $where = "WHERE A.organization_id = " . $dbObj->quote($params['org']) . " OR F.organization_id=" . $dbObj->quote($params['org']);
        }
        
        $query = "
            SELECT 
                A.id, A.organization_id, A.description,A.archived, A.planning,A.done,date(A.modified) as modified, C.lastname AS person, E.name AS organization, G.name as status, A.person_id || A.organization_id as coupled,
                datediff(A.planning, curdate()) as days
            FROM
                task A
            LEFT JOIN
                person C 
            ON
                A.person_id = C.id
            LEFT JOIN
                organization E
            ON 
                E.id=A.organization_id
            LEFT JOIN 
                person F
            ON
                A.person_id = F.id
            LEFT JOIN
                `status` G
            ON
                E.status_id = G.id
            $where
            GROUP BY A.id
            ORDER BY coupled asc, A.planning asc, A.modified desc, A.description, E.name, G.name, A.id
        ";
        
        $res = $dbObj->query($query)->fetchAll(PDO::FETCH_ASSOC);
        return $resp->withJson($res);
    }

    public function get(Request $req, Response $resp, $args)
    {
        $task = new Task($args['id']);
        return $resp->withJson($task->toJsonObj());
    }

    public function put(Request $req, Response $resp, $args)
    {
        $task = new Task($args['id']);
        $data = $req->getParsedBody();
        $task->update($data);
        $task->save();
        return $resp->withJson($task->toJsonObj());
    }

    public function post(Request $req, Response $resp, $args)
    {
        $task = new Task();
        $data = $req->getParsedBody();
        $task->update($data);
        $task->save();
        return $resp->withJson($task->toJsonObj());
    }

    public function delete(Request $req, Response $resp, $args)
    {
        Config::getDbObj()->query("delete from task where id=" . Config::getDbObj()->quote($args['id']));
        return $resp;
    }
}

?>

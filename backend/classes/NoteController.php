<?php
namespace Desk\VK;

use Slim\Http\Request;
use Slim\Http\Response;
use Psr\Container\ContainerInterface;
use PDO;

class NoteController
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
            $where = "WHERE A.organization_id = " . $dbObj->quote($params['org']) . " OR C.organization_id=" . $dbObj->quote($params['org']);
        }
        
        $query = "
            SELECT
                A.id, A.organization_id, A.archived, A.description,date(A.modified) as modified, B.name as organization,C.lastname as person, A.person_id || A.organization_id as coupled, D.name as `status`
            FROM
                note A
            LEFT JOIN
                organization B
            ON
                A.organization_id=B.id
            LEFT JOIN
                person C
            ON
                A.person_id = C.id
            LEFT JOIN
                `status` D
            ON
                D.id = B.status_id
            $where
            GROUP BY A.id
            ORDER BY coupled ASC, modified DESC, B.name, A.description
            
    ";
        
        $res = $dbObj->query($query)->fetchAll(PDO::FETCH_ASSOC);
        return $resp->withJson($res);
    }

    public function get(Request $req, Response $resp, $args)
    {
        $note = new Note($args['id']);
        return $resp->withJson($note->toJsonObj());
    }

    public function put(Request $req, Response $resp, $args)
    {
        $note = new Note($args['id']);
        $data = $req->getParsedBody();
        $note->update($data);
        $note->save();
        return $resp->withJson($note->toJsonObj());
    }

    public function post(Request $req, Response $resp, $args)
    {
        $note = new Note();
        $data = $req->getParsedBody();
        $note->update($data);
        $note->save();
        return $resp->withJson($note->toJsonObj());
    }

    public function delete(Request $req, Response $resp, $args)
    {
        Config::getDbObj()->query("delete from note where id=" . Config::getDbObj()->quote($args['id']));
        return $resp;
    }
}

?>

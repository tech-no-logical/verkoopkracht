<?php
namespace Desk\VK;

use Slim\Http\Request;
use Slim\Http\Response;
use Psr\Container\ContainerInterface;
use PDO;

class PersonController
{

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function shortlist(Request $req, Response $resp)
    {
        $dbObj = Config::getDbObj();
        $query = "select id,concat_ws(' ',concat(lastname, ','),firstname, insertion) as `name` from person order by lastname asc";
        $res = $dbObj->query($query)->fetchAll(PDO::FETCH_ASSOC);
        return $resp->withJson($res);
    }

    public function list(Request $req, Response $resp)
    {
        $dbObj = Config::getDbObj();
        $params = $req->getQueryParams();
        $where = "";
        
        if (isset($params['org'])) {
            $where = "WHERE G.id = " . $dbObj->quote($params['org']);
        }
        
        $query = "
            SELECT 
                A.id, A.organization_id, concat_ws(' ',concat(A.lastname, ','),A.firstname, A.insertion) as name ,A.email,date(A.modified) as modified,
                B.`number` as phone,
                G.name as organization,
                H.name as `status`,
                !isnull(A.organization_id) as coupled,
                CASE
                    WHEN MIN(F.planning) < DATE(NOW()) THEN 2
                    WHEN MAX(F.planning) > DATE(NOW()) THEN 1
                    ELSE 0
                END AS hastasks
            FROM
                person A
                    LEFT JOIN
                (SELECT 
                    *
                FROM
                    person_phone
                WHERE
                    id IN (SELECT 
                            MIN(id)
                        FROM
                            person_phone
                        GROUP BY person_id)) AS B ON A.id = B.person_id
                    LEFT JOIN
                task F ON A.id = F.person_id AND F.done = 0
                    AND F.archived = 0
                    LEFT JOIN
                organization G ON A.organization_id = G.id
                    LEFT JOIN
                `status` H on G.status_id = H.id
            $where 
            GROUP BY A.id
            ORDER BY coupled ASC, hastasks DESC, A.lastname ASC, A.modified ASC,  G.name ASC, H.name ASC
        ";
        
        $res = $dbObj->query($query)->fetchAll(PDO::FETCH_ASSOC);
        return $resp->withJson($res);
    }

    public function get(Request $req, Response $resp, $args)
    {
        $person = new Person($args['id']);
        return $resp->withJson($person->toJsonObj());
    }

    public function put(Request $req, Response $resp, $args)
    {
        $person = new Person($args['id']);
        $data = $req->getParsedBody();
        $person->update($data);
        $person->save();
        return $resp->withJson($person->toJsonObj());
    }

    public function post(Request $req, Response $resp, $args)
    {
        $person = new Person();
        $data = $req->getParsedBody();
        $person->update($data);
        $person->save();
        return $resp->withJson($person->toJsonObj());
    }

    public function delete(Request $req, Response $resp, $args)
    {
        Config::getDbObj()->query("delete from person where id=" . Config::getDbObj()->quote($args['id']));
        return $resp;
    }
}

?>

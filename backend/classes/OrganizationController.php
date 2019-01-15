<?php
namespace Desk\VK;

use Slim\Http\Request;
use Slim\Http\Response;
use Psr\Container\ContainerInterface;
use PDO;

class OrganizationController
{

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function sectors(Request $req, Response $resp)
    {
        $dbObj = Config::getDbObj();
        $query = "select * from sector order by name asc";
        $sectors = $dbObj->query($query)->fetchAll(PDO::FETCH_ASSOC);
        return $resp->withJson($sectors);
    }

    public function statuses(Request $req, Response $resp)
    {
        $dbObj = Config::getDbObj();
        $query = "select * from status order by name asc";
        $statuses = $dbObj->query($query)->fetchAll(PDO::FETCH_ASSOC);
        return $resp->withJson($statuses);
    }

    public function shortlist(Request $req, Response $resp)
    {
        $dbObj = Config::getDbObj();
        $query = "SELECT id, name FROM organization order by name asc";
        $res = $dbObj->query($query)->fetchAll(PDO::FETCH_ASSOC);
        return $resp->withJson($res);
    }

    public function list(Request $req, Response $resp)
    {
        $dbObj = Config::getDbObj();
        $query = "
            SELECT 
                A.*,
                date(A.modified) as modified,
                B.`number` as phone,
                D.name as sector,
                CASE
                    WHEN MIN(F.planning) < DATE(NOW()) THEN 2
                    WHEN MAX(F.planning) > DATE(NOW()) THEN 1
                    ELSE 0
                END AS hastasks,
                G.name as `status`
            FROM
                organization A
                    LEFT JOIN
                (SELECT 
                    *
                FROM
                    organization_phone
                WHERE
                    id IN (SELECT 
                            MIN(id)
                        FROM
                            organization_phone
                        GROUP BY organization_id)) AS B ON A.id = B.organization_id
                    LEFT JOIN
                (SELECT 
                    *
                FROM
                    organization_has_sector
                WHERE
                    sector_id IN (SELECT 
                            MIN(sector_id)
                        FROM
                            organization_has_sector
                        GROUP BY organization_id)) AS C ON A.id = C.organization_id
                    LEFT JOIN
                sector D ON C.sector_id = D.id
                   LEFT JOIN
                task F ON F.organization_id = A.id AND F.done = 0
                    AND F.archived = 0
                    LEFT JOIN
                `status` G on A.status_id = G.id
            GROUP BY A.id
            ORDER BY hastasks DESC, A.name ASC, A.modified DESC, D.name ASC, G.name ASC, A.zipcode ASC
        ";
        
        $res = $dbObj->query($query)->fetchAll(PDO::FETCH_ASSOC);
        return $resp->withJson($res);
    }

    public function get(Request $req, Response $resp, $args)
    {
        $organization = new Organization($args['id']);
        return $resp->withJson($organization->toJsonObj());
    }

    public function put(Request $req, Response $resp, $args)
    {
        $organization = new Organization($args['id']);
        $data = $req->getParsedBody();
        $organization->update($data);
        $organization->save();
        return $resp->withJson($organization->toJsonObj());
    }

    public function post(Request $req, Response $resp, $args)
    {
        $organization = new Organization();
        $data = $req->getParsedBody();
        $organization->update($data);
        $organization->save();
        return $resp->withJson($organization->toJsonObj());
    }

    public function delete(Request $req, Response $resp, $args)
    {
        Config::getDbObj()->query("delete from organization where id=" . Config::getDbObj()->quote($args['id']));
        return $resp;
    }

    public function getFirstPersonId(Request $req, Response $resp, $args)
    {
        $dbObj = Config::getDbObj();
        $id = $dbObj->query("select id from person where organization_id=" . $dbObj->quote($args['id']) . " order by id asc limit 1")
            ->fetchColumn();
        $obj = [
            'id' => $id
        ];
        return $resp->withJson($obj);
    }
}

?>

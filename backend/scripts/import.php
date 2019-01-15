<?php
namespace Desk\VK;

require __DIR__ . '/../vendor/autoload.php';

/**
 * import utility to import salesforce exports into database
 */

// fields as seen in organization export file
// contains both organization and people

$fields = [
    // organization
    'sf_id',
    'created',
    'modified',
    'status_id',
    '',
    'sector', // needs treatment
    'name',
    'address',
    'city',
    'zipcode',
    'phone', // needs treatment
    'website',
    // person
    'salutation',
    'firstname', // merge
    'lastname', // merge
    'position',
    'phone_1', // needs treatment
    'phone_2', // needs treatment
    'email'
];

// organization
$orgaStmt = Config::getDbObj()->prepare("insert into organization (sf_id, created, modified, status_id, name, address, city, zipcode, website) values(?,?,?,?,?,?,?,?,?)");
$persStmt = Config::getDbObj()->prepare("insert into person (created, modified, salutation, name, position, email, organization_id) values(?,?,?,?,?,?,?)");
$taskStmt = Config::getDbObj()->prepare("insert into task (created, modified, done, description, archived,details, planning, organization_id) values(?,?,?,?,?,?,'2018-11-11',?)");
$orgaPhon = Config::getDbObj()->prepare("insert into organization_phone (number, organization_id) values (?,?)");
$persPhon = Config::getDbObj()->prepare("insert into person_phone (number, person_id) values (?,?)");
$sectStmt = Config::getDbObj()->prepare("insert into sector (name) values (?)");
$hasSStmt = Config::getDbObj()->prepare("insert into organization_has_sector (organization_id,sector_id) values (?,?)");

$gSectors = [];

$orgaId;
$persId;
$num = 0;

if (($handle = fopen("org.csv", "r")) !== FALSE) {
    while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $num ++;
        if ($num === 1)
            continue;
        
        $orgaStmt->execute([
            $row[0],
            $row[1],
            $row[2],
            $row[3],
            $row[6],
            $row[7],
            $row[8],
            $row[9],
            $row[11]
        ]);
        $orgaId = Config::getDbObj()->lastInsertId();
        
        // sector
        if ($row[5]) {
            $sectors = explode(" ", $row[5]);
            if (count($sectors) === 0) {
                $sectors = [
                    'Geen'
                ];
            }
            foreach ($sectors as $k => $v) {
                if ($v) {
                    if ($gSectors[$v]) {
                        $hasSStmt->execute([
                            $orgaId,
                            $gSectors[$v]
                        ]);
                    } else {
                        $sectStmt->execute([
                            $v
                        ]);
                        $sectId = Config::getDbObj()->lastInsertId();
                        $gSectors[$v] = $sectId;
                        $hasSStmt->execute([
                            $orgaId,
                            $sectId
                        ]);
                    }
                }
            }
        }
        
        // phone
        if ($row[10]) {
            $orgaPhon->execute([
                $row[10],
                $orgaId
            ]);
        } else {
            $orgaPhon->execute([
                '000',
                $orgaId
            ]);
        }
        
        if ($row[14]) { // person exists
            $persStmt->execute([
                $row[1],
                $row[2],
                $row[12],
                $row[13] . " " . $row[14],
                $row[15],
                $row[18],
                $orgaId
            ]);
            $persId = Config::getDbObj()->lastInsertId();
            if ($row[16]) {
                $persPhon->execute([
                    $row[16],
                    $persId
                ]);
            } else {
                $persPhon->execute([
                    '000',
                    $persId
                ]);
            }
            
            if ($row[17]) {
                $persPhon->execute([
                    $row[17],
                    $persId
                ]);
            }
        }
    }
    fclose($handle);
}

// fields as seen in tasks export file
$fields = [
    // organization
    'sf_id',
    'created',
    'modified',
    'status', // needs treatment
    'description',
    'archived', // needs treatment
    'details'
];

if (($handle = fopen("tasks.csv", "r")) !== FALSE) {
    while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $num ++;
        if ($num === 1)
            continue;
        
        $orgaId = Config::getDbObj()->query("select id from organization where sf_id=" . Config::getDbObj()->quote($row[0]))
            ->fetchColumn();
        $persId = Config::getDbObj()->query("select id from person where organization_id=" . Config::getDbObj()->quote($orgaId))
            ->fetchColumn();
        
        if ($orgaId) {
            $taskStmt->execute([
                $row[1],
                $row[2],
                $row[3] === 'Open' ? 0 : 1,
                $row[4],
                $row[5] != '' ? 1 : 0,
                $row[6],
                $orgaId
            ]);
            $taskId = Config::getDbObj()->lastInsertId();
            print "p $persId";
            if ($persId) {
                Config::getDbObj()->query("update task set person_id=" . Config::getDbObj()->quote($persId) . " where id=" . $taskId);
            }
            print $row[2] . "\n";
        } else {
            print "no org for task " . $row[0] . "\n";
        }
    }
}

Config::getDbObj()->commit();
?>

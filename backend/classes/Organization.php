<?php
namespace Desk\VK;

use ReflectionClass, ReflectionProperty;
use PDO;

class Organization
{

    protected $id;

    protected $name;

    protected $address;

    protected $zipcode;

    protected $city;

    protected $postaddress;

    protected $postzip;

    protected $postcity;

    protected $email;

    protected $website;

    protected $status_id;

    protected $sector_id = [];

    protected $phone = [];

    private $dbObj;

    private $externals = [
        'sector_id',
        'phone'
    ];

    public function __construct($id = false)
    {
        if ($id) {
            $this->id = $id;
            $this->load();
        }
    }

    private function rnd($length = 10)
    {
        return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);
    }

    public function generate()
    {
        $this->name = self::rnd(10) . ' ' . self::rnd(10);
        $this->address = self::rnd(10) . ' ' . rand(10, 400);
        $this->zipcode = self::rnd(6);
        $this->city = self::rnd(15);
        $this->email = self::rnd(10) . '@example.com';
    }

    public function load()
    {
        $dbObj = Config::getDbObj();
        $props = $dbObj->query("select * from organization where id=" . $dbObj->quote($this->id))
            ->fetch(PDO::FETCH_ASSOC);
        foreach ($props as $p => $v) {
            $this->{$p} = $v;
        }
        
        $this->phone = $dbObj->query("select number from organization_phone where organization_id=" . $dbObj->quote($this->id))
            ->fetchAll(PDO::FETCH_COLUMN);
        $this->sector_id = $dbObj->query("select sector_id from organization_has_sector where organization_id=" . $dbObj->quote($this->id))
            ->fetchAll(PDO::FETCH_COLUMN);
    }

    public function toJsonObj()
    {
        $obj = [];
        $reflect = new ReflectionClass($this);
        $props = $reflect->getProperties(ReflectionProperty::IS_PROTECTED);
        foreach ($props as $prop) {
            $obj[$prop->getName()] = $this->{$prop->getName()};
        }
        return $obj;
    }

    public function update($data)
    {
        $reflect = new ReflectionClass($this);
        $props = $reflect->getProperties(ReflectionProperty::IS_PROTECTED);
        foreach ($props as $prop) {
            $this->{$prop->getName()} = $data[$prop->getName()];
        }
        return $this;
    }

    public function save()
    {
        $flds = [];
        $vals = [];
        $qs = [];
        $updt = [];
        
        $reflect = new ReflectionClass($this);
        $props = $reflect->getProperties(ReflectionProperty::IS_PROTECTED);
        foreach ($props as $prop) {
            if (! in_array($prop->getName(), $this->externals)) {
                $flds[] = $prop->getName();
                $vals[] = $this->{$prop->getName()};
                $qs[] = "?";
                $updt[] = $prop->getName() . " = VALUES(" . $prop->getName() . ")";
            }
        }
        
        $stmt = Config::getDbObj()->prepare("insert into organization (created, modified, " . join(',', $flds) . ") values (now(), now(), " . join(',', $qs) . ") on duplicate key update modified=VALUES(modified), " . join(',', $updt));
        $stmt->execute($vals);
        if (! $this->id) {
            $this->id = Config::getDbObj()->lastInsertId();
        }
        
        // handle externals
        Config::getDbObj()->query("delete from organization_phone where organization_id=" . Config::getDbObj()->quote($this->id));
        Config::getDbObj()->query("delete from organization_has_sector where organization_id=" . Config::getDbObj()->quote($this->id));
        
        foreach ($this->phone as $k => $v) {
            Config::getDbObj()->query("insert into organization_phone (organization_id,`number`) values (" . Config::getDbObj()->quote($this->id) . ", " . Config::getDbObj()->quote($v) . ")");
        }
        
        foreach ($this->sector_id as $k => $v) {
            Config::getDbObj()->query("insert into organization_has_sector (organization_id, sector_id) values (" . Config::getDbObj()->quote($this->id) . ", " . Config::getDbObj()->quote($v) . ") on duplicate key update sector_id=VALUES(sector_id)");
        }
        return $this;
    }
}
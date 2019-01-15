<?php
namespace Desk\VK;

use ReflectionClass, ReflectionProperty;
use PDO;

class Person
{

    protected $id;

    protected $salutation;

    protected $firstname;

    protected $insertion;

    protected $lastname;

    protected $position;

    protected $email;

    protected $phone = [];

    protected $organization_id;

    private $dbObj;

    private $externals = [
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
        $this->lastname = self::rnd(10) . ' ' . self::rnd(10);
        $this->position = self::rnd(10);
        $this->email = self::rnd(10) . '@example.com';
        $this->organization_id = rand(1, 2000);
    }

    public function load()
    {
        $dbObj = Config::getDbObj();
        $props = $dbObj->query("select * from person where id=" . $dbObj->quote($this->id))
            ->fetch(PDO::FETCH_ASSOC);
        foreach ($props as $p => $v) {
            $this->{$p} = $v;
        }
        
        $this->phone = $dbObj->query("select number from person_phone where person_id=" . $dbObj->quote($this->id))
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
        
        // XXX: if we don't do this, empty value = '' and the foreign key fails
        if (! $this->organization_id) {
            $this->organization_id = null;
        }
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
        
        $stmt = Config::getDbObj()->prepare("insert into person (created, modified, " . join(',', $flds) . ") values (now(), now(), " . join(',', $qs) . ") on duplicate key update modified=VALUES(modified), " . join(',', $updt));
        $stmt->execute($vals);
        if (! $this->id) {
            $this->id = Config::getDbObj()->lastInsertId();
        }
        // handle externals
        Config::getDbObj()->query("delete from person_phone where person_id=" . Config::getDbObj()->quote($this->id));
        
        foreach ($this->phone as $k => $v) {
            Config::getDbObj()->query("insert into person_phone (person_id,`number`) values (" . Config::getDbObj()->quote($this->id) . ", " . Config::getDbObj()->quote($v) . ")");
        }
        
        return $this;
    }
}
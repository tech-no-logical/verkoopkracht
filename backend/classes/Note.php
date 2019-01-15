<?php
namespace Desk\VK;

use ReflectionClass, ReflectionProperty;
use PDO;

class Note
{

    protected $id;

    protected $description;

    protected $details;

    protected $organization_id;

    protected $person_id;

    protected $archived = 0;

    private $dbObj;

    private $externals = [];

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
        $this->description = self::rnd(10) . ' ' . self::rnd(10);
        $this->planning = date("d.m.Y", rand(strtotime("Jan 01 2017"), strtotime("Dec 01 2019")));
        $this->done = rand(0, 1);
        if (rand(0, 1)) {
            $this->organization_id = rand(1, 2000);
        } else {
            $this->person_id = rand(1, 4000);
        }
    }

    public function load()
    {
        $dbObj = Config::getDbObj();
        $props = $dbObj->query("select * from note where id=" . $dbObj->quote($this->id))
            ->fetch(PDO::FETCH_ASSOC);
        foreach ($props as $p => $v) {
            $this->{$p} = $v;
        }
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
        if (! $this->person_id) {
            $this->person_id = null;
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
        
        $stmt = Config::getDbObj()->prepare("insert into note (created, modified, " . join(',', $flds) . ") values (now(), now(), " . join(',', $qs) . ") on duplicate key update modified=VALUES(modified), " . join(',', $updt));
        $stmt->execute($vals);
        if (! $this->id) {
            $this->id = Config::getDbObj()->lastInsertId();
        }
        
        // handle externals
        
        return $this;
    }
}
<?php

namespace Desk\VK;

use PDO;

class Config
{

    protected static $dbObj;

    public static $debug = true;

    function __construct()
    {}

    public static $jwtSecret = 'jHY5$kLdEQvNa4No7qC^M6tDPsVzYDLx';
    
    public static function getDbObj()
    {
        if (! self::$dbObj) {
            
            $options = array(
                PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
            );
            
            self::$dbObj = new PDO('mysql:host=localhost;dbname=verkoopkracht', 'vk', 'vk', $options);
            self::$dbObj->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            self::$dbObj->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            self::$dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$dbObj->beginTransaction();
        }
        
        return self::$dbObj;
    }
}


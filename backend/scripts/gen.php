<?php
namespace Desk\VK;

require __DIR__ . '/../vendor/autoload.php';

// generate large amount of entities for testing

for($t=1;$t<=2000;$t++) {
    $p = new Organization();
    $p->generate();
    $p->save();
}

// Config::getDbObj()->commit();

for($t=1;$t<=4000;$t++) {
    $p = new Person();
    $p->generate();
    $p->save();
}

// Config::getDbObj()->commit();

for($t=1;$t<=8000;$t++) {
    $p = new Task();
    $p->generate();
    $p->save();
}

// Config::getDbObj()->commit();

for($t=1;$t<=8000;$t++) {
    $p = new Note();
    $p->generate();
    $p->save();
}

Config::getDbObj()->commit();

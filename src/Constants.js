function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

define("PRD_URL", 'http://localhost:8000');
define("DEV_URL", 'http://localhost:8000');

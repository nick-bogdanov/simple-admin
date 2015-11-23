var logger = require('tracer').colorConsole({
  format : "<{{title}}> {{timestamp}} (in {{file}}:{{line}}) {{message}}",
  dateformat : "HH:MM:ss"
});

module.exports = logger;
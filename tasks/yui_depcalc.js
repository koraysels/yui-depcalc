/*
 * grunt-yui-depcalc
 * https://github.com/koray.sels/yui-dep
 *
 * Copyright (c) 2014 koray.sels
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('yui_depcalc', 'Programatically use Loader to auto-generate a custom seed file with modules needed for immediate access.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            punctuation: '.',
            separator: ', '
        });

        var path = require('path'),
            fs = require('fs'),
            YUI = require('yui').YUI,
            Y = YUI();

        this.files.forEach(function (f) {
            // Concat specified files.
            var src = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    grunt.log.writeln(filepath);
                    var json = grunt.file.readJSON(filepath);
                    grunt.log.writeln(json.pagescripts.root);

                    for (var prop in json.pagescripts) {
                        if (json.pagescripts.hasOwnProperty(prop)) {
                            var jsfilepath = json.pagescripts.root, jsRequires;
                            switch (prop) {
                                case 'root' :
                                    jsfilepath = json.pagescripts[prop];
                                    grunt.log.writeln('rootpath = ' + jsfilepath);
                                    break;
                                default :
                                    for (var elem in json.pagescripts[prop]) {
                                        if (json.pagescripts[prop].hasOwnProperty(elem)) {
                                            switch (elem) {
                                                case 'path' :
                                                    jsfilepath += json.pagescripts[prop][elem];
                                                    grunt.log.writeln('full jsfilepath = ' + jsfilepath);
                                                    break;
                                                case 'uses' :
                                                    jsRequires = json.pagescripts[prop][elem];
                                                    grunt.log.writeln('requires = ' + json.pagescripts[prop][elem]);
                                                    break;
                                            }
                                        }
                                    }
                                    break;
                            }
                        }
                    }


                    return true;
                }
            });

            // Handle options.
            src += options.punctuation;

            // Write the destination file.
            grunt.file.write(f.dest, src);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};

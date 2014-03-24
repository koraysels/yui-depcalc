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
                    basePath: '../',
                    extension: '-resolved.js',
                    modulePath: '/js/modules',
                }),
                path = require('path'),
                fs = require('fs'),
                YUI = require('yui').YUI,
                Y = YUI(),
                groups = {},
                basepath = options.modulePath;

            var groupsProcess = function (file) {
                //Fixing YUI bug were root does not work
                for (var group in file) {
                    if (file.hasOwnProperty(group)) {
                        grunt.log.writeln("groups = " + group);
                        file[group].base = path.join(basepath, file[group].root);
                    }
                }
                return file;
            };

            var depcalc = function (jsRequires) {
//                grunt.log.writeln('required modules  = ' + jsRequires);

                var loader = new Y.Loader({
                    //Setup the base path that your YUI files live in
                    comboBase: '',
                    base: path.join(__dirname, '../node_modules/yui/'),
                    maxURLLength: 1999,
                    injected: true,
                    throwFail: true,
                    ignoreRegistered: false, //NOT SURE WHAT THIS DOES THOUGH
                    require: jsRequires,
                    skin: {},
                    groups: groups
                });
                var out = loader.resolve(true);

                var str = [];
                //Now we have the generated url
                out.js.forEach(function (file) {
                    //Read the files
                    str.push(fs.readFileSync(file, 'utf8'));
                });
                //return all the files out into a single string
                return str.join('\n');
            };


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
                        groups = groupsProcess(json.modules);
                        grunt.log.writeln(json.pagescripts.root);

                        for (var prop in json.pagescripts) {
                            if (json.pagescripts.hasOwnProperty(prop)) {
                                var jsfilepath = json.pagescripts.root, jsRequires = [], jsfilename;
                                switch (prop) {
                                    case 'root' :
                                        jsfilepath = path.join(__dirname, json.pagescripts[prop]);
//                                    grunt.log.writeln('rootpath = ' + jsfilepath);
                                        break;
                                    default :
                                        for (var elem in json.pagescripts[prop]) {
                                            if (json.pagescripts[prop].hasOwnProperty(elem)) {
                                                switch (elem) {
                                                    case 'path' :
                                                        jsfilepath += json.pagescripts[prop][elem];
                                                        jsfilename = jsfilepath.split('.js')[0];
                                                        break;
                                                    case 'uses' :
                                                        jsRequires = json.pagescripts[prop][elem];

                                                        break;
                                                }
                                            }
                                        }
                                        // Write the destination file.
                                        var originalfile = grunt.file.read(path.join(options.basePath, jsfilepath), 'utf8');
                                        jsfilepath = path.join(options.basePath + jsfilename + options.extension);
                                        grunt.file.write(jsfilepath, depcalc(jsRequires) + originalfile);
                                        grunt.log.oklns(jsfilepath);
                                        break;
                                }
                            }
                        }


                        return true;
                    }
                });

                grunt.log.writeln('depcalc ended ');
            });
        }
    )
    ;

}
;

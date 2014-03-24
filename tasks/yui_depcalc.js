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

        var depcalc = function (jsRequires) {
            grunt.log.writeln('required modules  = ' + jsRequires);
            var basepath = '../../../WEB-INF/js/';
            var loader = new Y.Loader({
                //Setup the base path that your YUI files live in
                comboBase: '',
                base: path.join(basepath, 'yellow/yui/'),
                maxURLLength: 1999,
                injected: true,
                throwFail: true,
                ignoreRegistered: false, //NOT SURE WHAT THIS DOES THOUGH
                require: jsRequires,
                skin: {},
                groups: {
                    components: {
                        base: path.join(basepath, 'yellow/components/'),
                        combine: false,
                        modules: {
                            'truvo-debug': {
                                path: 'truvo-debug.js',
                                requires: ['base', 'node', 'truvo-log']
                            },
                            'truvo-searchmodel': {
                                path: 'truvo-searchmodel.js',
                                requires: ['truvo-log', 'base', 'truvo-storagelite', 'io-base', 'json-parse']
                            },
                            'truvo-results': {
                                path: 'truvo-results.js',
                                requires: ['truvo-log', 'base', 'truvo-listing', 'truvo-favorite']
                            },
                            'truvo-collapse': {
                                path: 'truvo-collapse.js',
                                requires: ['base', 'node', 'truvo-log', 'transition']
                            },
                            'truvo-modal': {
                                path: 'truvo-modal.js',
                                requires: ['base', 'node', 'truvo-log']
                            },
                            'truvo-taximodal': {
                                path: 'truvo-taximodal.js',
                                requires: ['truvo-linkmodal']
                            },
                            'truvo-linkmodal': {
                                path: 'truvo-linkmodal.js',
                                requires: ['truvo-modal']
                            },
                            'truvo-searchfilter': {
                                path: 'truvo-searchfilter.js',
                                requires: ['base', 'node', 'truvo-log', 'truvo-modal', 'truvo-storagelite', 'querystring-stringify', 'array-extras']
                            },
                            'truvo-location': {
                                path: 'truvo-location.js',
                                requires: ['base', 'node', 'io-base', 'cookie']
                            },
                            'truvo-listing': {
                                path: 'truvo-listing.js'
                            },
                            'truvo-template-ajax': {
                                path: 'truvo-template-ajax.js',
                                requires: ['truvo-log', 'base', 'truvo-querystring', 'io-base', 'json-parse']
                            },
                            'truvo-favorite': {
                                path: 'truvo-favorite.js',
                                requires: ['truvo-log', 'base', 'truvo-searchmodel', 'node'],
                                skinnable: false
                            },
                            'truvo-global': {
                                path: 'truvo-global.js',
                                requires: ['truvo-log', 'node', 'truvo-collapse', 'json-parse']
                            },
                            'truvo-tabs': {
                                path: 'truvo-tabs.js',
                                requires: ['node', 'base', 'truvo-log']
                            },
                            'truvo-changelocation': {
                                path: 'truvo-changelocation.js',
                                requires: ["truvo-log", "base", "node", "truvo-autosuggestion", "truvo-location", "truvo-template-ajax", "truvo-handlebars-helpers"]
                            }
                        }
                    },
                    customform: {
                        base: path.join(basepath,  'yellow/customform/'),
                        combine: false,
                        modules: {
                            'truvo-write-review': {
                                path: 'truvo-write-review.js',
                                requires: ["truvo-log", "base", "truvo-form"]
                            },
                            'truvo-form-modal': {
                                path: 'truvo-form-modal.js',
                                requires: ["truvo-form"]
                            }
                        }
                    },
                    utilities: {
                        base: path.join(basepath,  'yellow/utilities/'),
                        combine: false,
                        modules: {
                            'truvo-log': {
                                path: 'truvo-log.js',
                                requires: ['node', 'base']
                            },
                            'truvo-querystring': {
                                path: 'truvo-querystring.js',
                                requires: ['base']
                            },
                            'truvo-storagelite': {
                                path: 'truvo-storagelite.js',
                                requires: ['json', 'node']
                            },
                            'truvo-feature-detect': {
                                path: 'truvo-feature-detect.js',
                                requires: ['node']
                            },
                            'truvo-offline': {
                                path: 'truvo-offline.js',
                                requires: ['truvo-message']
                            },
                            'truvo-enable-styles': {
                                path: 'truvo-enable-styles.js',
                                requires: ['stylesheet']
                            },
                            'truvo-handlebars-helpers': {
                                path: 'truvo-handlebars-helpers.js',
                                requires: ['truvo-log']
                            },

                            'table-scroll': {
                                path: 'table-scroll.js',
                                requires: ['truvo-log', 'base', 'scrollview-base', 'node', 'transition']
                            },
                            'truvo-facebookshare': {
                                path: 'truvo-facebookshare.js',
                                requires: ['node', 'base']
                            },
                            'truvo-animation-helper': {
                                path: 'truvo-animation-helper.js',
                                requires: ["truvo-log", "base", "node", "transition"]
                            },
                            'truvo-geolocation': {
                                path: 'truvo-geolocation.js',
                                requires: ["geoposition"]
                            }
                        }
                    },
                    search: {
                        base: path.join(basepath, 'yellow/search/'),
                        combine: false,
                        modules: {
                            'truvo-autosuggestion': {
                                path: 'truvo-autosuggestion.js',
                                requires: ['truvo-log', 'base', 'io-base', 'json-parse', 'dump']
                            }
                        }
                    },
                    parts: {
                        base: path.join(basepath, 'yellow/parts/'),
                        combine: false,
                        modules: {
                            'truvo-searchlist': {
                                path: 'truvo-searchlist.js',
                                requires: ['truvo-log', 'base', 'truvo-results', 'truvo-template-ajax']
                            },
                            'truvo-search-bar': {
                                path: 'truvo-search-bar.js',
                                requires: ['truvo-log', 'base', 'truvo-location', 'truvo-autosuggestion']
                            },
                            'truvo-reviewslist': {
                                path: 'truvo-reviewslist.js',
                                requires: ['truvo-log', 'base', 'truvo-listing', 'truvo-template-ajax']
                            },
                            'truvo-booking': {
                                path: 'truvo-booking.js',
                                requires: ['truvo-log', 'base', 'node']
                            },
                            'truvo-gallery': {
                                path: 'truvo-gallery.js',
                                requires: ['truvo-log', 'truvo-gallery', 'base', 'node', 'anim']
                            },
                            'truvo-refine-bar': {
                                path: 'truvo-refine-bar.js',
                                requires: ['truvo-log', 'base', 'truvo-querystring', 'truvo-handlebars-helpers', 'masonry', 'truvo-template-ajax', 'truvo-animation-helper']
                            },
                            'truvo-sort-bar': {
                                path: 'truvo-sort-bar.js',
                                requires: ['truvo-log', 'base', 'truvo-listing', 'truvo-template-ajax']
                            },
                            'truvo-taxi': {
                                path: 'truvo-taxi.js',
                                requires: ['node', 'base', 'truvo-log', 'truvo-autosuggestion', 'truvo-location']
                            },
                            'truvo-dynamic-search': {
                                path: 'truvo-dynamic-search.js',
                                requires: ['node', 'base', 'truvo-pagesnippet', 'truvo-querystring']
                            },
                            'truvo-refine-popup': {
                                path: 'truvo-refine-popup.js',
                                requires: ['truvo-log', 'base', 'node', 'promise']
                            }
                        }
                    },
                    external: {
                        base: path.join(basepath, 'yellow/external/'),
                        combine: false,
                        modules: {
                            'mustache': {
                                path: 'mustache.js'
                            },
                            'handlebars.js': {
                                path: 'handlebars.js'
                            }
                        }
                    },
                    maps: {
                        base: path.join(basepath, 'yellow/maps/'),
                        combine: false,
                        modules: {
                            'truvo-maps-basic': {
                                path: 'truvo-maps-basic.js',
                                requires: ['truvo-log', 'truvo-querystring', 'base', 'async-queue']
                            }
                        }
                    },
                    gallery: {
                        base: path.join(basepath, 'yellow/gallery/'),
                        combine: false,
                        modules: {
                            'masonry': {
                                path: 'masonry.js',
                                requires: ['base', 'node', 'event', 'transition']
                            },
                            'hammer': {
                                path: 'hammer.js',
                                requires: ['base', 'node', 'event', 'transition']
                            },
                            'truvo-image-gallery': {
                                path: 'truvo-image-gallery.js',
                                requires: ['base', 'node', 'event', 'hammer', 'transition']
                            },
                            'gallery-widget-pointer': {
                                path: 'gallery-widget-pointer.js',
                                requires: ['align-plugin']
                            },
                            'gallery-tipsy': {
                                path: 'gallery-tipsy.js',
                                requires: ['base', 'widget', 'widget-position', 'widget-stack', 'widget-position-align', 'gallery-widget-pointer', 'widget-stdmod', 'node']
                            }
                        }
                    },
                    widgets: {
                        base: path.join(basepath, 'yellow/widgets/'),
                        combine: false,
                        modules: {
                            'truvo-simple-ratings': {
                                path: 'truvo-simple-ratings.js',
                                requires: ['truvo-log', 'node', 'base', 'event-mouseenter']
                            }
                        }
                    },
                    jwplayer: {
                        root: 'yellow/jwplayer/',
                        combine: false,
                        modules: {
                            'jwplayer': {
                                path: 'jwplayer.js'
                            }
                        }
                    },
                    geoposition: {
                        root: 'yellow/geoposition/',
                        combine: false,
                        modules: {
                            'geoposition': {
                                path: 'geoposition.js'
                            }
                        }
                    }
                }
            });
            var out = loader.resolve(true);

            var str = [];
//Now we have the generated url
            out.js.forEach(function (file) {
                //Read the files
                str.push(fs.readFileSync(file, 'utf8'));
                grunt.log.writeln('read  = ' + file);
            });
//
//Write all the files out into a single file
//            fs.writeFileSync('./combined.js', str.join('\n'), 'utf8');
            grunt.file.write('./combined.js', str.join('\n'));
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
                    grunt.log.writeln(json.pagescripts.root);

                    for (var prop in json.pagescripts) {
                        if (json.pagescripts.hasOwnProperty(prop)) {
                            var jsfilepath = json.pagescripts.root, jsRequires = [];
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

                                                    break;
                                            }
                                        }
                                    }
                                    depcalc(jsRequires);
                                    break;
                            }
                        }
                    }


                    return true;
                }
            });

            grunt.log.writeln('depcalc ended ');
        });
    });

};

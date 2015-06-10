/*
 * grunt-locales Tests
 * https://github.com/blueimp/grunt-locales
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global exports, require */

(function () {
    'use strict';

    var grunt = require('grunt');
    var _locales = ['en_US', 'de_DE'];

    exports.locales = {

        update: function (test) {
            test.expect(2);
            var actual = grunt.file.read('tmp/en_US/i18n.json'),
                expected = grunt.file.read('test/fixtures/en_US/i18n.json');
            test.equal(
                actual,
                expected,
                'Should parse HTML templates and update existing JSON locale files.'
            );
            actual = grunt.file.read('tmp/de_DE/i18n.json');
            expected = grunt.file.read('test/fixtures/de_DE/i18n.json');
            test.equal(
                actual,
                expected,
                'Should parse HTML templates and create new JSON locale files.'
            );
            test.done();
        },

        build: function (test) {
            test.expect(2);
            var actual = grunt.file.read('tmp/en_US/i18n.js'),
                expected = grunt.file.read('test/fixtures/en_US/i18n.js');
            test.equal(
                actual,
                expected,
                'Should parse JSON locale files and build JS locale files.'
            );
            actual = grunt.file.read('tmp/de_DE/i18n.js');
            expected = grunt.file.read('test/fixtures/de_DE/i18n.js');
            test.equal(
                actual,
                expected,
                'Should parse JSON locale files and build JS locale files.'
            );
            test.done();
        },

        'export': function (test) {
            test.expect(2);
            var actual = grunt.file.read('tmp/en_US/i18n.csv').replace(/\r/g, ""),
                expected = grunt.file.read('test/fixtures/en_US/i18n.csv').replace(/\r/g, "");
            test.equal(
                actual,
                expected,
                'Should export JSON locale files to CSV locale files.'
            );
            actual = grunt.file.read('tmp/de_DE/i18n.csv').replace(/\r/g, "");
            expected = grunt.file.read('test/fixtures/de_DE/i18n.csv').replace(/\r/g, "");
            test.equal(
                actual,
                expected,
                'Should export JSON locale files to CSV locale files.'
            );
            test.done();
        },

        'import': function (test) {
            grunt.log.writeln("locales:import test");
            test.expect(2);
            var actual = grunt.file.read('tmp/en_US/i18n-import.json').replace(/\r/g, ""),
                expected = grunt.file.read('test/fixtures/en_US/i18n-translated.json').replace(/\r/g, "");
            test.equal(
                actual,
                expected,
                'Should import CSV locale file to JSON locale files.'
            );
            actual = grunt.file.read('tmp/de_DE/i18n-import.json').replace(/\r/g, "");
            expected = grunt.file.read('test/fixtures/de_DE/i18n-translated.json').replace(/\r/g, "");
            test.equal(
                actual,
                expected,
                'Should import CSV locale file to JSON locale files.'
            );
            test.done();
        },

        localize: function (test) {
            grunt.log.writeln("locales:localize test");
            test.expect(6);
            _locales.forEach(function (locale) {
                grunt.file.expand({
                    cwd: 'test/fixtures/' + locale + "/"
                }, ["*-translated.html"]).forEach(function (file) {
                    grunt.log.writeln("checking file " + file);
                    var actual = grunt.file.read('tmp/' + locale + "/" + file.replace(/\-translated/, "")).replace(/\r/g, ""),
                        expected = grunt.file.read('test/fixtures/' + locale + '/' + file).replace(/\r/g, "");

                    test.equal(
                        actual,
                        expected,
                        'Should localize HTML file ' + file + ' in locale ' + locale
                    );

                });
            });
            test.done();
        }

    };

}());

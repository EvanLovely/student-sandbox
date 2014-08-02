module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    compass: {// https://github.com/gruntjs/grunt-contrib-compass
      options: {
        config: 'config.rb',
        bundleExec: true
      },
      compile: {
        // no options needed; default task
      },
      watch: {
        options: {
          watch: true
        }
      }
    },

    shell: {// https://github.com/sindresorhus/grunt-shell
      update_bundler: {
        command: 'bundle install'
      },
      update_bower: {
        command: 'bower install'
      },
      update_node: {
        command: 'npm install'
      }
    },

    connect: {// https://www.npmjs.org/package/grunt-contrib-connect
      server: {
        options: {
          port: 9001,
          useAvailablePort: true,
          base: '_site',
          keepalive: true,
          livereload: true,
          open: true
        }
      }
    },

    watch: {// https://github.com/gruntjs/grunt-contrib-watch
      source: {
//        options: {
//          spawn: false
//        },
        files: [
          'source/**/*',
          '!**/source/scss/**', // watch:scss has this
          '!**/source/css/**', // watch:scss has this
          '!**/source/images/icons/src/**', // watch:icons has this
          '!**/source/images/icons/templates/*', // watch:icons has this
          '!**/source/images/icons/unused-library/*', // watch:icons has this
          '!**/source/images/icons/output/**', // watch:icons has this
          '!**/bower_components/**' // IGNORE bower_components
        ],
        tasks: ['shell:pattern_lab_build']
      },
      scss: {
        files: [
          'source/scss/**/*.scss',
          'public/styleguide/css/styleguide-specific.scss'
        ],
        tasks: [
          'compass:compile',
          'shell:pattern_lab_build'
        ]
      },
      public: {
        options: {
          livereload: true
        },
        files: ['public/latest-change.txt']
      },
      js_for_errors: {
        files: ['source/js/script.js'],
        tasks: ['jshint:js']
      }
    },

    parallel: {// https://www.npmjs.org/package/grunt-parallel
      watch: {
        tasks: [
          {
            grunt: true,
            stream: false,
            args: ['connect:server']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:scss']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:source']
          },
          {
            grunt: true,
            stream: false,
            args: ['watch:public']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:js_for_errors']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:icons']
          }
        ]
      }
    },

    jshint: {// https://www.npmjs.org/package/grunt-contrib-jshint
      options: {
        jshintrc: true // change settings in `.jshintrc`
      },
      js: {
        src: ['source/js/script.js']
      }
    },

    notify: {
      build: {
        options: {
          message: 'Build Complete'
        }
      },
      done: {
        options: {
          message: 'Done!'
        }
      }
    },

    open: {
      stage: {
        path: 'http://evanlovely.github.io/student-sandbox/',
        app: 'Google Chrome'
      },
      repo: {
        path: 'https://github.com/EvanLovely/student-sandbox'
      },
      config_grunt: {
        path: 'Gruntfile.js'
      },
      config_bundler: {
        path: 'Gemfile'
      },
      config_compass: {
        path: 'config.rb'
      },
      config_bower: {
        path: 'bower.json'
      }
    },

  });

  require('load-grunt-tasks')(grunt); // loads ALL dependencies in package.json. So this is not needed: `grunt.loadNpmTasks('grunt-contrib-connect');`

  // just playing around
//    grunt.registerTask('testlog', "let us test the log", function() {
//        grunt.task.run('build');
//        grunt.log.error('TESasdfT');
//    });
//
//    grunt.task.registerTask('foo', 'A sample task that logs stuff.', function(arg1, arg2) {
//        if (arguments.length === 0) {
//            grunt.log.writeln(this.name + ", no args");
//        } else {
//            grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
//        }
//    });

  grunt.registerTask('cleanup_font_icon_build', 'Renaming some stuff', function() {
    grunt.file.copy('source/_patterns/00-atoms/04-images/icons.html', 'source/_patterns/00-atoms/04-images/icons.mustache');
    grunt.file.delete('source/_patterns/00-atoms/04-images/icons.html');
  });

  grunt.registerTask('watch_compass', 'compass:watch');
  grunt.registerTask('watch_pl', 'shell:pattern_lab_watch');
  grunt.registerTask('build', [
//    'create_icons',
    'compass:compile',
    'wiredep',
    'shell:pattern_lab_build',
    'notify:build'
  ]);
  grunt.registerTask('update', [
    'shell:update_bundler',
    'shell:update_node',
    'shell:update_bower'
  ]);
  grunt.registerTask('deploy', [
    'shell:deploy',
    'notify:done'
  ]);
  grunt.registerTask('create_font_icons', [
    'webfont:icons',
    'cleanup_font_icon_build'
  ]);

  grunt.registerTask('default', [
    'update',
    'build',
    'parallel:watch'
  ]);
};






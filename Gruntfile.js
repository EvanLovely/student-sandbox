module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jekyll: {// https://github.com/dannygarcia/grunt-jekyll
      build: {                             
        options: {                     
          bundleExec: true,
          serve: false,
          watch: false
        }
      }
    },

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
      install_bundler: {
        command: 'bundle install'
      },
      install_bower: {
        command: 'bower install'
      },
      install_node: {
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
          '**/*',
          '!_site/**/*',
          '!**/scss/**', // watch:scss has this
          '!**/css/**', // watch:scss has this
          '!**/node_modules/**', // IGNORE node
          '!**/bower_components/**' // IGNORE bower_components
        ],
        tasks: ['jekyll:build']
      },
      scss: {
        files: [
          'scss/**/*.scss'
        ],
        tasks: [
          'compass:compile',
          'jekyll:build'
        ]
      },
      public: {
        options: {
          livereload: true
        },
        files: ['_site/*']
      },
      js_for_errors: {
        files: ['js/*.js'],
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
          }
          // {
          //   grunt: true,
          //   stream: true,
          //   args: ['watch:js_for_errors']
          // }
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

  grunt.registerTask('watch_compass', 'compass:watch');
  grunt.registerTask('build', [
    'compass:compile',
    'jekyll:build',
    'notify:build'
  ]);
  grunt.registerTask('install', [
    'shell:install_bundler',
    'shell:install_node',
    'shell:install_bower'
  ]);

  grunt.registerTask('default', [
    'build',
    'parallel:watch'
  ]);
};






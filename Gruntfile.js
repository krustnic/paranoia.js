module.exports = function(grunt) {

    grunt.initConfig({
        uglify: {
            lib: {
                files: {
                    'paranoia.min.js': ['paranoia.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.registerTask('default', ['uglify']);

};
﻿module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            build: {
                tsconfig: true
            },
            buildTest: {
                tsconfig: true,
                "outDir": "./test/scripts",
                src: ["./scripts/**/*.tests.ts"]
            },
            options: {
                fast: 'never'
            }
        },
        exec: {
            package_dev: {
                command: "tfx extension create --manifest-globs vss-extension.json --overrides-file configs/dev.json --rev-version",
                stdout: true,
                stderr: true
            },
            package_release: {
                command: "tfx extension create --manifest-globs vss-extension.json --overrides-file configs/release.json",
                stdout: true,
                stderr: true
            },
            publish_dev: {
                command: "tfx extension publish --service-url https://marketplace.visualstudio.com --manifest-globs vss-extension.json --overrides-file configs/dev.json",
                stdout: true,
                stderr: true
            },
            publish_release: {
                command: "tfx extension publish --service-url https://marketplace.visualstudio.com --manifest-globs vss-extension.json --overrides-file configs/release.json",
                stdout: true,
                stderr: true
            }
        },
        copy: {
            scripts: {
                files: [{
                    expand: true, 
                    flatten: true, 
                    src: ["node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js"], 
                    dest: "dist",
                    filter: "isFile" 
                }]
            }
        },
        
        clean: ["scripts/**/*.js", "*.vsix", "dist", "test"]
    });
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask("build", ["ts:build", "copy:scripts"]);

    grunt.registerTask("package-dev", ["build", "exec:package_dev"]);
    grunt.registerTask("package-release", ["build", "exec:package_release"]);
    grunt.registerTask("publish-dev", ["package-dev", "exec:publish_dev"]);        
    grunt.registerTask("publish-release", ["package-release", "exec:publish_release"]);        
    
    grunt.registerTask("default", ["package-dev"]);
};
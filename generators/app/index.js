'use strict';

var path = require('path'),
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    s = require('underscore.string');

var BaseAppGenerator = yeoman.generators.Base.extend({

  initializing: function init(){
    this.pkg = require('../../package.json');
  },

  prompting: {
    askForProjectName: function ask(){
      var done = this.async();

      console.log(chalk.magenta('Let\'s kick this pig...'));

      var prompts = [{
        name: 'projectName',
        message: 'Application Name',
        default: this.appname
      },{
        name: 'projectDescription',
        message: 'Project Description',
        default: 'This app is functional, performant, usable and aesthetically pleasing.'
      }];

      this.prompt(prompts, function(props){

        this.projectName = props.projectName;
        this.slugifiedProjectName = s.slugify(props.projectName);
        this.camelizedProjectName = s.camelize(props.projectName, true);
        this.projectDescription = props.projectDescription;

        done();
      }.bind(this));

    }
  },

  writing: function app(){
    this.template('_index.html', 'index.html');
    this.template('_bower.json', 'bower.json');
    this.template('_package.json', 'package.json');

    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
    this.copy('gulpfile.js');


    this.template('assets/css/main.css', 'assets/css/main.css');

    this.template('scss/main.scss', 'scss/main.scss');
    this.template('scss/base/_layout.scss', 'scss/base/_layout.scss');
    this.template('scss/base/_variables.scss', 'scss/base/_variables.scss');
    this.template('scss/modules/_core.scss', 'scss/modules/_core.scss');
    this.template('scss/overrides/_bootstrap.scss', 'scss/overrides/_bootstrap.scss');
    this.template('scss/tools/_mixins.scss', 'scss/tools/_mixins.scss');

    this.template('modules/app.module.js', 'modules/app.module.js');

    this.directory('modules/core');
  },

  finalizing: function finalizing(){
    this.installDependencies();
  }


});

module.exports = BaseAppGenerator;

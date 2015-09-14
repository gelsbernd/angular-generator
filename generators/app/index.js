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

      console.log(chalk.magenta('Kickin this thing off...'));

      var prompts = [{
        name: 'projectName',
        message: 'Application Name',
        default: this.appname
      },{
        name: 'projectDescription',
        message: 'Project Description',
        default: 'My app is cool, you know you like it.'
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


    this.mkdir('assets');
    this.mkdir('assets/css');
    this.template('assets/css/main.css', 'assets/css/main.css');

    this.mkdir('scss');
    this.template('scss/main.scss', 'scss/main.scss');
    this.mkdir('scss/base');
    this.template('scss/base/_layout.scss', 'scss/base/_layout.scss');
    this.template('scss/base/_variables.scss', 'scss/base/_variables.scss');
    this.mkdir('scss/modules');
    this.template('scss/modules/_core.scss', 'scss/modules/_core.scss');
    this.mkdir('scss/overrides');
    this.template('scss/overrides/_bootstrap.scss', 'scss/overrides/_bootstrap.scss');
    this.mkdir('scss/tools');
    this.template('scss/tools/_mixins.scss', 'scss/tools/_mixins.scss');

    this.mkdir('modules');
    this.mkdir('modules/core');
    this.template('modules/app.module.js', 'modules/app.module.js');

    this.directory('modules/core');
  },

  finalizing: function finalizing(){
    this.installDependencies();
  }


});

module.exports = BaseAppGenerator;

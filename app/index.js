
	/* global __dirname, require, module */
	"use strict";
	var util = require("util");
	var path = require("path");
	var ScriptBase = require("../script-base.js");

	/*jshint unused: vars */
	var openui5Generator = module.exports = function openui5Generator(args, options, config) {
		ScriptBase.apply(this, arguments);
		console.log(this.yeoman);

		this.on("end", function() {
			this.installDependencies({
				skipInstall: options["skip-install"]
			});
		});

		this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, "../package.json")));
	};

	util.inherits(openui5Generator, ScriptBase);



	/**
	 * Generator prompts for configuration - basic prompts for all apps
	 */
	openui5Generator.prototype.askForBasics = function() {
		this.promptForBasicDetails();
	};



	/**
	 * Generator prompts for configuration
	 */
	openui5Generator.prototype.askForApplication = function askFor() {
        var cb = this.async();

        var prompts = [
            {
                name: "applicationType",
                type: "list",
                message: "What type of application do you want?",
                choices: [
                    {
                        name: "Classical",
                        value: "classical"
                    }
                ]
            },
            { // Only ask these questions if fiori-type app is chosen
                when: function (response) {
                    return (response.applicationType === "fiori" || response.applicationType === "tiles");
                },
                name: "fioriComponentNamespace",
                message: "What component namespace do you want?",
                default: "sap.ui.demo"
            },
            { // Only ask these questions if classical app is chosen
                when: function (response) {
                    return (response.applicationType === "classical");
                },
                type: "list",
                name: "viewType",
                message: "What view type would you like?",
                choices: [
                    {
                        name: "JS View",
                        value: "jsView"
                    },
                    {
                        name: "XML View",
                        value: "xmlView"
                    }
                ]
            }
        ];

        openui5Generator.prototype.askForUI5Location = function () {
            this.promptForUI5Location();
        };


        openui5Generator.prototype.askForBuildOptions = function () {
            var cb = this.async();

            var prompts = [
                {
                    name: "localServerPort",
                    message: "What port should the local server use?",
                    default: "8088"
                },
                {
                    type: "confirm",
                    name: "liveReload",
                    message: "Enable live-reload of browser?",
                    default: true
                }
            ];

            this.prompt(prompts, function (props) {
                this.localServerPort = props.localServerPort;
                this.liveReload = props.liveReload;

                cb();
            }.bind(this));
        };


        /**
         * Scaffolding of the common project files, which are needed for every project type
         *
         * @return {[type]} [description]
         */
        openui5Generator.prototype.projectFiles = function projectfiles() {
            this.copy("jshintrc", ".jshintrc");
            this.template("Gruntfile.js", "Gruntfile.js");
            this.template("_bower.json", "bower.json");
            this.template("_package.json", "package.json");
            this.template("gitignore", ".gitignore");
            this.template("_README.md", "README.md");
        };


        /**
         * Scaffolding for the classical application dependent project files.
         * This is only executed when application type "classical" is selected
         */
        openui5Generator.prototype.classicalApplication = function app() {
            if (this.applicationType !== "classical") {
                return;
            }

            this.mkdir("css");
            this.copy("application/css/style.css", "css/style.css");

            this.mkdir("ext");
            this.copy("gitkeep", "ext/.gitkeep");

            this.mkdir("test");
            this.copy("gitkeep", "test/.gitkeep");

            this.mkdir("i18n");
            this.copy("application/i18n/messageBundle.properties", "i18n/messageBundle.properties");

            this.mkdir("img");
            this.copy("gitkeep", "img/.gitkeep");

            this.mkdir("model");
            this.copy("application/model/Config.js", "model/Config.js");
            this.copy("application/model/img.json", "model/img.json");

            this.mkdir("util");
            this.copy("gitkeep", "util/.gitkeep");

            this.mkdir("view");

            if (this.viewType === "jsView") {
                this.template("application/view/_Main.view.js", "view/Main.view.js");
            } else {
                this.template("application/view/_Main.view.xml", "view/Main.view.xml");
            }

            this.template("application/view/_Main.controller.js", "view/Main.controller.js");

            this.template("application/_index.html", "index.html");
            this.template("application/_Application.js", "Application.js");
        };


    }
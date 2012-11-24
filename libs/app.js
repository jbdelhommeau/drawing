//A example Backbone application
$(function(){

	window.draw = {},
	draw.currentGroup = 1;

	/*Application tools*/
	draw.tools = {
		tooglePage : function(page){
			$(".nav li").removeClass("active");
			$(".nav .nav-" + page).addClass	("active");
			$(".page-container").hide();
			$("#page-" + page).show();
		},
		calculatingStats : function(people){
			console.log(people);
			var returnStats = 0,
				sumPeople = people.length,
				groupByGroup = _.groupBy(people, function(person){
				return person.group;
			});
			_.each(groupByGroup, function(group){
				returnStats += (group.length * (sumPeople - group.length));
			});
			return returnStats;
		},
	};


	/*Backbone Router*/
	draw.appRouter = Backbone.Router.extend({
		routes: {
			"home":    "home",    // #home
			"people": "people",  // #people
			"draws":  "draws"   // #draw
		},
	  home: function() {
		console.log("page home");
		draw.tools.tooglePage("home");
	  },
	  people: function() {
		console.log("page people");
		draw.tools.tooglePage("people");
	  },
	  draws: function() {
		console.log("page draws");
		draw.tools.tooglePage("draws");
	  }
	});

	new draw.appRouter();
	Backbone.history.start();

	/*Backbone model Person*/
	draw.Person = Backbone.Model.extend({
		name : "Anonymous",
		group : 0,
		clear: function() {
			this.destroy();
		}
	});
	
	/*Backbone collection People*/
	draw.PeopleList = Backbone.Collection.extend({
		model : draw.Person,
		localStorage: new Store("pepole-backbone"),
		comparator: function(person) {
			return person.get('group');
		}
	});

	var People = new draw.PeopleList;

	/*Backbone views*/
	draw.PersonView = Backbone.View.extend({
		tagName : "tr",
		className : "item-person",
		template : _.template($("#template-item-person").html()),
		events : {
			"click .destroy": "clear"
		},
		initialize: function() {
			this.model.on("change", this.render, this);
			this.model.on("destroy", this.remove, this);
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		clear: function(){
			this.model.clear();
		}
	});

	draw.appGroupView = Backbone.View.extend({
		el : $("#content-group"),
		template : _.template($("#template-content-group").html()),
		initialize : function(){
			this.currentGroup = draw.currentGroup;
		},
		events : {
			"click #btnGroupDown": "groupDown",
			"click #btnGroupUp": "groupUp",
			//"click .destroy": "clear"
		},
		render: function(){
			this.$el.html(this.template({"current_group": this.currentGroup}));
			this.inputGroup = this.$("#inputGroup");
			return this;
		},
		groupDown: function(){
			if(this.currentGroup > 1)
				this.currentGroup--;
				this.render();
		},
		groupUp: function(){
			if(this.currentGroup < 9)
				this.currentGroup++;
				this.render();
		}
	});

	draw.appPersonView = Backbone.View.extend({
		el : $("#page-people"),
		events : {
			"keypress #inputPerson": "createPerson",
			"click #btn_add_person": "createPerson",
		},
		initialize : function(){
			console.log(this.el);
			this.inputPerson = this.$("#inputPerson"),

			//People.on('add', this.addOne, this);
			People.on('all', this.render, this);
			People.on('reset', this.addAll, this);

			this.appGroupView = new draw.appGroupView;
			this.appGroupView.render();

			People.fetch();
		},
		render : function(){
			//alert("render");
		},
		addOne: function(person) {
			var view = new draw.PersonView({model: person});
			this.$("#listOfPeople").append(view.render().el);
		},

		addAll: function() {
		  People.each(this.addOne);
		},

		createPerson: function(e) {
			if(e.type != "keypress" && e.type != "click") return;
			if(e.keyCode != 13 && e.type == "keypress") return;
			if (!this.inputPerson.val()) return;
			this.$("#listOfPeople").empty();
			People.create({name: this.inputPerson.val(), group: this.appGroupView.inputGroup.val()});
			People.trigger("reset");
			this.inputPerson.val('').focus();
		},

	});


	draw.appDrawStatsView = Backbone.View.extend({
		el : $("#content_stats"),
		template : _.template($("#template-draw-stats").html()),
		initialize : function(){
			People.on('all', this.render, this);
		},
		render: function(){
			this.$el.html(this.template({
				"countPerson": People.length,
				"countStat": draw.tools.calculatingStats(People.toJSON()),
			}));
			return this;
		}
	});


	draw.appDrawsView = Backbone.View.extend({
		el : $("#page-draws"),
		events : {
			"click #launch-draw": "launchADraw",
		},
		initialize : function(){
			this.appDrawStatsView = new draw.appDrawStatsView;
			this.appDrawStatsView.render();

		},
		launchADraw: function(e) {

		}
	});



	var AppPerson = new draw.appPersonView;
	var AppDraws = new draw.appDrawsView;

});
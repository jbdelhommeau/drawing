//A example Backbone application
$(function(){

	window.draw = {},
	draw.currentGroup = 1;

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

	});

	var People = new draw.PeopleList;

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
		events : {
			//"click .destroy": "clear"
		},
		render: function(){
			this.$el.html(this.template());
			return this;
		},
	});


	draw.appPersonView = Backbone.View.extend({
		el : $("#page-people"),
		events : {
			"keypress #inputPerson": "createOnEnter",
			"click #btnGroupDown": "groupDown",
			"click #btnGroupUp": "groupUp",
		},
		initialize : function(){
			this.input = this.$("#inputPerson");

			People.on('add', this.addOne, this);
	    	People.on('all', this.render, this);
	    	People.on('reset', this.addAll, this);

	    	People.fetch();
		},
		render : function(){


		},
	    addOne: function(person) {
	      var view = new draw.PersonView({model: person});
	      this.$("#listOfPeople").append(view.render().el);
	    },

	    // Add all items in the **Todos** collection at once.
	    addAll: function() {
	      People.each(this.addOne);
	    },

	    // If you hit return in the main input field, create new **Todo** model,
	    // persisting it to *localStorage*.
	    createOnEnter: function(e) {
	      if (e.keyCode != 13) return;
	      if (!this.input.val()) return;

	      People.create({name: this.input.val(), group: 1});
	      this.input.val('');
	    },

	    groupDown: function(e) {
	    	draw
	    },

	    groupUp: function(e) {

	    }

	});

	new draw.appGroupView;
	var App = new draw.appPersonView;


	draw.tools = {};
	draw.tools.tooglePage = function(page){
		$(".nav li").removeClass("active");
		$(".nav .nav-" + page).addClass	("active");
		$(".page-container").hide();
		$("#page-" + page).show();
	};

	draw.appRouter = Backbone.Router.extend({
	  routes: {
	    "home":    "home",    // #help
	    "people": "people",  // #search/kiwis
	    "draw":  "draw"   // #search/kiwis/p7
	  },
	  home: function() {
	    console.log("page home");
	    draw.tools.tooglePage("home");
	  },
	  people: function() {
	    console.log("page people");
	    draw.tools.tooglePage("people");
	  },
	  draw: function() {
	  	console.log("page draw");
	  	draw.tools.tooglePage("draw");
	  }
	});

	new draw.appRouter();
	Backbone.history.start();


});
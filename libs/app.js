//A example Backbone application
$(function(){

	window.draw = {};

	/*Backbone model Person*/
	draw.Person = Backbone.Model.extend({
		name : "toto",
		group : "Group 1",
		clear: function() {
      		this.destroy();
    	}
	});
	
	/*Backbone collection Persons*/
	draw.PersonsList = Backbone.Collection.extend({
		model : draw.Person,
		localStorage: new Store("persons-backbone"),

	});

	var Persons = new draw.PersonsList;

	draw.PersonView = Backbone.View.extend({
		tagName : "tr",
		className : "item-person",
		template : _.template($("#item-person").html()),
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

	draw.appPersonView = Backbone.View.extend({
		el : $("#page-persons"),
		events : {
			"keypress #inputPerson": "createOnEnter"
		},
		initialize : function(){
			this.input = this.$("#inputPerson");

			Persons.on('add', this.addOne, this);
	    	Persons.on('all', this.render, this);
	    	Persons.on('reset', this.addAll, this);


	    	Persons.fetch();
		},
		render : function(){
		},
	    addOne: function(person) {
	      var view = new draw.PersonView({model: person});
	      this.$("#listOfPersons").append(view.render().el);
	    },

	    // Add all items in the **Todos** collection at once.
	    addAll: function() {
	      Persons.each(this.addOne);
	    },

	    // If you hit return in the main input field, create new **Todo** model,
	    // persisting it to *localStorage*.
	    createOnEnter: function(e) {
	      if (e.keyCode != 13) return;
	      if (!this.input.val()) return;

	      Persons.create({name: this.input.val(), group: "Group 1"});
	      this.input.val('');
	    }

	});

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
	    "persons": "persons",  // #search/kiwis
	    "draw":  "draw"   // #search/kiwis/p7
	  },
	  home: function() {
	    console.log("page home");
	    draw.tools.tooglePage("home");
	  },
	  persons: function() {
	    console.log("page persons");
	    draw.tools.tooglePage("persons");
	  },
	  draw: function() {
	  	console.log("page draw");
	  	draw.tools.tooglePage("draw");
	  }
	});

	new draw.appRouter();
	Backbone.history.start();


});
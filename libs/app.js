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
			if(this.currentGroup < 100)
				this.currentGroup++;
				this.render();
		}
	});

	draw.appPersonView = Backbone.View.extend({
		el : $("#page-people"),
		events : {
			"keypress #inputPerson": "createOnEnter",
		},
		initialize : function(){
			console.log(this.el);
			this.inputPerson = this.$("#inputPerson"),

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

	    addAll: function() {
	      People.each(this.addOne);
	    },

	    createOnEnter: function(e) {
	      if (e.keyCode != 13) return;
	      if (!this.inputPerson.val()) return;
	      People.create({name: this.inputPerson.val(), group: appGroupView.inputGroup.val()});
	      this.inputPerson.val('');
	    },

	});

	var appGroupView = new draw.appGroupView;
	appGroupView.render();

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
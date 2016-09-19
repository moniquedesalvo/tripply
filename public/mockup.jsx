window.title = "Fall Vacation: October 21-24"

window.choices = [
	{ 
		location: "Big Sur, CA",
		price: "$240",
		image: "https://a2.muscache.com/im/pictures/3c8d3246-f27c-4044-9a2e-e0a6c78d5296.jpg?aki_policy=large",
		description: "Gorgeous Ocen Front Property", 
		likes: 2
	},
	{
		location: "Big Sur, CA",
		price: "$355",
		image: "https://a2.muscache.com/im/pictures/43006829/fbb07cff_original.jpg?aki_policy=large",
		description: "4 Bedroom Cottage in the Woods",
		likes: 5
	},
	{
		location: "Monterey, CA",
		price: "$534",
		image: "https://a0.muscache.com/im/pictures/36575928/b6ec565d_original.jpg?aki_policy=xx_large",
		description: "Lovely Home with Hot Tub",
		likes: 3
	}
];


var Title = React.createClass({
	render: function () {
		return (
			<div className="title">
				<h1>{title}</h1>
			</div>
		);
	}
})

var VacationChoices = React.createClass({
	render: function () {

		var locationElements = [];
		for (var i = 0; i < choices.length; i++) {
			locationElements.push(
				<div className="vacation-choice">
					<h3>{choices[i].location} - {choices[i].price}</h3>
					<img src={choices[i].image}/>
					<h3>{choices[i].description}</h3>
					<h3>❤️ {choices[i].likes}</h3>
				</div>
			);
		}

 		return (
			<div id="locations">
				{locationElements}	
			</div>
		);
	}
})

var ChooseDestinations = React.createClass({


	render: function () {

		return (
			<div id="choice-inputs">
				<h2>Add up to three AirBnB URLs:</h2>
				<h3>Choice 1: </h3><input type="text" size="50" ref="linkInput1"></input>
				<h3>Choice 2: </h3><input type="text" size="50" ref="linkInput2"></input>
				<h3>Choice 3: </h3><input type="text" size="50" ref="linkInput3"></input><br/>				
				<button onClick={this.addLinks}>Add</button>
			</div>
		);
	},

	addLinks: function () {
		var linkInput1 = this.refs.linkInput1;
		var linkUrl1 = linkInput1.value;
		var linkInput2 = this.refs.linkInput2;
		var linkUrl2 = linkInput2.value;
		var linkInput3 = this.refs.linkInput3;
		var linkUrl3 = linkInput3.value;
		$.getJSON( "airbnbInfo?url=" + linkUrl1, function( data ) {
  			choices[0] = data;
  			renderApp();
		});
		$.getJSON( "airbnbInfo?url=" + linkUrl2, function( data ) {
  			choices[1] = data;
  			renderApp();
		});
		$.getJSON( "airbnbInfo?url=" + linkUrl3, function( data ) {
  			choices[2] = data;
  			renderApp();	
		});
		linkInput1.value = "";
		linkInput2.value = "";
		linkInput3.value = "";
	}
});




var App = React.createClass({
	render: function () {
		return (
			<div id="main">
				<div id="location-section">
					<Title />
					<VacationChoices />
					<ChooseDestinations />
				</div>
			</div>
		)
	}
});


window.renderApp = function() {
  ReactDOM.render(<App />, document.getElementById("container"));
}

renderApp();
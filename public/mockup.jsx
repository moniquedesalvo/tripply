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

window.attendees = [
	{
		name: "Charlene",
		status: "paid",
		notes: "Room for 2 more in my car"
	},
	{
		name: "Kiki",
		status: "pay",
		notes: "Leaving Saturday"
	}
];

window.packing = [
	{
		thingsToBring: "Dinner Saturday",
		whosBringingIt: "Gabe",
		notes: "Carnitas!"
	},
	{
		thingsToBring: "Settler's of Catan",
		whosBringingIt: "Myshel",
		notes: "Game night! Woooooo!"
	},
	{
		thingsToBring: "Catnip",
		whosBringingIt: "Charlene",
		notes: "Meow"
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
				<div className="vacation-choice" key={i}>
					<h3>{choices[i].location} - {choices[i].price} Per Night</h3>
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
			<div id="choice-input-section">
				<h2>Add up to three AirBnB URLs:</h2>
				<div id="choice-inputs">
					<h3>Choice 1:</h3><input type="text" size="50" ref="linkInput1"></input>
					<h3>Choice 2:</h3><input type="text" size="50" ref="linkInput2"></input>
					<h3>Choice 3:</h3><input type="text" size="50" ref="linkInput3"></input><br/>
				</div>				
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

var AttendeesSection = React.createClass({
	render: function () {
		var attendeesElements = [];
		for (var i = 0; i < attendees.length; i++) {
			attendeesElements.push(
				<AttendeesRow index={i} key={i}/>
        	)
		}
		return (
			<div id="attendees-section">
				<h2>Attendees:</h2>
				<table>
					<tbody>
			            <tr>
			            	<th>Name</th>
			                <th>Status</th> 
			                <th>Notes</th>
			            </tr>
						{attendeesElements}
						<tr>
							<td><input type="text" size="50" ref="nameInput"></input></td>
							<td><input type="text" size="50" ref="statusInput"></input></td>
							<td><input type="text" size="50" ref="notesInput"></input></td>
						</tr>
					</tbody>
	            </table>
	            <button onClick={this.addAttendees}>Add</button>
          	</div>
		)
	},

	addAttendees: function () {
		var nameInput = this.refs.nameInput;
		var nameText = nameInput.value;
		var statusInput = this.refs.statusInput;
		var statusText = statusInput.value;
		var notesInput = this.refs.notesInput;
		var notesText = notesInput.value;
		attendees.push(
			{
				name: nameText,
				status: statusText,
				notes: notesText
			}
		)
		nameInput.value = "";
		statusInput.value = "";
		notesInput.value = "";
		renderApp();
	}
});

var AttendeesRow = React.createClass({
	getInitialState: function () {
		return {
			isEditingName: false,
			isEditingNotes: false
		}
	},
	render: function () {
		console.log(this.state)
		var i = this.props.index;
		if (this.state.isEditingName === true) {
			var nameElement = <input type="text" size="50" ref="nameInput" defaultValue={attendees[i].name}></input>
		} else {
			nameElement = attendees[i].name;
		}
		return (
			<tr>
				<td onClick={this.toggleEditOn} onBlur={this.toggleEditOff}>{nameElement}</td>
				<td onClick={this.togglePaid}>{attendees[i].status}</td> 
				<td onClick={this.toggleEdit}>{attendees[i].notes}</td>
			</tr>
		)
	},
	togglePaid: function () {
		var i = this.props.index;
		if (attendees[i].status === "unpaid") {
			attendees[i].status = "paid";
		} else {
			attendees[i].status = "unpaid";
		}
		renderApp();
	},
	toggleEditOn: function () {
		if (!this.state.isEditingName) {
			this.setState({isEditingName: true})
		}
	},
	toggleEditOff: function () {
		var i = this.props.index;
		if (this.state.isEditingName) {
			this.setState({isEditingName: false})
			var nameInput = this.refs.nameInput;
			var nameText = nameInput.value;
			attendees[i].name = nameText;
		}
	}
})

var PackingSection = React.createClass({
	render: function () {
		var packingElements = [];
		for (var i = 0; i < packing.length; i++) {
			packingElements.push(
				<PackingRow index={i} key={i}/>
        	)
		}
		return (
			<div id="packing-section">
				<h2>Packing:</h2>
				<table>
					<tbody>
			            <tr>
			            	<th>Things to Bring</th>
			                <th>Who's Bringing It</th> 
			                <th>Notes</th>
			            </tr>
						{packingElements}
						<tr>
							<td><input type="text" size="50" ref="thingsInput"></input></td>
							<td><input type="text" size="50" ref="whoInput"></input></td>
							<td><input type="text" size="50" ref="notesInput"></input></td>
						</tr>
					</tbody>
	            </table>
	            <button onClick={this.addToPacking}>Add</button>
          	</div>
		)
	},

	addToPacking: function () {
		var thingsInput = this.refs.thingsInput;
		var thingsText = thingsInput.value;
		var whoInput = this.refs.whoInput;
		var whoText = whoInput.value;
		var notesInput = this.refs.notesInput;
		var notesText = notesInput.value;
		packing.push(
			{
				thingsToBring: thingsText,
				whosBringingIt: whoText,
				notes: notesText
			}
		)
		thingsInput.value = "";
		whoInput.value = "";
		notesInput.value = "";
		renderApp();
	}
});

var PackingRow = React.createClass({
	render: function () {
		var i = this.props.index;
		return (
			<tr>
				<td>{packing[i].thingsToBring}</td>
				<td>{packing[i].whosBringingIt}</td> 
				<td>{packing[i].notes}</td>
			</tr>
		)
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
					<AttendeesSection />
					<PackingSection />
				</div>
			</div>
		)
	}
});

window.renderApp = function() {
  ReactDOM.render(<App />, document.getElementById("container"));
}

renderApp();
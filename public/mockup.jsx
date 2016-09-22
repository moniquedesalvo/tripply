window.title = "Fall Vacation: October 21-24"

window.choices = [
	{ 
		location: "Big Sur, CA",
		price: "$240",
		image: "https://a2.muscache.com/im/pictures/3c8d3246-f27c-4044-9a2e-e0a6c78d5296.jpg?aki_policy=large",
		description: "Gorgeous Ocen Front Property", 
		likes: 2, 
		link: "",
		booked: false
	},
	{
		location: "Big Sur, CA",
		price: "$355",
		image: "https://a2.muscache.com/im/pictures/43006829/fbb07cff_original.jpg?aki_policy=large",
		description: "4 Bedroom Cottage in the Woods",
		likes: 5,
		link: "",
		booked: false
	},
	{
		location: "Monterey, CA",
		price: "$534",
		image: "https://a0.muscache.com/im/pictures/36575928/b6ec565d_original.jpg?aki_policy=xx_large",
		description: "Lovely Home with Hot Tub",
		likes: 3,
		link: "",
		booked: false
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
		status: "unpaid",
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


var TitleSection = React.createClass({
	render: function () {
		return (
			<div className="title-section">
				<h1>{title}</h1>
			</div>

		);
	}
})

var VacationChoices = React.createClass({
	getInitialState: function () {
		return {
			isEditing: false
		}
	},
	render: function () {
		var isEditing = this.state.isEditing;
		var locationElements = [];
		for (var i = 0; i < choices.length; i++) {
			locationElements.push(
				<VacationChoice index={i} key={i} isEditing={isEditing}/>
			);
		}

		if (isEditing === true) {
			var topEditButton = null;
		} else {
			var topEditButton = <button onClick={this.editModeOn}>Edit</button>;
		}
		if (isEditing === false) {
			var bottomEditButton = null;
		} else {
			bottomEditButton = <button onClick={this.editModeOff}>Done Editing</button>
		}

 		return (
 			<div>
	 			<div>
	 				<h2>Vote on a Place to Stay: {topEditButton}</h2>
	 			</div>
				<div id="locations">
					{locationElements}	
				</div>
				<div>
					{bottomEditButton}
				</div>
			</div>
		);
	},
	editModeOn: function () {
		this.setState({isEditing: true})
	},
	editModeOff: function () {
		this.setState({isEditing: false}) 
	}
})

var VacationChoice = React.createClass({
	render: function () {
		var i = this.props.index;
		var isEditing = this.props.isEditing;
		if (isEditing === true) {
			var view = 
				<div className="vacation-choice" key={i}>
					<h3>{choices[i].location} - {choices[i].price} Per Night</h3>
					<a href={choices[i].link}><div className="choice-img"><img src={choices[i].image}/></div></a>
					<h3>{choices[i].description}</h3>
					<VoteSection index={i}/><button onClick={this.toggleBooked}>Booked It!</button><br/>
					<input type="text" size="50" ref="linkInput" onKeyDown={this.enterSubmit} placeholder="Paste AirBnb Url"></input>
				</div>
		} else {
			view = 
				<div className="vacation-choice" key={i}>
					<h3>{choices[i].location} - {choices[i].price} Per Night</h3>
					<a href={choices[i].link}><div className="choice-img"><img src={choices[i].image}/></div></a>
					<h3>{choices[i].description}</h3>
					<VoteSection index={i}/>
				</div>
		}
		return (
			view
		)
	},
	addLink: function () {
		var i = this.props.index;
		var linkInput = this.refs.linkInput;
		var linkUrl = linkInput.value;
		$.getJSON("airbnbInfo?url=" + linkUrl, function (data) {
			choices[i] = data;
  			choices[i].likes = 0;
  			choices[i].link = linkUrl;
  			renderApp();
		});
		linkInput.value = "";
	}, 
	enterSubmit: function (event) {
		if (event.keyCode === 13) {
			this.addLink();
		}
	},
	toggleBooked: function () {
		var i = this.props.index;
		choices[i].booked = true;
		renderApp();
	}
})

var Booked = React.createClass({
	render: function () {
		var i = this.props.index;
		return (
			<div id="booked">
	            <img src={choices[i].image}/>
	            <button onClick={this.unBook}>Back</button>
	        </div>
        )
	},
	unBook: function () {
		var i = this.props.index;
		choices[i].booked = false;
		renderApp();
	}
})

var VoteSection = React.createClass({
	getInitialState: function () {
		return {
			hasVoted: false
		}
	},
	render: function () {
		var i = this.props.index;
		if (this.state.hasVoted === true) {
			console.log(this.state)
			var heartFill = <span className="heart"><img onClick={this.removeVote} src="images/heart-filled_thick.png"/><h3>{choices[i].likes}</h3></span>
		} else {
			heartFill = <span className="heart"><img onClick={this.addVote} src="images/heart-outline_thick.png"/><h3>{choices[i].likes}</h3></span>
		}
		return (
			heartFill
		)
	},
	addVote: function () {
		var i = this.props.index;
		console.log('add vote called')
		if (this.state.hasVoted === false) {
			this.setState({hasVoted: true})
			choices[i].likes += 1;
			renderApp()	
		}
	},
	removeVote: function () {
		var i = this.props.index;
		console.log('remove vote called')
		if (this.state.hasVoted === true) {
			this.setState({hasVoted: false})
			choices[i].likes -= 1;
			renderApp()	
		}
	}
})

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
							<td></td>
							<td></td>
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
		attendees.push(
			{
				name: nameText,
				status: "unpaid",
				notes: "+"
			}
		)
		nameInput.value = "";
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
		var i = this.props.index;
		if (this.state.isEditingName === true) {
			var nameElement = <input type="text" size="50" ref="nameInput" defaultValue={attendees[i].name}></input>
		} else {
			nameElement = attendees[i].name;
		}
		if (this.state.isEditingNotes === true) {
			var notesElement = <input type="text" size="50" ref="notesInput" defaultValue={attendees[i].notes}></input>
		} else {
			notesElement = attendees[i].notes;
		}
		return (
			<tr>
				<td onClick={this.toggleEditOnName} onBlur={this.toggleEditOffName} onKeyDown={this.enterSubmitName}>{nameElement}</td>
				<td onClick={this.togglePaid}>{attendees[i].status}</td> 
				<td onClick={this.toggleEditOnNotes} onBlur={this.toggleEditOffNotes} onKeyDown={this.enterSubmitNotes}>{notesElement}</td>
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
	toggleEditOnName: function () {
		if (!this.state.isEditingName) {
			this.setState({isEditingName: true})
		}
	},
	toggleEditOnNotes: function () {
		if (!this.state.isEditingNotes) {
			this.setState({isEditingNotes: true})
		}
	},
	toggleEditOffName: function () {
		var i = this.props.index;
		if (this.state.isEditingName) {
			this.setState({isEditingName: false})
			var nameInput = this.refs.nameInput;
			var nameText = nameInput.value;
			attendees[i].name = nameText;
		}
	},
	toggleEditOffNotes: function () {
		var i = this.props.index;
		if (this.state.isEditingNotes) {
			this.setState({isEditingNotes: false})
			var notesInput = this.refs.notesInput;
			var notesText = notesInput.value;
			attendees[i].notes = notesText;
		}
	},
	enterSubmitName: function (event) {
		if (event.keyCode === 13) {
			this.toggleEditOffName();
		}
	},
	enterSubmitNotes: function (event) {
		if (event.keyCode === 13) {
			this.toggleEditOffNotes();
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
							<td></td>
							<td></td>
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
		packing.push(
			{
				thingsToBring: thingsText,
				whosBringingIt: "+",
				notes: "+"
			}
		)
		thingsInput.value = "";
		renderApp();
	}
});

var PackingRow = React.createClass({
	getInitialState: function () {
		return {
			isEditingThingsToBring: false,
			isEditingWhosBringingIt: false,
			isEditingNotes: false
		}
	},
	render: function () {
		var i = this.props.index;
		if (this.state.isEditingThingsToBring === true) {
			var thingsElement = <input type="text" size="50" ref="thingsInput" defaultValue={packing[i].thingsToBring}></input>
		} else {
			thingsElement = packing[i].thingsToBring;
		}
		if (this.state.isEditingWhosBringingIt === true) {
			var whoElement = <input type="text" size="50" ref="whoInput" defaultValue={packing[i].whosBringingIt}></input>
		} else {
			whoElement = packing[i].whosBringingIt;
		}
		if (this.state.isEditingNotes === true) {
			var notesElement = <input type="text" size="50" ref="notesInput" defaultValue={packing[i].notes}></input>
		} else {
			notesElement = packing[i].notes;
		}
		return (
			<tr>
				<td onClick={this.toggleEditOnThings} onBlur={this.toggleEditOffThings} onKeyUp={this.enterSubmitThings}>{thingsElement}</td>
				<td onClick={this.toggleEditOnWho} onBlur={this.toggleEditOffWho} onKeyUp={this.enterSubmitWho}>{whoElement}</td> 
				<td onClick={this.toggleEditOnNotes} onBlur={this.toggleEditOffNotes} onKeyUp={this.enterSubmitNotes}>{notesElement}</td>
			</tr>
		)
	},
	toggleEditOnThings: function () {
		if (!this.state.isEditingThingsToBring) {
			this.setState({isEditingThingsToBring: true})
		}
	},
	toggleEditOnWho: function () {
		if (!this.state.isEditingWhosBringingIt) {
			this.setState({isEditingWhosBringingIt: true})
		}
	},
	toggleEditOnNotes: function () {
		if (!this.state.isEditingNotes) {
			this.setState({isEditingNotes: true})
		}
	},
	toggleEditOffThings: function () {
		var i = this.props.index;
		if (this.state.isEditingThingsToBring) {
			this.setState({isEditingThingsToBring: false})
			var thingsInput = this.refs.thingsInput;
			var thingsText = thingsInput.value;
			packing[i].thingsToBring = thingsText;
		}
	},
	toggleEditOffWho: function () {
		var i = this.props.index;
		if (this.state.isEditingWhosBringingIt) {
			this.setState({isEditingWhosBringingIt: false})
			var whoInput = this.refs.whoInput;
			var whoText = whoInput.value;
			packing[i].whosBringingIt = whoText;
		}
	},
	toggleEditOffNotes: function () {
		var i = this.props.index;
		if (this.state.isEditingNotes) {
			this.setState({isEditingNotes: false})
			var notesInput = this.refs.notesInput;
			var notesText = notesInput.value;
			packing[i].notes = notesText;
		}
	},
	enterSubmitThings: function (event) {
		if (event.keyCode === 13) {
			this.toggleEditOffThings();
		}
	},
	enterSubmitWho: function (event) {
		if (event.keyCode === 13) {
			this.toggleEditOffWho();
		}
	},
	enterSubmitNotes: function (event) {
		if (event.keyCode === 13) {
			this.toggleEditOffNotes();
		}
	}
});

var App = React.createClass({
	render: function () {
		return (
			<div id="main">
				<div id="location-section">
					<TitleSection />
					{this.findBooked()}
					<AttendeesSection />
					<PackingSection />
				</div>
			</div>
		)
	},
	findBooked: function () {
		for (var i = 0; i < choices.length; i++) {
			console.log(choices[i])
			if (choices[i].booked === true) {
				console.log("booked, got here")
				return <Booked index={i}/>
			}
		}
		return <VacationChoices />
	}
});

window.renderApp = function() {
  ReactDOM.render(<App />, document.getElementById("container"));
}

renderApp();
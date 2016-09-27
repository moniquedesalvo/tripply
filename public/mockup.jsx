var TitleSection = React.createClass({
	getInitialState: function () {
		return {
			isEditing: false
		}
	},
	render: function () {
		if (this.state.isEditing === true || title === "") {
			var titleDiv = 
				<div className="title-section">
					<h1><input type="text" ref="titleInput" placeholder="Add a title" defaultValue={title} onKeyDown={this.enterSubmitTitle} onBlur={this.toggleEditOff} ></input></h1>
				</div>
		} else {
			titleDiv = 
				<div className="title-section">
					<h1 onClick={this.clickToEdit}>{title}</h1>
				</div>
		}
		return (
			titleDiv
		);
	},
	componentDidUpdate: function () {
		if (this.state.isEditing) {
			this.refs.titleInput.focus();
		}
	},
	clickToEdit: function () {
		this.setState({isEditing: true});
	},
	toggleEditOff: function () {
		if (this.state.isEditing) {
			this.setState({isEditing: false})
			var titleInput = this.refs.titleInput;
			var titleText = titleInput.value;
			title = titleText;
			$.post(window.location.pathname + '/title', {title: titleText})
			renderApp();
		}
	},
	addTitle: function () {
		var titleInput = this.refs.titleInput;
		var titleText = titleInput.value;
		title = titleText;
		$.post(window.location.pathname + '/title', {title: titleText})
		renderApp();
	},
	enterSubmitTitle: function (event) {
		if (event.keyCode === 13) {
			this.setState({isEditing:false})
			this.addTitle();
		}
	}
})

var VacationChoices = React.createClass({
	getInitialState: function () {
		if (choices[0].location) {
			return {isEditing: false}
		} else {
			return {isEditing: true}
		}
	},
	render: function () {
		var isEditing = this.state.isEditing;
		var locationElements = [];
		for (var i = 0; i < choices.length; i++) {
			// if (choices[i].location !== null) {
				locationElements.push(
					<VacationChoice index={i} key={i} isEditing={isEditing}/>
				);
			// }
		}

		if (isEditing === true) {
			var editButton = null;
		} else {
			editButton = <button onClick={this.editModeOn}>Edit</button>;
		}
		if (isEditing === false) {
			var doneEditingButton = null;
		} else {
			doneEditingButton = <button onClick={this.editModeOff}>Done Editing</button>
		}

 		return (
 			<div>
	 			<div>
	 				<h2>Vote on a Place to Stay {editButton}{doneEditingButton}</h2>
	 			</div>
				<div id="locations">
					{locationElements}	
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
					<h3>{choices[i].location} <span className="price">{choices[i].price}</span>&nbsp;</h3>
					<a href={choices[i].link}><div className="choice-img"><img src={choices[i].image}/></div></a>
					<p>{choices[i].description}</p>
					<div className="vote-book"><VoteSection index={i}/><button onClick={this.toggleBooked}>Booked It!</button></div><br/>
					<input type="text" ref="linkInput" onKeyDown={this.enterSubmit} placeholder="Paste AirBnb Url"></input>
				</div>
		} else {
			view = 
				<div className="vacation-choice" key={i}>
					<h3>{choices[i].location} <span className="price">{choices[i].price}</span>&nbsp;</h3>
					<a href={choices[i].link}><div className="choice-img"><img src={choices[i].image}/></div></a>
					<p>{choices[i].description}</p>
					<div className="vote-book"><VoteSection index={i}/></div>
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
			choices[i].location = data.location;
			choices[i].price = data.price;
			choices[i].image = data.image;
			choices[i].description = data.description;
  			choices[i].likes = 0;
  			choices[i].link = linkUrl;
  			choices[i].booked = data.booked;
  			choices[i].images = data.images;
  			$.post('/choices/' + choices[i].id, {
  				location: choices[i].location,
  				price: choices[i].price,
  				image: choices[i].image,
  				description: choices[i].description,
  				likes: choices[i].likes,
  				link: choices[i].link,
  				booked: choices[i].booked,
  				images: choices[i].images
  			})
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
		$.post('/choices/' + choices[i].id, {
  				booked: choices[i].booked})
		renderApp();
	}
})

var Booked = React.createClass({
	render: function () {
		var i = this.props.index;
		var imageElements = [];
		var allImages = choices[i].images
		var imagesArr = allImages.split('\n')
		for (var j = 0; j < imagesArr.length; j++) {
			imageElements.push(
				<BookedImages indexj={j} index={i} key={j} imagesArr={imagesArr}/>
			)
		}
		return (
			<div>
				<div id="booked">
		        	{imageElements}    
				</div>
				<div id="booked-button">
	        		<button onClick={this.unBook}>Back to Choices</button>
	        	</div>
	        </div>
        )
	},
	unBook: function () {
		var i = this.props.index;
		choices[i].booked = false;
		$.post('/choices/' + choices[i].id, {
  				booked: choices[i].booked})
		renderApp();
	}
})

var BookedImages = React.createClass({
	render: function () {
		var i = this.props.index;
		var j = this.props.indexj;
		var imagesArr = this.props.imagesArr;
		return (
			<img src={imagesArr[j]}/> 
		)
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
			var heartFill = <div className="heart"><img onClick={this.removeVote} src="images/heart-filled_thick.png"/>{choices[i].likes}</div>
		} else {
			heartFill = <div className="heart"><img onClick={this.addVote} src="images/heart-outline_thick.png"/>{choices[i].likes}</div>
		}
		return (
			heartFill
		)
	},
	addVote: function () {
		var i = this.props.index;
		if (this.state.hasVoted === false) {
			this.setState({hasVoted: true})
			choices[i].likes += 1;
			$.post('/choices/' + choices[i].id, {
  				likes: choices[i].likes})
			renderApp()	
		}
	},
	removeVote: function () {
		var i = this.props.index;
		if (this.state.hasVoted === true) {
			this.setState({hasVoted: false})
			choices[i].likes -= 1;
			$.post('/choices/' + choices[i].id, {
  				likes: choices[i].likes})
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
				<h2>Attendees</h2>
				<table>
					<tbody>
			            <tr>
			            	<th>Name</th>
			                <th>Status</th> 
			                <th>Notes</th>
			            </tr>
						{attendeesElements}
					</tbody>
	            </table>
	            <input type="text" ref="nameInput" placeholder="Add a name" onKeyDown={this.enterSubmitName}></input>
				<button onClick={this.addAttendees}>Add</button>
          	</div>
		)
	},

	addAttendees: function () {
		var i = this.props.index;
		var nameInput = this.refs.nameInput;
		var nameText = nameInput.value;
		var attendee = {
			name: nameText,
			status: "unpaid",
			notes: ""
		};
		attendees.push(attendee);
		nameInput.value = "";
		$.post(window.location.pathname + '/attendees/create', {
			name: nameText,
			status: "unpaid",
			notes: ""
  		}, function (res) {
  			attendee.id = res;
		});
		renderApp();
	},
	enterSubmitName: function (event) {
		if (event.keyCode === 13) {
			this.addAttendees();
		}
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
			var nameElement = <input type="text" ref="nameInput" defaultValue={attendees[i].name}></input>
		} else {
			nameElement = attendees[i].name;
		}
		if (this.state.isEditingNotes === true) {
			var notesElement = <input type="text" ref="notesInput" defaultValue={attendees[i].notes}></input>
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
	componentDidUpdate: function () {
		if (this.state.isEditingName) {
			this.refs.nameInput.focus();
		}
		if (this.state.isEditingNotes) {
			this.refs.notesInput.focus();
		}
	},
	togglePaid: function () {
		var i = this.props.index;
		if (attendees[i].status === "unpaid") {
			attendees[i].status = "paid";
		} else {
			attendees[i].status = "unpaid";
		}
		$.post('/attendees/' + attendees[i].id, {
  			status: attendees[i].status
  		});
		renderApp();
	},
	toggleEditOnName: function () {
		if (!this.state.isEditingName) {
			this.setState({isEditingName: true});
		}
	},
	toggleEditOnNotes: function () {
		if (!this.state.isEditingNotes) {
			this.setState({isEditingNotes: true});
		}
	},
	toggleEditOffName: function () {
		var i = this.props.index;
		if (this.state.isEditingName) {
			this.setState({isEditingName: false})
			var nameInput = this.refs.nameInput;
			var nameText = nameInput.value;
			attendees[i].name = nameText;
			$.post('/attendees/' + attendees[i].id, {
  				name: attendees[i].name
  			});
		}
	},
	toggleEditOffNotes: function () {
		var i = this.props.index;
		if (this.state.isEditingNotes) {
			this.setState({isEditingNotes: false})
			var notesInput = this.refs.notesInput;
			var notesText = notesInput.value;
			attendees[i].notes = notesText;
			$.post('/attendees/' + attendees[i].id, {
  				notes: attendees[i].notes
  			});
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
				<h2>Packing</h2>
				<table>
					<tbody>
			            <tr>
			            	<th>Things to Bring</th>
			                <th>Who's Bringing It</th> 
			                <th>Notes</th>
			            </tr>
						{packingElements}
					</tbody>
	            </table>
	            <input type="text" ref="thingsInput" placeholder="Add a thing" onKeyUp={this.enterSubmitThings}></input>
				<button onClick={this.addToPacking}>Add</button>
          	</div>
		)
	},
	addToPacking: function () {
		var thingsInput = this.refs.thingsInput;
		var thingsText = thingsInput.value;
		var packingItem = {
			thingsToBring: thingsText,
			whosBringingIt: "",
			notes: ""
		};
		thingsInput.value = "";
		packing.push(packingItem);
		$.post(window.location.pathname + '/packingItem/create', {
			thingsToBring: thingsText,
			whosBringingIt: "",
			notes: ""
  		}, function (res) {
  			console.log(res)
  			packingItem.id = res;
		});
		renderApp();
	},
	enterSubmitThings: function (event) {
		if (event.keyCode === 13) {
			this.addToPacking();
		}
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
			var thingsElement = <input type="text" ref="thingsInput" defaultValue={packing[i].thingsToBring}></input>
		} else {
			thingsElement = packing[i].thingsToBring;
		}
		if (this.state.isEditingWhosBringingIt === true) {
			var whoElement = <input type="text" ref="whoInput" defaultValue={packing[i].whosBringingIt}></input>
		} else {
			whoElement = packing[i].whosBringingIt;
		}
		if (this.state.isEditingNotes === true) {
			var notesElement = <input type="text" ref="notesInput" defaultValue={packing[i].notes}></input>
		} else {
			notesElement = packing[i].notes;
		}
		return (
			<tr>
				<td onClick={this.toggleEditOnThings} onBlur={this.toggleEditOffThings} onKeyDown={this.enterSubmitThings}>{thingsElement}</td>
				<td onClick={this.toggleEditOnWho} onBlur={this.toggleEditOffWho} onKeyDown={this.enterSubmitWho}>{whoElement}</td> 
				<td onClick={this.toggleEditOnNotes} onBlur={this.toggleEditOffNotes} onKeyDown={this.enterSubmitNotes}>{notesElement}</td>
			</tr>
		)
	},
	componentDidUpdate: function () {
		if (this.state.isEditingThingsToBring) {
			this.refs.thingsInput.focus();
		}
		if (this.state.isEditingWhosBringingIt) {
			this.refs.whoInput.focus();
		}
		if (this.state.isEditingNotes) {
			this.refs.notesInput.focus();
		}
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
			$.post('/packing/' + packing[i].id, {
  				thingsToBring: packing[i].thingsToBring
  			});
		}
	},
	toggleEditOffWho: function () {
		var i = this.props.index;
		if (this.state.isEditingWhosBringingIt) {
			this.setState({isEditingWhosBringingIt: false})
			var whoInput = this.refs.whoInput;
			var whoText = whoInput.value;
			packing[i].whosBringingIt = whoText;
			$.post('/packing/' + packing[i].id, {
  				whosBringingIt: packing[i].whosBringingIt
  			});
		}
	},
	toggleEditOffNotes: function () {
		var i = this.props.index;
		if (this.state.isEditingNotes) {
			this.setState({isEditingNotes: false})
			var notesInput = this.refs.notesInput;
			var notesText = notesInput.value;
			packing[i].notes = notesText;
			$.post('/packing/' + packing[i].id, {
  				notes: packing[i].notes
  			});
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

var Details = React.createClass({
	getInitialState: function () {
		if (details)  {
			return {isEditing: false}
		} else {
			return {isEditing: true}
		}
	},
	render: function () {
		if (this.state.isEditing === true) {
			var view =
				<div id="details-section">
					<h2>Details</h2>
					<textarea defaultValue={details} type="text" ref="detailsInput"></textarea>
					<button onClick={this.handleClick}>Done</button>
				</div>
		} else {	
			view = 
				<div id="details-section">
					<h2>Details</h2>
					<p>{details}</p>
					<button onClick={this.toggleEditOn}>Edit</button>
				</div>
		}
		return (
			view
		)
	},
	saveDetails: function () {
		var detailsInput = this.refs.detailsInput;
		var detailsText = detailsInput.value;
		details = detailsText;
		$.post(window.location.pathname + '/details', {details: detailsText})
		renderApp();
	},
	toggleEditOn: function () {
		if (!this.state.isEditing) {
			this.setState({isEditing: true})
		}
	},
	toggleEditOff: function () {
		if (this.state.isEditing) {
			this.setState({isEditing: false})
		}
	},
	handleClick: function () {
		this.saveDetails();
		this.toggleEditOff();
	}
})

var App = React.createClass({
	render: function () {
		return (
			<div id="main">
				<div id="location-section">
					<TitleSection />
					{this.findBooked()}
					<Details />
					<AttendeesSection />
					<PackingSection />
				</div>
			</div>
		)
	},
	findBooked: function () {
		for (var i = 0; i < choices.length; i++) {
			if (choices[i].booked === true) {
				return <Booked index={i}/>
			}
		}
		return <VacationChoices />
	}
});

window.renderApp = function() {
  ReactDOM.render(<App />, document.getElementById("container"));
}

$.getJSON(window.location.pathname + '/trip', function (data) {
	window.title = data.trip.title
	window.choices = data.choices;
	window.images = data.choices.images;
	window.attendees = data.attendees;
	window.packing = data.packing;
	window.details = data.trip.details;
	renderApp();
})









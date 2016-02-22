const React = require('react');
const ReactDOM = require('react-dom');

// const Logs = require('./logger/logs');

var Menu = React.create({
	getInitialState: function () {
		var items = [{
			name: 'Project 1',
			file: 'C:/projects/project1.log'
		}, {
			name: 'Project 2',
			file: 'C:/projects/project2.log'
		}, {
			name: 'Project 3',
			file: 'C:/projects/project3.log'
		}];

		return {items: items};
	},
	render: function () {
		return React.createElement('div', {className: 'list-group'}, this.state.items.map(function (item) {
			var title = React.createElement('h4', {className: 'list-group-item-heading'}, item.name);
			var file = React.createElement('p', {className: 'list-group-item-text'}, item.file);

			return React.createElement('a', {className: 'list-group-item'}, [title, file]);
		}));
	}
});

module.exports = Menu;
/*
var Workspace = React.createClass({
	render: function () {
		return React.createElement('div', {} , [Menu, Logs]);
	}
});*/

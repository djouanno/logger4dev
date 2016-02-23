const React = require('react');
const ReactDOM = require('react-dom');

var Menu = React.createClass({
	render: function () {
		var addButton = React.createElement('a', {className:'btn btn-default'}, 'Add project');
		var deleteButton = React.createElement('a', {className:'btn btn-danger'}, 'Delete project');

		var bottomLeftPanel = React.createElement('div', {id: 'bottom-left-panel'}, [addButton, deleteButton]);

		var menuLeftPanel = React.createElement('div', {id: 'menu', className: 'list-group'}, this.props.projects.map(function (project) {
			var title = React.createElement('h4', {className: 'list-group-item-heading'}, project.name);
			var file = React.createElement('p', {className: 'list-group-item-text'}, project.file);

			return React.createElement('a', {className: 'list-group-item'}, [title, file]);
		}))

		return React.createElement('div', {id: 'left-panel'}, [menuLeftPanel, bottomLeftPanel]);
	}
});

module.exports = Menu;

const ipcRenderer = require('electron').ipcRenderer;
const moment = require('moment');
const React = require('react');
const ReactDOM = require('react-dom');
const toastr = require('toastr');

const Logs = require('./components/logger/logs');
const Menu = require('./components/menu');

const FileComponent = React.createClass({
	getInitialState: function () {
		return {filePath: ''};
	},
	onChange: function (e) {
		this.setState({filePath: e.target.value});
	},
	sendValue: function (e) {
		console.log('File', this.state.filePath);
		ipcRenderer.send('watch', this.state.filePath);
		return false;
	},
	render: function () {
		const input = React.createElement('input', {className: 'form-control', type: 'text', onChange: this.onChange});
		return React.createElement('form', {onSubmit: this.sendValue, action: 'javascript:void(0);'}, input);
	}
});

const ClearButton = React.createClass({
	onClick: function () {
		window.dispatchEvent(new Event('clear'));
	},
	render: function () {
		return React.createElement('a', {className: 'btn btn-danger', onClick: this.onClick}, 'Clear');
	}
});

const LockScroll = React.createClass({
	onClick: function (e) {
		window.dispatchEvent(new CustomEvent('lockScroll', {'detail': !this.props.lockScroll}));
	},
	render: function () {
		const checkbox = React.createElement('i', {className: 'fa fa-fw' + (this.props.lockScroll ? 'fa fa-lock' : 'fa fa-unlock')});
		return React.createElement('a', {className: 'btn btn-default', onClick: this.onClick}, checkbox, ' Lock the scroll');
	}
});

const Filters = React.createClass({
	onChange: function (e) {
		window.dispatchEvent(new CustomEvent('filter', {'detail': {id: e.target.value}}));
	},
	render: function () {
		return React.createElement('input', {className: 'form-control', onChange: this.onChange});
	}
});

const App = React.createClass({
	getInitialState: function () {
		const logs = [];
		const filter = {id: ''};

		for (var i = 0; i < 500; i++) {
			logs.push({id: i, msg: 'Un super message n°' + i, date: moment()});
		}

		return {logs: logs, filter: filter, lockScroll: true};
	},
	componentDidMount: function () {
		ipcRenderer.on('newLogEvent', (function (event, log) {
			const logs = this.state.logs;
			logs.push({id: logs.length, date: log.date, msg: log.msg});
			this.setState({logs: logs});
		}).bind(this));

		ipcRenderer.on('error', function (event, msg) {
			console.log('error', msg);
			toastr.error("The file doesn't exist", "Logger doesn't work");
		});

		ipcRenderer.on('filewatching', function (event, msg) {
			console.log('mlmlmlml');
			toastr.success('The file is correct', 'Logger is working');
		});

		window.addEventListener('filter', (function (e) {
			this.setState({filter: e.detail});
		}).bind(this));

		window.addEventListener('clear', (function (e) {
			this.setState({logs: []});
		}).bind(this));

		window.addEventListener('lockScroll', (function (e) {
			this.setState({lockScroll: e.detail});
		}).bind(this));
	},

	render: function () {
		var filtersDiv = React.createElement('div', {className: 'col-xs-3'}, React.createElement(Filters, {filter: this.state.filter}));
		var clearDiv = React.createElement('div', {className: 'col-xs-1'}, React.createElement(ClearButton));
		var lockScrollDiv = React.createElement('div', {className: 'col-xs-2'}, React.createElement(LockScroll, {lockScroll: this.state.lockScroll}));
		var fileDiv = React.createElement('div', {className: 'col-xs-3'}, React.createElement(FileComponent));
		var toolsDiv = React.createElement('div', {className: 'row'}, [filtersDiv, clearDiv, lockScrollDiv, fileDiv]);

		var workspace = React.createElement('div', {id: 'workspace'}, toolsDiv, React.createElement(Logs, {logs: this.state.logs, filter: this.state.filter, lockScroll: this.state.lockScroll}));

		return React.createElement('div', {id: 'app'}, React.createElement(Menu), workspace);
	}
});

module.exports = App;

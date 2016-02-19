const ipc = require('ipc');
const moment = require('moment');
const React = require('react');
const ReactDOM = require('react-dom');

const Log = React.createClass({
	renderLog: function (log) {
		return moment(log.date).format('DD/MM/YYYY HH:mm:ss') + ' - ' + log.msg;
	},
	render: function () {
		return React.createElement('div', {},
			React.createElement('span', {}, this.renderLog(this.props.log)),
			React.createElement('br'));
	}
});

const Logger = React.createClass({
	componentDidUpdate: function () {
		if (this.props.lockScroll) {
			const node = ReactDOM.findDOMNode(this);
			node.scrollTop = node.scrollHeight;
		}
	},
	componentDidMount: function () {
		if (this.props.lockScroll) {
			const node = ReactDOM.findDOMNode(this);
			node.scrollTop = node.scrollHeight;
		}
	},
	filterLogs: function (logs, filter) {
		return filteredLogs = logs.filter(function (log) {
			return log.msg.indexOf(filter.id) !== -1;
		});
	},
	render: function () {
		return React.createElement('pre', {className: 'logger'}, this.filterLogs(this.props.logs, this.props.filter).map(function (log) {
			return React.createElement(Log, {key: log.id, log: log});
		}));
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
		ipc.on('asynchronous-message', (function (event, arg) {
			const logs = this.state.logs;
			logs.push({id: logs.length,date: event.date, msg: 'lfkldkflkdflkdfllklkk'});
			this.setState({logs: logs});
		}).bind(this));

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
		var clearDiv = React.createElement('div', {className: 'col-xs-3'}, React.createElement(ClearButton));
		var lockScrollDiv = React.createElement('div', {className: 'col-xs-3'}, React.createElement(LockScroll, {lockScroll: this.state.lockScroll}));
		var toolsDiv = React.createElement('div', {className: 'row'}, [filtersDiv, clearDiv, lockScrollDiv]);

		return (
		React.createElement('div', null,
			toolsDiv,
			React.createElement('br'),
			React.createElement(Logger, {logs: this.state.logs, filter: this.state.filter, lockScroll: this.state.lockScroll}))
		);
	}
});

module.exports = App;

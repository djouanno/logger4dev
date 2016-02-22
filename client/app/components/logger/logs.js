const React = require('react');
const ReactDOM = require('react-dom');

const Log = require('./log');

const Logs = React.createClass({
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

module.exports = Logs;

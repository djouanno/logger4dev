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

module.exports = Log;

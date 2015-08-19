'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Component = _react2['default'].Component;
var PropTypes = _react2['default'].PropTypes;

var ScrollIntoViewportTrigger = (function (_Component) {
	_inherits(ScrollIntoViewportTrigger, _Component);

	_createClass(ScrollIntoViewportTrigger, null, [{
		key: 'propTypes',
		value: {
			autoReset: PropTypes.bool,
			scrollContainer: PropTypes.object,
			className: PropTypes.string,
			onTrigger: PropTypes.func
		},
		enumerable: true
	}, {
		key: 'defaultProps',
		value: {
			autoReset: true
		},
		enumerable: true
	}]);

	function ScrollIntoViewportTrigger(props) {
		_classCallCheck(this, ScrollIntoViewportTrigger);

		_get(Object.getPrototypeOf(ScrollIntoViewportTrigger.prototype), 'constructor', this).call(this, props);

		this.state = {
			triggered: false,
			triggering: false
		};
	}

	_createClass(ScrollIntoViewportTrigger, [{
		key: 'getParent',
		value: function getParent(node) {
			node = node || _react2['default'].findDOMNode(this);

			var parent = node.parentNode;
			if (this.props.scrollContainer) {
				parent = _react2['default'].findDOMNode(this.props.scrollContainer);
			}

			return parent;
		}
	}, {
		key: 'getClassName',
		value: function getClassName() {
			var cls = [];

			if (this.props.className) {
				cls.push(this.props.className);
			}

			if (this.state.triggered) {
				cls.push('triggered');
			}

			if (this.state.triggering) {
				cls.push('triggering');
			}

			return cls.join(' ') || '';
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var node = _react2['default'].findDOMNode(this);

			if (!node) {
				console.warn('ScrollIntoViewportTrigger: did not found corresponding DOM Node.');
				return;
			}

			var parent = this.getParent(node);

			if (!parent) {
				console.warn('ScrollIntoViewportTrigger: did not found corresponding parentNode');
				return;
			}

			this.onHandleScroll = this.onHandleScroll.bind(this);
			parent.addEventListener('scroll', this.onHandleScroll, false);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			var parent = this.getParent();

			if (parent) {
				parent.removeEventListener('scroll', this.onHandleScroll);
			}
		}
	}, {
		key: 'onHandleScroll',
		value: function onHandleScroll() {
			var node = _react2['default'].findDOMNode(this),
			    parent = this.getParent(node);

			if (!this.state.triggering && parent.scrollTop + parent.offsetHeight >= node.offsetTop) {
				this.setState({
					triggered: true,
					triggering: true
				});
				if (this.props.onTrigger) {
					this.props.onTrigger(this);
				}
				if (this.props.autoReset) {
					this.setState({
						triggering: false
					});
				}
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2['default'].createElement(
				'div',
				{ className: this.getClassName() },
				this.props.children
			);
		}
	}]);

	return ScrollIntoViewportTrigger;
})(Component);

;

var PtrStatus = {
	IDLE: 'idle',
	LOADING: 'loading'
};

var PtrContainer = (function (_Component2) {
	_inherits(PtrContainer, _Component2);

	_createClass(PtrContainer, null, [{
		key: 'propTypes',
		value: {
			id: PropTypes.string,
			className: PropTypes.string,
			pullToRefreshIndicator: PropTypes.func,
			infiniteScrollingIndicator: PropTypes.func,
			onRefresh: PropTypes.func,
			onLoadFurther: PropTypes.func
		},
		enumerable: true
	}]);

	function PtrContainer(props) {
		_classCallCheck(this, PtrContainer);

		_get(Object.getPrototypeOf(PtrContainer.prototype), 'constructor', this).call(this, props);

		this.state = {
			ptrStatus: PtrStatus.IDLE
		};

		this._ptrNode = null;
		this._ptrScrollOffset = 0;
		this._ptrPulling = false;
		this._ptrTriggered = false;

		this.onTouchStart = this.onTouchStart.bind(this);
		this.onTouchMove = this.onTouchMove.bind(this);
		this.onTouchEnd = this.onTouchEnd.bind(this);
	}

	_createClass(PtrContainer, [{
		key: 'getClassName',
		value: function getClassName() {
			var className = 'ptr-container ptr-status-' + this.state.status;

			if (this.props.className) {
				className = className + ' ' + this.props.className;
			}

			return className;
		}
	}, {
		key: 'setPtrStatus',
		value: function setPtrStatus(status) {
			this.setState({ ptrStatus: status });
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this._ptrNode = _react2['default'].findDOMNode(this);
			var indicator = undefined,
			    content = undefined;

			if (!this._ptrNode || !(indicator = this._ptrNode.querySelector('.ptr-container-indicator')) || !(content = this._ptrNode.querySelector('.ptr-container-content'))) {
				console.warn('PtrContainer could not obtain its child nodes ...');
				return;
			}
			indicator.style.top = '-' + indicator.offsetHeight + 'px';

			this._ptrNode.addEventListener('touchstart', this.onTouchStart, false);
			this._ptrNode.addEventListener('touchmove', this.onTouchMove, false);
			this._ptrNode.addEventListener('touchend', this.onTouchEnd, false);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this._ptrNode.removeEventListener('touchstart', this.onTouchStart);
			this._ptrNode.removeEventListener('touchmove', this.onTouchMove);
			this._ptrNode.removeEventListener('touchend', this.onTouchEnd);
		}
	}, {
		key: 'onTouchStart',
		value: function onTouchStart() {
			if (this._ptrPulling || this.state.ptrStatus != PtrStatus.IDLE) {
				return;
			}

			var node = this._ptrNode || _react2['default'].findDOMNode(this);

			if (!node || node.scrollTop > 0) {
				return;
			}

			this._ptrPulling = false;
			this._ptrTriggered = false;
			this._ptrScrollOffset = node.scrollTop;
		}
	}, {
		key: 'onTouchMove',
		value: function onTouchMove() {
			if (this.state.ptrStatus != PtrStatus.IDLE) {
				return;
			}

			var node = this._ptrNode || _react2['default'].findDOMNode(this),
			    indicator = undefined;

			if (node.scrollTop - this._ptrScrollOffset > 0) {
				return;
			}

			this._ptrPulling = true;

			if (!!node && !!(indicator = node.querySelector('.ptr-container-indicator'))) {
				this._ptrTriggered = node.scrollTop < -1 * indicator.offsetHeight;
			}
		}
	}, {
		key: 'onTouchEnd',
		value: function onTouchEnd() {
			var _this = this;

			if (!this._ptrPulling || this.state.ptrStatus != PtrStatus.IDLE) {
				return;
			}

			if (this._ptrTriggered) {
				this.setState({ ptrStatus: PtrStatus.LOADING });
				if (this.props.onRefresh) {
					setTimeout(function () {
						_this.props.onRefresh(_this);
					}, 50);
				}
			} else {
				this.setState({ ptrStatus: PtrStatus.IDLE });
			}

			this._ptrPulling = false;
			this._ptrTriggered = false;
		}
	}, {
		key: 'render',
		value: function render() {
			var _React$DOM;

			var wrapperArgs = [{
				id: this.props.id,
				style: {
					overflowY: 'auto',
					WebkitOverflowScrolling: 'touch'
				},
				className: this.getClassName()
			}];
			var children = [];

			children.push(_react2['default'].DOM.div({
				style: {
					position: this.state.ptrStatus == PtrStatus.LOADING ? 'static' : 'absolute',
					top: '-40px', left: 0,
					width: '100%', minHeight: '40px',
					WebkitTransform: 'translateZ(0)',
					zIndex: 1
				},
				className: 'ptr-container-indicator'
			}, this.props.pullToRefreshIndicator ? this.props.pullToRefreshIndicator(this.state.ptrStatus) : 'Loading ...'));

			children.push(_react2['default'].DOM.div({
				style: {
					minHeight: '100%',
					paddingBottom: '1px',
					WebkitTransform: 'translateZ(0)',
					zIndex: 2
				},
				className: 'ptr-container-content'
			}, this.props.children));

			if (this.props.infiniteScrollingIndicator && this.props.onLoadFurther) {
				children.push(_react2['default'].createElement(
					ScrollIntoViewportTrigger,
					{ onTrigger: this.props.onLoadFurther, className: 'ptr-container-further-loading' },
					this.props.infiniteScrollingIndicator()
				));
			}

			wrapperArgs.push(children);

			return (_React$DOM = _react2['default'].DOM).div.apply(_React$DOM, wrapperArgs);
		}
	}]);

	return PtrContainer;
})(Component);

exports['default'] = {
	PtrContainer: PtrContainer,
	PtrStatus: PtrStatus,
	ScrollIntoViewportTrigger: ScrollIntoViewportTrigger
};
module.exports = exports['default'];
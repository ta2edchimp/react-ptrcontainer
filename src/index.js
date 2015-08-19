import React, { Component, PropTypes } from 'react';

class ScrollIntoViewportTrigger extends Component {
	static propTypes = {
		autoReset: PropTypes.bool,
		scrollContainer: PropTypes.object,
		className: PropTypes.string,
		onTrigger: PropTypes.func
	}

	static defaultProps = {
		autoReset: true
	}

	constructor (props) {
		super(props);

		this.state = {
			triggered: false,
			triggering: false
		};
	}

	getParent (node) {
		node = node || React.findDOMNode(this);

		let parent = node.parentNode;
		if (this.props.scrollContainer) {
			parent = React.findDOMNode(this.props.scrollContainer);
		}

		return parent;
	}

	getClassName () {
		let cls = [];

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

	componentDidMount () {
		let node = React.findDOMNode(this);

		if (!node) {
			console.warn('ScrollIntoViewportTrigger: did not found corresponding DOM Node.');
			return;
		}

		let parent = this.getParent(node);

		if (!parent) {
			console.warn('ScrollIntoViewportTrigger: did not found corresponding parentNode');
			return;
		}

		this.onHandleScroll = this.onHandleScroll.bind(this);
		parent.addEventListener('scroll', this.onHandleScroll, false);
	}

	componentWillUnmount () {
		let parent = this.getParent();

		if (parent) {
			parent.removeEventListener('scroll', this.onHandleScroll);
		}
	}

	onHandleScroll () {
		let node = React.findDOMNode(this),
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

	render () {
		return (
			<div className={this.getClassName()}>
				{this.props.children}
			</div>
		);
	}
};

const PtrStatus = {
	IDLE: 'idle',
	LOADING: 'loading'
};

class PtrContainer extends Component {
	static propTypes = {
		id: PropTypes.string,
		className: PropTypes.string,
		pullToRefreshIndicator: PropTypes.func,
		infiniteScrollingIndicator: PropTypes.func,
		onRefresh: PropTypes.func,
		onLoadFurther: PropTypes.func
	}

	constructor (props) {
		super(props);

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

	getClassName () {
		let className = `ptr-container ptr-status-${this.state.status}`;

    	if (this.props.className) {
    		className = `${className} ${this.props.className}`;
    	}
    	
    	return className;
	}

	setPtrStatus (status) {
		this.setState({ ptrStatus: status });
	}

	componentDidMount () {
		this._ptrNode = React.findDOMNode(this);
		let indicator, content;

		if (!this._ptrNode || !(indicator = this._ptrNode.querySelector('.ptr-container-indicator')) || !(content = this._ptrNode.querySelector('.ptr-container-content'))) {
			console.warn('PtrContainer could not obtain its child nodes ...');
			return;
		}
		indicator.style.top = `-${indicator.offsetHeight}px`;

		this._ptrNode.addEventListener('touchstart', this.onTouchStart, false);
		this._ptrNode.addEventListener('touchmove', this.onTouchMove, false);
		this._ptrNode.addEventListener('touchend', this.onTouchEnd, false);
	}

	componentWillUnmount () {
		this._ptrNode.removeEventListener('touchstart', this.onTouchStart);
		this._ptrNode.removeEventListener('touchmove', this.onTouchMove);
		this._ptrNode.removeEventListener('touchend', this.onTouchEnd);
	}

	onTouchStart () {
		if (this._ptrPulling || this.state.ptrStatus != PtrStatus.IDLE) {
			return;
		}

		let node = this._ptrNode || React.findDOMNode(this);

		if (!node || node.scrollTop > 0) {
			return;
		}

		this._ptrPulling = false;
		this._ptrTriggered = false;
		this._ptrScrollOffset = node.scrollTop;
	}

	onTouchMove () {
		if (this.state.ptrStatus != PtrStatus.IDLE) {
			return;
		}

		let node = this._ptrNode || React.findDOMNode(this),
			indicator;

		if ((node.scrollTop - this._ptrScrollOffset) > 0) {
			return;
		}

		this._ptrPulling = true;

		if (!!node && !!(indicator = node.querySelector('.ptr-container-indicator'))) {
			this._ptrTriggered = (node.scrollTop < (-1 * indicator.offsetHeight));
		}
	}

	onTouchEnd () {
		if (!this._ptrPulling || this.state.ptrStatus != PtrStatus.IDLE) {
			return;
		}

		if (this._ptrTriggered) {
			this.setState({ ptrStatus: PtrStatus.LOADING });
			if (this.props.onRefresh) {
				setTimeout(() => { this.props.onRefresh(this); }, 50);
			}
		} else {
			this.setState({ ptrStatus: PtrStatus.IDLE });
		}

		this._ptrPulling = false;
		this._ptrTriggered = false;
	}

	render () {
		let wrapperArgs = [{
			id: this.props.id,
			style: {
				overflowY: 'auto',
				WebkitOverflowScrolling: 'touch'
			},
			className: this.getClassName()
		}];
		let children = [];

		children.push(
			React.DOM.div({
				style: {
					position: this.state.ptrStatus == PtrStatus.LOADING ? 'static' : 'absolute',
					top: '-40px', left: 0,
					width: '100%', minHeight: '40px',
					WebkitTransform: 'translateZ(0)',
					zIndex: 1,
				},
				className: 'ptr-container-indicator'
			}, this.props.pullToRefreshIndicator ? this.props.pullToRefreshIndicator(this.state.ptrStatus) : 'Loading ...'
		));

		children.push(
			React.DOM.div({
				style: {
					minHeight: '100%',
					paddingBottom: '1px',
					WebkitTransform: 'translateZ(0)',
					zIndex: 2
				},
				className: 'ptr-container-content'
			}, this.props.children
		));

		if (this.props.infiniteScrollingIndicator && this.props.onLoadFurther) {
			children.push(
				<ScrollIntoViewportTrigger onTrigger={this.props.onLoadFurther} className="ptr-container-further-loading">
					{this.props.infiniteScrollingIndicator()}
				</ScrollIntoViewportTrigger>
			);
		}

		wrapperArgs.push(children);

		return React.DOM.div(...wrapperArgs);
	}
}

export default {
	PtrContainer: PtrContainer,
	PtrStatus: PtrStatus,
	ScrollIntoViewportTrigger: ScrollIntoViewportTrigger
};

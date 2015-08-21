import React from 'react/addons';
import { PtrContainer } from '../src/index';

const
	{ assert } = chai,
 	{ TestUtils } = React.addons;

describe('react-ptrcontainer', () => {

	it('renders into document', () => {
		const ptr = TestUtils.renderIntoDocument(
			<PtrContainer />
		);
		assert(TestUtils.findRenderedDOMComponentWithClass(ptr, 'ptr-container'));
		assert(TestUtils.findRenderedDOMComponentWithClass(ptr, 'ptr-container-indicator'));
	});

	it('gives custom class names', () => {
		const ptr = TestUtils.renderIntoDocument(
			<PtrContainer className="custom-test-class another-custom-class" />
		);
		assert(TestUtils.findRenderedDOMComponentWithClass(ptr, 'custom-test-class'));
		assert(TestUtils.findRenderedDOMComponentWithClass(ptr, 'custom-test-class'));
	});

	it('renders into document with custom `Pull to Refresh` indicator and custom child elements', () => {
		let getPtrIndicator = () => (<div className="custom-ptr-indicator">PULL TO REFRESH</div>);

		const
			articles = [{ idx: 0, name: 'one' }, { idx: 1, name: 'two' }, { idx: 2, name: 'three' }],
			ptr = TestUtils.renderIntoDocument(
				<PtrContainer pullToRefreshIndicator={getPtrIndicator}>
				{articles.map((article) => {
					let idx = article.idx + 1,
						id = 'article-' + idx;
					return (
						<div id={id} className="content-class">#{idx}: {article.name}</div>
					);
				})}
				</PtrContainer>
			);

		assert(TestUtils.findRenderedDOMComponentWithClass(ptr, 'custom-ptr-indicator'));

		const
			articleElements = TestUtils.scryRenderedDOMComponentsWithClass(ptr, 'content-class');

		assert.lengthOf(articleElements, 3, 'Expected 3 article elements within `ptr-container-content`');

		assert.equal(articleElements[0].props.id, 'article-1');
		assert.equal(articleElements[1].props.id, 'article-2');
		assert.equal(articleElements[2].props.id, 'article-3');
	});

	it('renders into document with activated `Infinite Scrolling`', () => {
		let getInfScrIndicator = () => (<div className="custom-infscr-indicator">LOAD MORE</div>);

		let onLoadFurtherCb = () => { console.log('ON LOAD FURTHER ...'); };

		const
			articles = (function (N) {
				let a = [], i = 0; for (; i < N; i++) { a.push({ name: ('' + i) }); } return a;
			})(13),
			ptr = TestUtils.renderIntoDocument(
				<PtrContainer infiniteScrollingIndicator={getInfScrIndicator} onLoadFurther={onLoadFurtherCb}>
				<div style={{ position: 'relative', height: '150%' }}>
				{articles.map((article) => (
					<div className="article">{article.name}</div>
				))}
				</div>
				</PtrContainer>
			);

		assert(TestUtils.findRenderedDOMComponentWithClass(ptr, 'custom-infscr-indicator'));

		const articleElements = TestUtils.scryRenderedDOMComponentsWithClass(ptr, 'article');

		assert.lengthOf(articleElements, 13, 'Expected 13 article elements within `ptr-container-content`');

		// Somehow, the rendered nodes have no dimensions ... look further into this later		
		// const ptrNode = TestUtils.findRenderedDOMComponentWithClass(ptr, 'ptr-container').getDOMNode();
		// TestUtils.Simulate.scroll(ptrNode, { deltaY: 1000 });
	});

});

# react-ptrcontainer

A [React](http://facebook.github.io/react/) component providing `Pull to Refresh` a view, as well as `infinite scrolling`.

## Usage

```JavaScript
import React from 'react';
import { PtrContainer, PtrStatus } from 'react-ptrcontainer';

let content = [];

function getPtrIndicator (status) {
    // What to display while loading:
    if (status == PtrStatus.LOADING) {
        return (<div>Loading ...</div>);
    }

    // What to display when not loading:
    return (<div>Pull to Refresh</div>)
}

function onRefresh (ptrContainer) {
    // Refresh the contents
    content = [];

    // Reset the PtrContainer's status to IDLE
    ptrContainer.setPtrStatus(PtrStatus.IDLE);
}

React.render((
    <PtrContainer pullToRefreshIndicator={getPtrIndicator} onRefresh={onRefresh}>
        {content.map((article) => (
            <div>{article.title}</div>
        ))}
    </PtrContainer>
), document.body);
```

The component will wrapp its children in a container that's not only scrollable, but can be panned vertically so that a second container becomes visible (the `indicator`).  
The `indicator` can be rendered differently, depending on the component's current `PtrStatus`.

Optionally, one can enable "Infinite Scrolling" by using the properties `infiniteScrollingIndicator` and `onLoadFurther`. When the corresponding element enters the component's visible area, the `onLoadFurther` function will be invoked and additional content can be loaded and appended.

## Props

Name                         | Type     | Description
-----------------------------|----------|------------
`id`                         | string   | `id` attribute to apply to the component's DOM node.
`className`                  | string   | `class` attribute to apply to the component's DOM node.
`pullToRefreshIndicator`     | function | The "Pull to Refresh" `indicator`'s content to be rendered.
`onRefresh`                  | function | The function to invoke when "Pull to Refresh" has been triggered.
`infiniteScrollingIndicator` | function | The "Infinite Scrolling" `indicator`'s content to be rendered.
`onLoadFurther`              | function | The function to invoke when "Infinite Scrolling" has been triggered.

## ScrollIntoViewportTrigger

The `PtrContainer`'s "Infinite Scrolling" functionality can also be used out of the `PtrContainer` component.  
Just import the correspondent component from the module:

```JavaScript
import { ScrollIntoViewportTrigger } from 'react-ptrcomponent';
```

and use it in your own `render` method:

```JavaScript
render () {

    return (

        // ...

        <ScrollIntoViewportTrigger onTrigger={onLoadFurther}>
            Loading more ...
        </ScrollIntoViewportTrigger>

        // ...

    );

}
```

Name              | Type     | Description
------------------|----------|------------
`className`       | string   | A `class` attribute to apply to the component's DOM node.
`onTrigger`       | function | The function to invoke when triggered.
`scrollContainer` | object   | Determines the scrollable element (as React component), if it is **not** the trigger component's parent.

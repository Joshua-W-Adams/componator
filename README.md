# Componator

## Description

A pure JavaScript module to construct gui components based on a passed parent child data structure.

## Why Use Componator?

This module is:
- Pure JavaScript - No HTML, CSS or 3rd party library requirements (e.g. jquery). All HTML components and elements are created dynamically.
- Independant - Object is run in its own namespace to avoid conflicts with other libraries.
- Easy to Install - Simply download the library and import it into your project.
- Fully Customisable - Multiple construction options to fully configure any gui components content and operation. Change the background color, text color, button color, render custom element, customise onclick, onmouseover, onmouseout and onevent functions.
- Tiny - 21 kB as source code and 8 kB as minified code.

## Getting Started

### Installation

1. Run this command

```
npm i componator --save
```

2. Add as a resource.

  ```javascript
  <script type="text/javascript" src="/dist/componator.min.js"></script>
  ```

### Useage

Pass configuration objects to the module and get a constructed component returned as follows:

```javascript
  // sample component data structure to load a grey background modal
  // parent child data structure of component to be generated replicating
  // a HTML DOM
  const defaultConfig = [{
    name: 'modal',
    element: {
      value: 'div',
      content: 'X'
    },
    child: [{
      name: 'overlay',
      style: {
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        background: '#000',
        opacity: '0.5',
        'z-index': '999'
      }
    }]
  }];
  // user configuration overrides to default configuration modal
  const userConfig = [{
    name: 'modal',
    child: [{
      name: 'overlay',
      style: {
        background: 'red',
      }
    }]
  }];
  // construct default component and append / override with user details
  let component = componator.buildComponent(defaultConfig, userConfig);
  console.log(component);
```

Both configuration objects accepts the following parameters

```javascript
const config = [{
  name: 'modal', // name of element - accepts string values
  element: {
    value: 'div', // element type - accepts string, function that returns a string or function that returns an element
    content: 'X' // element innerHTML - accepts string or function that returns a string
  },
  onclick: function () { console.log ('clicked') }, // element onclick function
  onmouseover: function () { console.log ('onmouseover') }, // element onmouseover function
  onmouseout: function () { console.log ('onmouseout') }, // element onmouseout function
  eventlistener: {
    event: 'submit', // element event name - accepts string only
    callback: function () { console.log ('submit') } // element on event function
  },
  style: null, // style to be applied to element - accepts css string, object or function that returns string or object
  child: [{ // array of element objects to be loaded as children to parent element
    // name: null,
    // element: null,
    // onclick: null,
    // onmouseover: null,
    // onmouseout: null,
    // eventlistener: null,
    // style: null,
    // child: [{
    //   // etc.
    // }]
  }]
}];
```

Build component function accepts the following parameters.

```javascript
// defaultConfig = configurations details to build the component
// userConfig = configuration details that overrides the default config
// component = optional. Object to load the component into. If not specified an object will
// be created
// functions = array of functions to bind to the component objects prototype
let obj = componator.buildComponent(defaultConfig, userConfig, component, functions);
```

### Contributors

#### Develop

If you would like to contribute to the project. To get a development environment up and running on your local system. Simply follow the instructions below.

1. Install latest version of Node.js

```
https://nodejs.org/en/download/
```

2. Clone repository to your system using the following command or git desktop

```
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY
```

3. Install repository dependencies

```
npm install
```

4. Serve module with web server

```
gulp serve
```

5. Sample module can now be accessed on localhost

```
http://localhost/
```

#### Deployment

1. Lint application

```
gulp lint
```

2. Build dist files

```
gulp build
```

3. Submit pull request to master branch on repository

## License
Copyright (C) 2020 Joshua Adams
This program is free software. You can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
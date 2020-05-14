/*!
 * Componator
 * Generates gui components based on a standard parent child input data structure
 * (c) 2020 Joshua Adams
 */

/* ============================== Import Modules ============================ */

// N/A

/* ================================ Variables =============================== */

// N/A

/* ============================= Private Methods ============================ */

function _applyStyles(elementStyle, styles) {
  if (styles) {
    // get keys to avoid looping through entire prototype chain
    const arr = Object.keys(styles);
    for (let i = 0; i < arr.length; i++) {
      const style = arr[i];
      elementStyle.cssText = elementStyle.cssText.concat(`${style} : ${styles[style]};`);
    }
  }
}

function _checkForFunction(prop) {
  if (typeof prop === 'function') {
    return true;
  } else {
    return false;
  }
}

function _isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}

// get object property if it exists else return a null value
// handles cases where any level of the property chain does not exist
function _getDescendantProp(obj, desc) {
  if (obj && desc) {
    const arr = desc.split('.');
    for (let i = 0; i < arr.length; i++) {
      // set current object as child property
      if (obj[arr[i]]) {
        obj = obj[arr[i]];
      } else {
        obj = null;
        break;
      }
    }
    return obj;
  } else {
    return null;
  }
}

function _handleElementContent(content) {
  // case 1 - user passes string
  if (typeof content === 'string') {
    return content;
  // case 2 - user passes function that returns string
  } else if (_checkForFunction(content) && typeof content() === 'string') {
    return content();
  // case 3 - user pases nothing or unsupported type
  } else {
    return '';
  }
}

function _handleElementValue(element, content) {
  // case 1 - user passes function that returns html element
  if (element !== null && _checkForFunction(element) && _isElement(element())) {
    return element();
  // case 2 - user passes a string value
  } else if (typeof element === 'string') {
    const e = document.createElement(element);
    const str = _handleElementContent(content);
    e.innerHTML = str;
    return e;
  // case 3 - user passes function that returns a string
  } else if (element !== null && _checkForFunction(element) && typeof element() === 'string') {
    const e = document.createElement(element());
    const str = _handleElementContent(content);
    e.innerHTML = str;
    return e;
  // case 4 - user passes nothing or unsupported type
  } else {
    // default element
    const e = document.createElement('div');
    const str = _handleElementContent(content);
    e.innerHTML = str;
    return e;
  }
}

function _cssStringToObject(cssText) {
  const regex = /([\w-]*)\s*:\s*([^;]*)/g;
  let match;
  const properties = {};
  while (match = regex.exec(cssText)) properties[match[1]] = match[2].trim();
  return properties;
}

function _handleElementStyle(style) {
  // case 1 - user passes function that returns an object with keys
  if (style !== null && _checkForFunction(style) && typeof style() === 'object' && style() !== null && Object.keys(style()).length > 0) {
    return style();
  // case 2 - user passes style string
  } else if (typeof style === 'string') {
    // convert string to style object
    const o = _cssStringToObject(style);
    return o;
  // case 3 - user passes a style object
  } else if (typeof style === 'object' && style !== null && Object.keys(style.length > 0)) {
    return style;
  }
  // case 4 - nothing or unsupported type
  // undefined returned
}

function _handleElementFunction(onclick) {
  // case 1 - user passes function
  if (onclick !== null && _checkForFunction(onclick)) {
    return onclick;
  }
  // case 2 - user passes string, nothing or unsupported type
  // undefined returned
}

function _handleElementEvent(event) {
  // case 1 - user passes string
  if (typeof event === 'string') {
    return event;
  }
  // undefined returned
}

function _addOnMouseOver(element, cb, _this) {
  if (cb) {
    element.onmouseover = function (event) {
      cb(event, _this, element);
    };
  }
}

function _addOnMouseOut(element, cb, _this) {
  if (cb) {
    element.onmouseout = function (event) {
      cb(event, _this, element);
    };
  }
}

function _addOnClick(element, cb, _this) {
  if (cb) {
    element.onclick = function (event) {
      cb(event, _this, element);
    };
  }
}

function _addEventListener(element, event, cb) {
  if (cb) {
    element.addEventListener(event, cb);
  }
}

function _findUserConfig(name, userConfig) {
  if (userConfig) {
    for (let i = 0; i < userConfig.length; i++) {
      const row = userConfig[i];
      if (row && name && row.name === name) {
        return row;
      }
    }
  }
  // return undefined otherwise
}

// Main function to build the gui component by recursively looping though the parent child data structure
function _buildComponent(component, defaultConfig, userConfig, finalConfig, parentElement) {
  // loop through current parent level in data heirarchy
  for (let i = 0; i < defaultConfig.length; i++) {
    // get current element configuration
    const defaultElementConfig = defaultConfig[i];
    const name = _getDescendantProp(defaultElementConfig, 'name');
    // get any user overrides of current element
    const userElementConfig = _findUserConfig(name, userConfig);
    // get all element configuration values
    const element = _handleElementValue(_getDescendantProp(userElementConfig, 'element.value') || _getDescendantProp(defaultElementConfig, 'element.value'),
      _getDescendantProp(userElementConfig, 'element.content') || _getDescendantProp(defaultElementConfig, 'element.content'));
    const onclick = _handleElementFunction(_getDescendantProp(userElementConfig, 'onclick') || _getDescendantProp(defaultElementConfig, 'onclick'));
    const onmouseover = _handleElementFunction(_getDescendantProp(userElementConfig, 'onmouseover') || _getDescendantProp(defaultElementConfig, 'onmouseover'));
    const onmouseout = _handleElementFunction(_getDescendantProp(userElementConfig, 'onmouseout') || _getDescendantProp(defaultElementConfig, 'onmouseout'));
    const eventlistener = _handleElementFunction(_getDescendantProp(userElementConfig, 'eventlistener.callback') || _getDescendantProp(defaultElementConfig, 'eventlistener.callback'));
    const event = _handleElementEvent(_getDescendantProp(userElementConfig, 'eventlistener.event') || _getDescendantProp(defaultElementConfig, 'eventlistener.event'));
    const elementStyle = element.style;
    const defaultStyle = _handleElementStyle(_getDescendantProp(defaultElementConfig, 'style'));
    const userStyle = _handleElementStyle(_getDescendantProp(userElementConfig, 'style'));
    // commence building element
    // apply default styles
    _applyStyles(elementStyle, defaultStyle);
    // apply user specified style renderer
    _applyStyles(elementStyle, userStyle);
    // add onclick / run functions to all elements
    _addOnClick(element, onclick, component);
    // add onHover functions to all elements
    _addOnMouseOver(element, onmouseover, component);
    _addOnMouseOut(element, onmouseout, component);
    // addEventListeners
    _addEventListener(element, event, eventlistener);
    // set element id
    element.id = name;
    // update data modal with configured details
    const finalElementConfig = {
      name: name,
      element: element,
      onclick: onclick,
      onmouseover: onmouseover,
      onmouseout: onmouseout,
      eventlistener: {
        event: event,
        callback: eventlistener
      },
      style: elementStyle,
      child: []
    };
    // build object model
    if (parentElement) {
      parentElement.append(element);
    }
    // push element to parent config item
    finalConfig.push(finalElementConfig);
    // recursively call for child elements
    if (defaultElementConfig.child) {
      let userElementConfigChild;
      if (userElementConfig) {
        userElementConfigChild = userElementConfig.child;
      }
      _buildComponent(component, defaultConfig[i].child, userElementConfigChild, finalConfig[i].child, element);
    }
  }
}

function _getRGBCode(rgb_code, _this) {
  if (rgb_code.includes('#')) {
    return rgb_code;
  } else if (rgb_code.includes('rgb')) {
    rgb_code = rgb_code.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return '#' + _this.getHex(rgb_code[1], _this) + _this.getHex(rgb_code[2]) + _this.getHex(rgb_code[3]);
  } else {
    return _this.getHexCodeFromColor(rgb_code);
  }
}

function _getHex(x) {
  const hexDigits = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
  return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

function _adjust_brightness(hex_code, percent) {
  const r = parseInt(hex_code.substr(1, 2), 16);
  const g = parseInt(hex_code.substr(3, 2), 16);
  const b = parseInt(hex_code.substr(5, 2), 16);
  return '#' + ((0|(1<<8) + r * (100 - percent) / 100).toString(16)).substr(1) + ((0|(1<<8) + g * (100 - percent) / 100).toString(16)).substr(1) + ((0|(1<<8) + b * (100 - percent) / 100).toString(16)).substr(1);
}

function _getHexCodeFromColor(color_name) {
  const colours = {
    'aliceblue': '#f0f8ff',
    'antiquewhite': '#faebd7',
    'aqua': '#00ffff',
    'aquamarine': '#7fffd4',
    'azure': '#f0ffff',
    'beige': '#f5f5dc',
    'bisque': '#ffe4c4',
    'black': '#000000',
    'blanchedalmond': '#ffebcd',
    'blue': '#0000ff',
    'blueviolet': '#8a2be2',
    'brown': '#a52a2a',
    'burlywood': '#deb887',
    'cadetblue': '#5f9ea0',
    'chartreuse': '#7fff00',
    'chocolate': '#d2691e',
    'coral': '#ff7f50',
    'cornflowerblue': '#6495ed',
    'cornsilk': '#fff8dc',
    'crimson': '#dc143c',
    'cyan': '#00ffff',
    'darkblue': '#00008b',
    'darkcyan': '#008b8b',
    'darkgoldenrod': '#b8860b',
    'darkgray': '#a9a9a9',
    'darkgreen': '#006400',
    'darkkhaki': '#bdb76b',
    'darkmagenta': '#8b008b',
    'darkolivegreen': '#556b2f',
    'darkorange': '#ff8c00',
    'darkorchid': '#9932cc',
    'darkred': '#8b0000',
    'darksalmon': '#e9967a',
    'darkseagreen': '#8fbc8f',
    'darkslateblue': '#483d8b',
    'darkslategray': '#2f4f4f',
    'darkturquoise': '#00ced1',
    'darkviolet': '#9400d3',
    'deeppink': '#ff1493',
    'deepskyblue': '#00bfff',
    'dimgray': '#696969',
    'dodgerblue': '#1e90ff',
    'firebrick': '#b22222',
    'floralwhite': '#fffaf0',
    'forestgreen': '#228b22',
    'fuchsia': '#ff00ff',
    'gainsboro': '#dcdcdc',
    'ghostwhite': '#f8f8ff',
    'gold': '#ffd700',
    'goldenrod': '#daa520',
    'gray': '#808080',
    'green': '#008000',
    'greenyellow': '#adff2f',
    'honeydew': '#f0fff0',
    'hotpink': '#ff69b4',
    'indianred ': '#cd5c5c',
    'indigo': '#4b0082',
    'ivory': '#fffff0',
    'khaki': '#f0e68c',
    'lavender': '#e6e6fa',
    'lavenderblush': '#fff0f5',
    'lawngreen': '#7cfc00',
    'lemonchiffon': '#fffacd',
    'lightblue': '#add8e6',
    'lightcoral': '#f08080',
    'lightcyan': '#e0ffff',
    'lightgoldenrodyellow': '#fafad2',
    'lightgrey': '#d3d3d3',
    'lightgreen': '#90ee90',
    'lightpink': '#ffb6c1',
    'lightsalmon': '#ffa07a',
    'lightseagreen': '#20b2aa',
    'lightskyblue': '#87cefa',
    'lightslategray': '#778899',
    'lightsteelblue': '#b0c4de',
    'lightyellow': '#ffffe0',
    'lime': '#00ff00',
    'limegreen': '#32cd32',
    'linen': '#faf0e6',
    'magenta': '#ff00ff',
    'maroon': '#800000',
    'mediumaquamarine': '#66cdaa',
    'mediumblue': '#0000cd',
    'mediumorchid': '#ba55d3',
    'mediumpurple': '#9370d8',
    'mediumseagreen': '#3cb371',
    'mediumslateblue': '#7b68ee',
    'mediumspringgreen': '#00fa9a',
    'mediumturquoise': '#48d1cc',
    'mediumvioletred': '#c71585',
    'midnightblue': '#191970',
    'mintcream': '#f5fffa',
    'mistyrose': '#ffe4e1',
    'moccasin': '#ffe4b5',
    'navajowhite': '#ffdead',
    'navy': '#000080',
    'oldlace': '#fdf5e6',
    'olive': '#808000',
    'olivedrab': '#6b8e23',
    'orange': '#ffa500',
    'orangered': '#ff4500',
    'orchid': '#da70d6',
    'palegoldenrod': '#eee8aa',
    'palegreen': '#98fb98',
    'paleturquoise': '#afeeee',
    'palevioletred': '#d87093',
    'papayawhip': '#ffefd5',
    'peachpuff': '#ffdab9',
    'peru': '#cd853f',
    'pink': '#ffc0cb',
    'plum': '#dda0dd',
    'powderblue': '#b0e0e6',
    'purple': '#800080',
    'rebeccapurple': '#663399',
    'red': '#ff0000',
    'rosybrown': '#bc8f8f',
    'royalblue': '#4169e1',
    'saddlebrown': '#8b4513',
    'salmon': '#fa8072',
    'sandybrown': '#f4a460',
    'seagreen': '#2e8b57',
    'seashell': '#fff5ee',
    'sienna': '#a0522d',
    'silver': '#c0c0c0',
    'skyblue': '#87ceeb',
    'slateblue': '#6a5acd',
    'slategray': '#708090',
    'snow': '#fffafa',
    'springgreen': '#00ff7f',
    'steelblue': '#4682b4',
    'tan': '#d2b48c',
    'teal': '#008080',
    'thistle': '#d8bfd8',
    'tomato': '#ff6347',
    'turquoise': '#40e0d0',
    'violet': '#ee82ee',
    'wheat': '#f5deb3',
    'white': '#ffffff',
    'whitesmoke': '#f5f5f5',
    'yellow': '#ffff00',
    'yellowgreen': '#9acd32'
  };
  if (typeof colours[color_name.toLowerCase()] !== 'undefined') return colours[color_name.toLowerCase()];
  return false;
}

function _addUserFunctions(component, functions) {
  if (functions) {
    for (let i = 0; i < functions.length; i++) {
      let f = functions[i];
      component.__proto__[f.name] = f;
    }
  }
}
/* ============================== Public Methods ============================ */

function buildComponent(defaultConfig, userConfig, userComponent, functions) {
  // create component
  const component = userComponent || {};
  // create array to store final configuration details
  const finalConfig = [];
  // add generic functions to component prototype
  // must use __proto__ as object has already been created
  component.__proto__.getRGBCode = _getRGBCode;
  component.__proto__.getHex = _getHex;
  component.__proto__.adjust_brightness = _adjust_brightness;
  component.__proto__.getHexCodeFromColor = _getHexCodeFromColor;
  // add user defined prototype functions to component
  _addUserFunctions(component, functions);
  // apply styles and onclick functionality to all elements
  _buildComponent(component, defaultConfig, userConfig, finalConfig);
  // append data model
  component.defaultConfig = defaultConfig;
  component.userConfig = userConfig;
  component.finalConfig = finalConfig; // = defaultConfig updated with userConfig
  // return constructed component to user
  return component;
}

function createDescendantProp(obj, desc, value) {
  const arr = desc.split('.');
  let currentProp;
  let currentObj = obj;
  for (let i = 0; i < arr.length; i++) {
    currentProp = arr[i];
    // create property
    if (i === arr.length - 1) {
      currentObj[currentProp] = value;
    } else if (!currentObj[currentProp]) {
      currentObj[currentProp] = {};
    }
    // set current object in loop
    currentObj = currentObj[currentProp];
  }
  return obj;
}

function defaultOnMouseOverColor(event, _this, element) {
  const color = element.style.color;
  element.setAttribute('data-color', element.style.color);
  element.style.color = _this.adjust_brightness(_this.getRGBCode(color, _this), 16);
}

function defaultOnMouseOutColor(event, _this, element) {
  element.style.color = element.getAttribute('data-color');
}

function defaultOnMouseOverBackground(event, _this, element) {
  const color = element.style.background;
  element.setAttribute('data-color', color);
  element.style.background = _this.adjust_brightness(_this.getRGBCode(color, _this), 16);
}

function defaultOnMouseOutBackground(event, _this, element) {
  element.style.background = element.getAttribute('data-color');
}

function findElement(arr, propName, propValue) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][propName] === propValue) {
      return arr[i];
    }
  }
  // will return undefined if not found; you could return a default instead
}

function findChildElement(arr, propName, propValue) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][propName] === propValue) {
      return arr[i];
    } else if (arr[i].child) {
      const child = findChildElement(arr[i].child, propName, propValue);
      if (child) {
        return child;
      }
    }
  }
}

/* =========================== Export Public APIs =========================== */

export default {
  buildComponent,
  createDescendantProp,
  defaultOnMouseOverColor,
  defaultOnMouseOutColor,
  defaultOnMouseOverBackground,
  defaultOnMouseOutBackground,
  findElement,
  findChildElement
};

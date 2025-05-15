### Default vs. Named exports
#### Default exports
- TLDR: Simple export design that exports a single value as the "default" export of a module.
- This enables you to name the import whatever you want when you're importing from that module. You simply provide a different name:
	```jsx
	// Button.jsx
	function Button({ children, ...props }) {  // NTS: this is capitalized because it's a React component
		return <button {...props}>{children}</button>;
	}
	
	export default Button;  // This could also be done on the same line as the function declaration above
	```
	
	```ts
	// app.js
	import whatever from './Button.jsx';  // Rename the default export from the math.js module
	```
- Default exports are best suited for modules that primarily export a single thing, like a React component or a main function.
#### Named exports
- TLDR: 
	- Facilitates multiple exports form a module (though you can still just export one named export
	- Explicit naming (but you can rename with the `as` keyword)
	- Tree shaking (bundlers can eliminate unused exports during build)
- Best used for a `util` module that has helper functions and no obvious main export.
	- Also may be preferable in general
```js
// math.js
export function add(a, b) {  // NTS: this is camelCase because it's a function
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;
```

```js
// app.js
import { add as addition, PI } from './math.js';  // Note the curly braces when importing named exports
```
###### Tree Shaking
```js
// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }
export function divide(a, b) { return a / b; }

// app.js
import { add, subtract } from './math.js';
// In production builds, multiply and divide functions will be eliminated 
// from the bundle if they're not used elsewhere
```
#### Other
- You *can* combine both approaches in a single module...
	```js
	// calculator.js
	export default function multiply(a, b) {  // Default export
		return ...;
	}
	
	export function add(a, b) {  // Named export
		return ...;
	}
	```

	```js
	// app.js
	import multiply, { add } from './calculator.js';
	```

### Exporting Arrow Functions
Arrow functions behave differently from regular functions when it comes to exports due to how declarations work in JavaScript.
###### Default Exports w/ Arrow Functions
```js
// Button.jsx
const Button = (props) => {
  return <button {...props}>{props.children}</button>;
};

export default Button;  // This is fine since Button is an expression/constant


// You **cannot** combine the declaration and export on one line as you can with functions, though:
export default const Button = (props) => {  // Syntax error because `const Button` is a *declaration*
  return <button {...props}>{props.children}</button>;
};
```
- To fix this you can...
	- Declare the constant first, then export it (as shown above)
	- Use an anonymous function expression directly:
		```js
		// Button.jsx
		export default (props) => {  // `export default` is followed by an expression, not the *declaration* `const Button`
		  return <button {...props}>{props.children}</button>;
		};
		```
	- However, this leads to another issue: a "[[#Missing Display Names]]" error (more on this below).
###### Named Exports w/ Arrow Functions
- These work as expected
```js
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;


// You can also export multiple named exports at once
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

export { multiply, divide };  
```

### Re-exporting Modules
Sometimes you want to create an "index" file that aggregates exports from multiple files:
```js
// math/index.js
export { add } from './add.js';
export { subtract } from './subtract.js';

// You can also re-export with different names:
export { multiply as mult } from './multiply.js';

// Re-export everything from a module (named imports):
export * from './multiply.js';

// Re-export a default export as a named export:
export { default as divide } from './divide.js';

// Or re-export a named export as a default export:
export { multiply as default } from './multiply.js';
// This can then be imported without curly braces:
// import multiplyFn from './math/index.js';
```
### Missing Display Names
- The warning "Component definition is missing display name" is raised by ESLint's React plugin (specifically the `react/display-name` rule) when your component lacks a clear identifier (it doesn't have a function name or a `displayName` property to identify it with in the component tree).
- Without a proper name, you'll see components labeled as "Anonymous" or "Unknown" in the React DevTools, making debugging much more difficult.
- The warning is not a JavaScript syntax error—your code will still run—but it's a development best practice to fix it.
- The warning  is raised by ESLint's React plugin (specifically the `react/display-name` rule) in the following scenarios:
	```js
	// Direct export of an anonymous function component
	export default () => <div>Hello world</div>;
	
	// When defining a component with an arrow/anon function (without setting the `displayName` property)
	const Button = (props) => <button {...props}>{props.children}</button>;
	export default Button;
	```

##### Fixing/Avoiding the Display Name warning
###### 1) Set the displayName property explicitly
```js
// Button.jsx
const Button = (props) => {
  return <button {...props}>{props.children}</button>;
};

Button.displayName = 'Button';  // Explicitly set the displayName

export default Button;
```
- Adding a displayName property to a component is completely non-breaking and requires no changes to the code that imports or uses that component. This property is only(?) used by React DevTools and has not effect on the component's behavior or API
###### 2) Use standard function declarations (the most common approach)
```js
// Before (in Button.jsx)
const Button = () => <button>Click me</button>;
export default Button;

// After (in Button.jsx) - no changes needed in importing files
function Button() {
  return <button>Click me</button>;
}
export default Button;

// Usage in another file remains unchanged
import Button from './ComponentA';
```
- If you switch from an arrow function to a named function or function declaration, the change is also non-breaking as long ***as the export remains the same***
###### 3) Use [[#Named Function Expressions]] instead
```js
// Button.jsx
const Button = function Button(props) {  // usually unnecessary, but read more on them below
  return <button {...props}>{props.children}</button>;
};

export default Button;  // The const is being exported, but the function it points to is also named Button
```
###### 4) Use the `React.memo` or other HOCs (higher-order components) with a named component
```js
import React from 'react';

const Button = React.memo(function Button(props) {
  return <button {...props}>{props.children}</button>;
});

export default Button;
```

### Named Function Expressions
When the function has a name, it can be used to refer to itself within its own body, aiding in recursion and providing a more descriptive function name in stack traces.
```js
const myFunction = function namedFunction() {
  // Function body with recursive call to namedFunction
};
```
- The function name `namedFunction` is only available in the function body

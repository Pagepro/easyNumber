#easyNumbers


###Benefits
* You can easily change numbers in inputs.
* Operated increment or decrement of input value by define buttons.
* Easily set readonly, format and validation of input value.

##Requirements
1. If you want use easyNumbers to date or time value, you need link Moment.js to your project.

##Installation

###Step 1: Install

```javascript
npm install easynumber
```

###Step 2: Add module in ES6

```javascript
import easynumber from 'easynumber';
```

###Step 3: Call the easyNumber


```javascript
$('.quantity').easyNumber()
```

##Default options

```javascript
defaults = {
    plus: '+',
    minus: '-',
    readonly: true,
    allowNegative: false,
    dateFormat: 'DD-MM-YYYY',
    timeFormat: 'HH:mm',
    type: 'int',
    validation: false,
    zero: null
};

```


##Configuration options


**plus**
It's a button to increment the value.
```
default: '+'
options: string
example: 'plus'
```

**minus**
It's a button to decrement the value.
```
default: '-'
options: string
example: 'minus'
```

**readonly**
Sets up read only options to your input.
```
default: 'true'
options: boolean
```

**allowNegative**
Allows to set negative numbers in input.
```
default: false
options: bool
```

**dateFormat**
Sets up yours date format.
```
default: 'DD-MM-YYYY'
options: string
example: '20-11-2015'
```

**timeFormat**
Sets up yours time format.
```
default: 'HH:mm'
options: string
example: '12:59'
```

**type**
Sets up type of input and increments, decrements value.
```
default: 'int'
options: int, data, time

```

**validation**
Check that user introduces right value input.
```
default: 'false'
option: numbers

```

**zero**
Sets up starts input value.
```
default: null
options: number

```
##Alternative configuration

You can pass configuration options in data attribute of input element:

```html
<input type="number" class="quantity" data-options='{"min": "minus", "max": "maximum"}'>
```

##Full features example

```javascript
$(document).ready(function(){
  $('.quantity').easyNumbers({
    plus: 'plus',
    minus: 'minus',
    readonly: true,
    allowNegative: true,
    dateFormat: 'DD-MM-YYYY',
    timeFormat: 'HH:mm',
    type: 'int',
    validation: 'true',
    zero: null
  });
});
```
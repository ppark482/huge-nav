# Huge Navigation Exercise

## Start

```
$ npm i && npm start
```

## Usage
Provide an endpoint as a parameter that returns navigation menu objects.
```
HugeNav.start('endpoint');
```

## Testing
To run integration test on the payload, provide endpoint as first parameter. Set second parameter to true to see a detailed output in the browser console.
```
HugeNav.test('endpoint', false);
```

See line 36 in public/index.html for usage.
# ts-transform-system-import
Transform `System.import` in TS to Promise-wrapped require


## Usage

Put this in your list of `before` transformers when you compile TS. This allows you to:

```
System.import('foo').then(module)
```

to become

```
Promise.resolve(require('foo')).then(module)
```
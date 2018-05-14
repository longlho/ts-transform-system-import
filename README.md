# ts-transform-system-import
## [DEPRECATED] Please use ES6 `import` instead. This plugin is only for backwards compatibility.
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

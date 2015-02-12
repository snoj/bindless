# bindless
Experimental data-bind(ing) tool for the view in MVC. The desire is to allow the developer to not have to worry about binding a model to a specific element tree.

## example goal
html
```
<div data-bind="text: something"></div>
<div data-bind="foreach: {data: arrrray, as: 'pi'}">
  <div>
    <span data-bind="text: something"></span> pwned <span data-bind="text: pi.name"></span>
  </div>
</div>
```

js
```
i1 = new bl({something: "Guardians"});
12 = new bl({arrrray: [{name: "Spazman"}, {name: "Nightman"}, {name: "Dayman"}, {name: "Jaman"}]);
```

result
```
<div>Guardians</div>
<div>
  <div>
    <span>Guardians</span> pwned <span>Spazman</span>
    <span>Guardians</span> pwned <span>Nightman</span>
    <span>Guardians</span> pwned <span>Dayman</span>
    <span>Guardians</span> pwned <span>Jaman</span>
  </div>
</div>
```
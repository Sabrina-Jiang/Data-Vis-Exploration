
## Overview
### Goals

This is a starting project for my data visualization course.
- Using vanilla Javascript with d3.js framework to create different graphics.
- Generate graphics with varied colors in different positions on the screen.
- Learn and test the functions provided by GitHub.

### Introduction
The idea is combining graphics (circles, rectangles, lines, polygons) into a well designed christmas tree. 

The resources of christmas tree came from the [internet](http://huaban.com/pins/972305336/). But I only implemented part of the designed picture due to the complexity of the composition. 

- Repository link: [https://sabrina-jiang.github.io/01-ghd3/index.html](https://sabrina-jiang.github.io/01-ghd3/index.html)  
- Here is a **screenshot** for my project:![](https://sabrina-jiang.github.io/01-ghd3/ScreenShot.png)
## Implementation
In this project, I used d3.js to create and apply styles to SVG based graphics elements.  Here is a brief introduction of the methods I used in this project.

- Use `append()` to add item to SVG element.
- Use `attr()` to change and set geometry and style properties.
- Visualizing data with D3's **data binding** function.
- Use **factory pattern** to simplify codes.

For example, create and apply `gradients` with section of SVG.
```javascript
var radialGradient = svg.append("defs")
    .append("radialGradient")
    .attr("id", "first")
    .attr("cx", "0.5")
    .attr("cy", "0.5")
    .attr("r", "0.5")
    .attr("fx", "0.25")
    .attr("fy", "0.25")

radialGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-opacity", 0.5)
    .attr("stop-color", "rgb(255,255,255)");

radialGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "rgb(249,219,186)")
    .attr("stop-opacity", 1);
```

## Issues
**The trouble with using multi-value selection** 

In d3.js 4.0, setting multiple attributes, styles or properties by passing object parameters is not allowed. For example:

```javascript
// Not allowed
.attr({
    cx: 4,
    cy: 4,
    r: 2,
  });
```

After doing some research on internet, I find the same question [disscussion](https://github.com/d3/d3/issues/2793) in d3.js GitHub offical repository. In this issue disscussion, we know that multi-value map support has moved to the `d3-selection-multi` repository as an optional plugin.
```html
<script src="https://d3js.org/d3-selection-multi.v1.min.js"></script>
```

Adding this plugin will help us organize our code better.

**Using browser-sync to refresh pages automatically**  

Instead of hitting F5 by hand after modified our pages every time, we can use `browser-sync` to make our browser testing workflow faster by automatically synchronising page content, interactions and code changes across multiple devices. 

This command line tool provided a **file watcher** and **communication bridge** between browser and server via **websocket**. So, every time local file changes, the server will send refresh command to browser. Then every connected browser will refresh immediately.

And the briefly introduction for the steps are belows:

1. Install **Node.js**
2. Install **browser-sync**
```bash
npm install -g browser-sync
```
3. Start **browser-sync**
```bash
browser-sync start --server --files="*.*, */*.*"   
```
After running the above commands, browser-sync will start and listening local 3000 port by default.

Now, visiting `http://localhost:3000` then we will get our **index.html** refreshing automatically since it changed.

## Conclusion
This is a great start for learning d3.js, and I spent lots of time on calculating coordinates for every graphics and writing the similar objects by repeated code.

So for optimaztion, I used `Factory Pattern` to avoid the repeated code and keep my code focused more on data model.

## References
**browser-sync**: [https://browsersync.io/#install](https://browsersync.io/#install)  

**The designed picture**: [http://huaban.com/pins/972305336](http://huaban.com/pins/972305336/)  

**Multi-selection**: [https://github.com/d3/d3-selection-multi](https://github.com/d3/d3-selection-multi)  

**Gradients**: [https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Gradients](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Gradients)
​                                                                                                                               
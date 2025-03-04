TASK1:
=> A brief explanation of how you would approach integrating a legacy Angular or
jQuery application with this setup?
To incorporate a legacy jQuery or Angular application into Single-SPA configuration:

1. For Angular, I will wrap the application as a microfrontend using single-spa-angular. just make sure Angular runs in the proper lifecycle, adjust angular.json, and configure main.single-spa.ts.
2. For AngularJS: I will Use an AngularJS module using single-spa-angularjs, bootstrap it by hand, and resolve routing issues.
3. For jQuery: I will Create a custom single-spa lifecycle with bootstrap, mount, and unmount. Ensure jQuery components are initialized in mount and properly cleaned up in unmount to avoid memory leaks. The main challenge with jQuery is that it often modifies the DOM directly, which can conflict with other frameworks in a micro frontend architecture. You'll want to ensure jQuery operates only within a specific container element

TASK2: Legacy Code Integration Strategy

Steps to Convert a Legacy Component into a Microfrontend
For Angular (v2+): I will use single-spa-angular to wrap the app.Create main.single-spa.ts and configure angular.json. Ensure proper routing and lifecycle handling.

For jQuery:
Create a custom Single-SPA lifecycle (bootstrap, mount, unmount). Attach jQuery components in mount and clean up in unmount. Ensure dependencies like jQuery and plugins are available globally.

Challenges & Solutions
CSS Conflicts: Use shadow DOM or scoped styles.
Dependency Management: Load shared dependencies via a module federation or global CDN.
Routing Issues: Isolate routes to prevent conflicts with other microfrontends.

TASK4: Describe any debugging tools or methods you would use to troubleshoot
performance or integration issues across React, Angular, and jQuery
components:

How I Debug Across Different Frameworks
Tools I Use:
1.I use Chrome's built-in tools to find problems. I check which parts are slow and where memory is getting stuck. Special tools for React and Angular help me see when components are updating too much.
Common Problems I Look For

When two frameworks fight over the same events
When frameworks try to change the same page elements
When old components aren't properly removed
When things start up in the wrong order

How I Fix Issues

1.I test each framework by itself first
2.I add print statements to see what's happening
3.I watch for changes to the page
4.I make sure old components are properly cleaned up
5.I keep different frameworks in their own areas of the page

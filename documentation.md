# Documentation

## How do I run this locally?

Git clone this repo along with the avantosfrontendchallengeserver from github.com/jentgelmeier.

To clone this repo and get it running locally, run the following code in your terminal and then open [http://localhost:3000](http://localhost:3000) to view it in your browser:

```
git clone https://github.com/jentgelmeier/999da1.git
cd 999da1
npm start
```

You'll need to use my version of the mock server because I included a regex fix to match the api documentation. I also updated it to run on port 3001 so that the two apps run on separate servers. This app will not work with the original frontendchallengeserver from mosiac-avantos.

To clone my avantosfrontendchallengeserver, run the following code in your terminal:

```
git clone https://github.com/mosaic-avantos/frontendchallengeserver.git
cd avantosfrontendchallengeserver
npm start
```

- Note: The state does not save locally, so if you refresh your browser, any fields you selected to prefill values for will be reset. In the future, I'd save the state in local storage or a backend database.

## How do I extend with new data sources?

The app is mostly set up to work with new data sources. Any additional nodes or forms will work right away as long as they are formatted the same as the nodes and forms are currently formatted in the graph.json file from the frontendchallengeserver repository. Changes in the format of the json data would require changes to the Graph type or require creating a new type.

New global sources, such as Action Properities and Client Organization Properties, would need to be added to the PrefillSidebar component. The two current global data sources with their elements are currently hardcoded at the start of the PrefillSidebar component, so the code there would need to be updated. If we expected to make multiple changes to the global data sources, it would probably be better to pass the global data source information into the PrefillSidebar component as props or retrieve that data from the backend.

## What patterns should I be paying attention to?

### Component Heirarchy

The heirarchy of components is 

App > NodeList > Prefill > PrefillSidebar > Collapse

### Context & Props

Data is shared between the components through two methods: 1) Context and 2) passing data from parent to child components as props.

The second is fairly straightforward and used for the PrefillSidebar and Collapse components. For example, the PrefillSidebar modal opens and closes based on the useState value **fieldName**. This value is set by clicking on an empty text input in the Prefill component (e.g. Button). If there is a value for **fieldName**, the sidebar is open. When a user clicks the X in the sidebar or selects a data source value to prefill, the **fieldName** value is cleared; therefore, the sidebar closes.

The Context is set up in the ContextProvider wrapper component, which contains 3 context providers for Graph, Prefill, and Node, each of which utilize the useState hook for setting and storing state. The ContextProvider is crucial to the App's ability to share state across components and to display and map prefill fields and values.

* The Graph context stores the graph JSON object received from the get request to the mock server. It's not updated by any user interactions. It's held in Context to make it accessible by any component since it is often used for filtering to access specific information for displaying forms, prefill fields, and data sources.
* The Prefill context keeps track of which data source values have been mapped to which form fields.
* The Node context stores name, id, and component_id of the node/form selected on the home page. The Prefill page uses these values to display the correct information for the node selected on the home page. The name is used for display purposes on the prefill page. The id is used for tasks like getting the node's prerequisite nodes / parents from the DAG. The component_id is used to get the form's field names in the Prefill compoenent and the data sources' values in the PrefillSidebar.

### User Interactivity

User events are handled by handler functions triggered by onClick or onChange events. These functions usually set values based on the value or id attributes of the event.target element.

### Retreiving the Parent Nodes from the DAG

The most complex aspect of the App is the means by which it retrieves the parent nodes to display in the sidebar modal--for instance, since Form F is the last node of the DAG, its sidebar displays Forms A-E as data sources. The function that computes the parent nodes is the **getParentNodes** function in the PrefillSidebar component. This function works by grabbing the parent(s) of the current node from the prerequisites key. If there are any prerequisites, it then enters while loop, in which it then takes the first prerequisite id (parent 1) and uses it to find its prerequisites (parent 2). It keeps repeating that cycle until there are no more prerequisites. In other words, the function starts at the current node and traverses the DAG backwards breadth-first.


### useEffect

The useEffect hook plays an important role in making the app more efficient by minimizing when computations run. Most of the useEffects have an empty dependency array and therefore only run when the component mounts. For example, the NodeList component only fetches the graph JSON once when it initially mounts. If the fetchGraph function were not in the useEffect hook, it would run every time the function renders, which would be needlessly inefficient. Similarly, the Prefill component checks to make sure a node has been selected in its useEffect when it mounts; it also calculates the fields to display. The PrefillSidebar component has a useEffect to get the parent nodes when it mounts too.

There are also useEffects which run whenever the value in their dependency array changes. The PrefillSidebar has two such useEffects. One retrieves and formats the data sources whenever the **parentNodes** variable is updated (in the app's current state, **parentNodes** is only calculated once on mount, so this useEffect basically just runs on mount). Its other useEffect runs whenever the **fieldName** variable changes to open and close the sidebar.

Lastly, the Collapse component has one useEffect that updates whenever the **displayedDataSources** are updated. It updates whether the FontAwesomeIcon for the data sources displays as a right arrow or a down arrow based on whether its associated collapse is open or closed (right arrow for closed and down arrow for open). This was a bit tricky because the collapse function is based on Bootstrap. Most of the rest of the visual changes are based on useState or useContext hooks directly, but since Bootstrap uses classes to open or close the collapse, the code in this useEffect is checking for the presence of a specific class, "show", to determine whether the arrow icon points right or down.
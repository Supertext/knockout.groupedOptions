/*!
 * knockout-groupedOptions.js v0.2
 * 
 * Copyright (c) Andrew Jameson, www.Supertext.ch
 * Available under the MIT license: http://opensource.org/licenses/MIT
 */
 
// data-bind="groupedOptions: { 
//                              groups: { 
//                                          coll: [groups collection  |  required; no default],
//                                          label: [name of textual property  |  default: 'Label'],
//                                          options: {
//                                              coll: [name of the collection containing the <option> elements  |  default: 'Options']
//                                              text: [name of the textual property  |  default: 'Text'],
//                                              value: [name of the value property  |  default: 'Value']
//                                          },
//                                      }, 
//                              optionsCaption: [text to be displayed for the default <option>, i.e., "Please select"  |  default: <option> not rendered],
//								value: [the property (observable or otherwise) which references the selected <option> item.]
//                          }"
//
// eg, data-bind="groupedOptions: { groups: { coll: TextTypes, label: 'Label', options: { coll: 'Options', text: 'Text', val: 'Value' } }, optionsCaption: '- Please select -' }"
//
// if using the conventions then this example may be shortened to
// eg, data-bind="groupedOptions: { groups: { coll: TextTypes }, optionsCaption: '- Please select -' }"

// Note that neither of the above examples considers a subscribing property, i.e., a property whose value is pre-selected and which is updated when the user selection changes.

ko.bindingHandlers["groupedOptions"] = {
    "init": function(element, valueAccessor, allBindings, viewModel) {

        // perform some checking of what we've been given to bind
        if (element.tagName.toLowerCase() !== "select") {
            throw new Error("groupedOptions binding applies only to SELECT elements");
        }

        var win = window;

        // remove all existing elements
        while (element.firstChild) {
            win.ko.removeNode(element.firstChild);
        }

        // add a change handler to record when a selection has been made
        win.ko.utils.registerEventHandler(element, "change", function() {

            // get the name of the property which stores the selected observable data
            var property = win.ko.utils.domData.get(element, "property");

            // if no property name was specified (to bind the selected value to) then just exit here
            if (typeof property === "undefined") {
                return;
            }

            // get the selected <option>
            var elmntOptSelected = win.ko.utils.arrayFirst(element.getElementsByTagName("option"), function(elmntOption) {
                return elmntOption.selected === true || elmntOption.getAttribute("selected");
            });
            if (elmntOptSelected === null) {
                return;
            }
            
            // get the observable data behind the selected <option>
            var obsData = win.ko.utils.domData.get(elmntOptSelected, "data");

            // attach the observable data to the property which stores the selected value
            if (typeof property === "function") {

                // the property is an observable/function and the selected observable data should be passed as a param

                property(obsData);

            } else if (typeof property === "string") {

                // the property is NOT an observable/function

                viewModel[property] = obsData;
            }
        });

        // Ensures that the binding processor doesn't try to bind the options
        return { 'controlsDescendantBindings': true };
    },
    "update": function(element, valueAccessor, allBindings, viewModel) {

        // cache some globals
        var win = window,
            doc = win.document,

            // Get the parameters
            h = win.ko.unwrap(valueAccessor()),
            groups = h.groups,
            groupsCollection,
            groupsLabel = "Label", // the convention for this property
            optionsCollProp = "Options", // the convention for this property
            optionsTextProp = "Text", // the convention for this property
            optionsValProp = "Value", // the convention for this property

            // helper functions that we'll use later
            koUtils = function() {

                // these functions have been copied from ko.utils (https://github.com/knockout/knockout/blob/master/src/utils.js)
                // - have to copy them in here because ko.utils doesn't expose them

                var ieVersion = document && (function() {
                        var version = 3,
                            div = document.createElement('div'),
                            iElems = div.getElementsByTagName('i');
                        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
                        while (
                            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
                            iElems[0]
                        ) {
                        }
                        return version > 4 ? version : undefined;
                    }()),
                    emptyDomNode = function(domNode) {
                        while (domNode.firstChild) {
                            win.ko.removeNode(domNode.firstChild);
                        }
                    },
                    setDomNodeChildren = function(domNode, childNodes) {
                        emptyDomNode(domNode);
                        if (childNodes) {
                            for (var i = 0, j = childNodes.length; i < j; i++)
                                domNode.appendChild(childNodes[i]);
                        }
                    },
                    setOptionNodeSelectionState = function(optionNode, isSelected) {
                        // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
                        if (ieVersion < 7)
                            optionNode.setAttribute("selected", isSelected);
                        else
                            optionNode.selected = isSelected;
                    };

                return {
                    emptyDomNode: emptyDomNode,

                    setDomNodeChildren: setDomNodeChildren,

                    setOptionNodeSelectionState: setOptionNodeSelectionState
                }
            }(),
            tryGetString = function(property, defaultVal) {

                return typeof property === "string" && property.length
                           ? property
                           : defaultVal;
            };

        // perform some checking of what we've been given to bind
        if (typeof groups === "undefined" || !groups) {
            throw "The \"groupedOption\" binding requires a \"groups\" object be specified.";
        } else {
            groupsCollection = groups.coll;
        }
        if (!groupsCollection) {
            throw "The \"groupedOption\" binding's \"groups\" object requires that a collection (array or observableArray) be specified.";
        }
        if (typeof groups.label === "string" && groups.label.length) {
            groupsLabel = groups.label;
        }

        // now get the specified properties, or use the defaults
        if (typeof groups.options === "object") {
            var optionsConfig = groups.options;
            optionsCollProp = tryGetString(optionsConfig.coll, optionsCollProp);
            optionsTextProp = tryGetString(optionsConfig.text, optionsTextProp);
            optionsValProp = tryGetString(optionsConfig.value, optionsValProp);
        }

        // find out which item is the currently-selected item
        var selectedItemProperty = h.value,
            selectedValue = win.ko.unwrap(selectedItemProperty);
        if (typeof selectedItemProperty === "function") {
            // this caters for the situation whereby the subscribing property *IS* an observable
            win.ko.utils.domData.set(element, "property", selectedItemProperty); // this records the subscribing property, i.e., the property which stores the selected item
        } else if (typeof selectedItemProperty === "string") {
            // this caters for the situation whereby the subscribing property *IS NOT* an observable
            win.ko.utils.domData.set(element, "property", selectedItemProperty); // this records the name of the subscribing property, i.e., the property which stores the selected item
        }

        // attach the view-model to the <select> element
        win.ko.utils.domData.set(element, "data", viewModel);

        var fragment = doc.createDocumentFragment();

        // consider the default <option> element
        if (h.optionsCaption && typeof h.optionsCaption === "string" && h.optionsCaption.length) {

            var defaultOption = doc.createElement("option");

            defaultOption.innerHTML = h.optionsCaption;

            // jQuery validation requires an empty 'value' attribute on the default node
            defaultOption.setAttribute("value", "");

            // and add this <option> to the in-progress DOM fragment
            fragment.appendChild(defaultOption);
        }


        // loop through each group in the collection
        var groupColl = win.ko.utils.unwrapObservable(groupsCollection);
        for (var groupIdx = 0, groupIdxMax = groupColl.length; groupIdx < groupIdxMax; groupIdx++) {

            var thisObservable = win.ko.unwrap(groupColl[groupIdx]),
                optionColl = win.ko.unwrap(groupColl[groupIdx][optionsCollProp]), // the Options collection for the current option-group
                optionIdxMax = optionColl.length,
                groupLabel = win.ko.unwrap(thisObservable[groupsLabel]);    // get the text to be displayed for this <optgroup>

            // if there is no label for the current group then don't add an <optgroup>
            if (!groupLabel || !groupLabel.length) {
                continue;
            }

            // create an <optgroup> element and set the 'label' attribute
            var optGroup = doc.createElement("optgroup");
            optGroup.setAttribute("label", groupLabel);

            // attach the current observable to the DOM element
            win.ko.utils.domData.set(optGroup, "data", thisObservable);

            
            // loop through each option object in the current group
            for (var optionIdx = 0; optionIdx < optionIdxMax; optionIdx++) {

                var thisOption = optionColl[optionIdx],
                    optionText = win.ko.unwrap(thisOption[optionsTextProp]),
                    optionVal = win.ko.unwrap(thisOption[optionsValProp]),
                    elmntOption = doc.createElement("option");

                elmntOption.innerHTML = optionText;

                // add the 'value' attribute if it exists
                if (optionVal && optionVal.length) {
                    elmntOption.setAttribute("value", optionVal);
                }

                // attach the current observable to the DOM element
                win.ko.utils.domData.set(elmntOption, "data", thisOption);

                // now add this <option> to the parent <optgroup>
                optGroup.appendChild(elmntOption);
            }

            // and add this <optgroup> to the in-progress DOM fragment
            fragment.appendChild(optGroup);
        }

        // remove all existing <optgroup> or <option> elements
        koUtils.emptyDomNode(element);

        // and add the above-processed DOM fragment
        element.appendChild(fragment);

        // now we have to mark which <option> element is selected
        // - ie6 doesn't like this being done before it's added to the DOM, so we've delayed this job until now
        var elmntOptSelected = win.ko.utils.arrayFirst(element.getElementsByTagName("option"), function(elmntOption) {
            return win.ko.utils.domData.get(elmntOption, "data") === selectedValue;
        });
        if (elmntOptSelected) {
            koUtils.setOptionNodeSelectionState(elmntOptSelected, true);
        }

        return true;
    }
};

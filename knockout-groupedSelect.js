/*!
 * knockout-groupedSelect.js v1.0.0
 * 
 * Copyright (c) Andrew Jameson, www.Supertext.ch
 * Available under the MIT license: http://opensource.org/licenses/MIT
 */


ko.bindingHandlers.groupedSelect = {
    update: function(element, valueAccessor) {

        // Get the parameters

        var h = ko.utils.unwrapObservable(valueAccessor());

        var groups = h["groups"],
            groupsCollection,
            groupsLabel = "Label",
            optionsCollProp = "Options",
            optionsTextProp = "Text",
            optionsValProp = "Value";

        if (typeof (groups) === "undefined" || !groups) {
            throw "The \"groupedSelect\" binding requires a \"groups\" object be specified.";
        } else {
            groupsCollection = groups["coll"];
        }
        if (!groupsCollection) {
            throw "The \"groupedSelect\" binding's \"groups\" object requires that a collection (array or observableArray) be specified.";
        }
        if (typeof (groups["label"]) === "string" && groups["label"].length) {
            groupsLabel = groups["label"];
        }
        if (typeof (groups["options"]) === "object") {
            var options = groups["options"];
            if (typeof (options["coll"]) === "string" && options["coll"].length) {
                optionsCollProp = options["coll"];
            }
            if (typeof (options["text"]) === "string" && options["text"].length) {
                optionsTextProp = options["text"];
            }
            if (typeof (options["val"]) === "string" && options["val"].length) {
                optionsValProp = options["val"];
            }
        }


        var defaultOpt = h["defaultOpt"],
            defaultOptText,
            defaultOptVal;
        if (typeof (defaultOpt) !== "undefined" && defaultOpt) {
            defaultOptText = defaultOpt["text"];
            defaultOptVal = defaultOpt["val"];
        }
        // only specify a default value for 'defaultOptVal' if 'defaultOptText' has been specified
        if ((typeof (defaultOptVal) !== "string" || !defaultOptVal || !defaultOptVal.length)
            && (typeof (defaultOptText) === "string" && defaultOptText && defaultOptText.length)) {
            defaultOptVal = "";
        }

        // find how many elements have already been added to 'element'
        var childCount = 0,
            children = element.childNodes,
            childMax = children.length;
        for (var c = 0; c < childMax; c++) {
            if (children[c].nodeType != 3) {
                childCount++;
            }
        }

		
        // Default <option> element

        // if 'element' is currently empty then add the default <option> element
        if (!childCount) {

            if (typeof(defaultOptText) === "string" && defaultOptText && defaultOptText.length) {
                var defaultOption = document.createElement("option");
				defaultOption.setAttribute("value", defaultOptVal);
                defaultOption.innerHTML = defaultOptText;
                element.appendChild(defaultOption);
            }
        } else {

            // if 'element' is not empty then decrement realChildren by 1, which represents the default <option> element
            childCount--;
        }


        // now it's time to loop through each <optgroup>
        // in this loop, i is set to the the index in the collection which marks the start of the newly-added items, skipping items already added (which were counted above)
        var coll = ko.utils.unwrapObservable(groupsCollection);
        childMax = coll.length;
        for (; childCount < childMax; childCount++) {

            var groupLabel = ko.utils.unwrapObservable(coll[childCount][groupsLabel]);

            // if there is no label for this <optgroup> then don't add the <optgroup>
            if (!groupLabel || !groupLabel.length) {
                continue;
            }

            var optGroup = document.createElement("optgroup");
            optGroup.setAttribute("label", groupLabel);

            // loop through each <option>
            // determine whether the <option>s collection is an array or an observableArray
            var options = ko.utils.unwrapObservable(coll[childCount][optionsCollProp]);
            for (var j = 0, jMax = options.length; j < jMax; j++) {

                var optionText = ko.utils.unwrapObservable(options[j][optionsTextProp]);

                // if there is no text for this <option> then don't add the <option>
                if (!optionText || !optionText.length) {
                    continue;
                }

                var option = document.createElement("option");
                option.innerHTML = optionText;

                // add the 'value' attribute if it exists
                var val = ko.utils.unwrapObservable(options[j][optionsValProp]);
                if (val && val.length) {
                    option.setAttribute("value", val);
                }

                // now add this <option> to the parent <optgroup>
                optGroup.appendChild(option);
            }

            element.appendChild(optGroup);
        }

        return true;
    }
};

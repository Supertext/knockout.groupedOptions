function buildMultiple(demoGroups) {
	
	return new vmMain_Multiple(demoGroups);
}

var vmMain_Multiple = function(groups) {

	var self = this;

	// This is the outermost collection which is bound to the <select> element.
	// This must always be stated in the 'data-bind' declaration.
	self.Groups = ko.observableArray();
	
	// This property holds the selected item from the options list
	self.SelectedOptions = ko.observableArray([]);
	
	self.SelectedText = ko.computed(function() {
		var selOpts = ko.unwrap(self.SelectedOptions),
			text = "";
		if (selOpts !== "undefined" && selOpts.length > 0) {
			for (var i = 0, iMax = selOpts.length; i < iMax; i++) {
				text += ko.unwrap(ko.unwrap(selOpts[i]).Text) + ", ";
			}
			return "You selected \"" + text.slice(0, -2) + "\"";
		}
		return "";
	});
	
	// IIFE constructor function
	(function(groups) {
		if (typeof(groups) !== "undefined" && groups) {	
			for (var i = 0, iMax = groups.length; i < iMax; i++) {
				self.Groups.push(new vmGroup_Multiple(groups[i]));
			}
		}
	}(groups));
}

// a view-model to represent an <optgroup> element
var vmGroup_Multiple = function(group) {

	var self = this;

	// This is the text which appears inside each <optgroup> element, using the element's 'label' attribute.
	// This property uses the conventional name and consquently may be omitted in the 'data-bind' declaration.
	self.Label = ko.observable();
	
	// This is the collection which represents the <option> elements for the context <optgroup>.
	// This property uses the conventional name and consquently may be omitted in the 'data-bind' declaration.
	self.Options = ko.observableArray();
	
	if (typeof(group) !== "undefined" && group) {
	
		self.Label(group.Label);
		
		for (var i = 0, iMax = group.Options.length; i < iMax; i++) {
			self.Options.push(new vmOption_Multiple(group.Options[i]));
		}	
	}
}

// a view-model to represent an <option> element
var vmOption_Multiple = function(option) {

	var self = this;

	// This is the text which appears inside each <option> element.
	// This property uses the conventional name and consquently may be omitted in the 'data-bind' declaration.
	self.Text = ko.observable();
	
	// This is the value associated with each <option> element, using the element's 'value' attribute.
	// This property uses the conventional name and consquently may be omitted in the 'data-bind' declaration.
	self.Value = ko.observable();
	
	if (typeof(option) !== "undefined" && option) {
	
		self.Text(option.Text);
		self.Value(option.Value);	
	}
}

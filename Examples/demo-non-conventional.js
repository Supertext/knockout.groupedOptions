function buildNonConventional(demoGroups) {
	
	return new vmMain_NonConventional(demoGroups);
}

var vmMain_NonConventional = function(groups) {

	var self = this;

	// This is the outermost collection which is bound to the <select> element.
	// This must always be stated in the 'data-bind' declaration.
	self.Groups = ko.observableArray();
	
	// This property holds the selected item from the options list
	self.SelectedOption = ko.observable();
	
	self.SelectedText = ko.computed(function() {
		if (self.SelectedOption()) {
			return "You selected \"" + self.SelectedOption().Display() + "\"";
		}		
		return "";
	});
	
	if (typeof(groups) !== "undefined" && groups) {
	
		for (var i = 0, iMax = groups.length; i < iMax; i++) {
			self.Groups.push(new vmGroup_NonConventional(groups[i]));
		}		
	}
}

// a view-model to represent an <optgroup> element
var vmGroup_NonConventional = function(group) {

	var self = this;

	// This is the text which appears inside each <optgroup> element, using the element's 'label' attribute.
	// This property DOES NOT use the conventional name and must consequently be stated in the 'data-bind' declaration.
	self.DisplayText = ko.observable();
	
	// This is the collection which represents the <option> elements for the context <optgroup>.
	// This property DOES NOT use the conventional name and must consequently be stated in the 'data-bind' declaration.
	self.Items = ko.observableArray();
	
	if (typeof(group) !== "undefined" && group) {
	
		self.DisplayText(group.Label);
		for (var i = 0, iMax = group.Options.length; i < iMax; i++) {
			self.Items.push(new vmOption_NonConventional(group.Options[i]));
		}
	
	}
}

// a view-model to represent an <option> element
var vmOption_NonConventional = function(option) {

	var self = this;

	// This is the text which appears inside each <option> element.
	// This property DOES NOT use the conventional name and must consequently be stated in the 'data-bind' declaration.
	self.Display = ko.observable();
	
	// This is the value associated with each <option> element, using the element's 'value' attribute.
	// This property DOES NOT use the conventional name and must consequently be stated in the 'data-bind' declaration.
	self.Val = ko.observable();
	
	if (typeof(option) !== "undefined" && option) {
	
		self.Display(option.Text);
		self.Val(option.Value);
	
	}
}
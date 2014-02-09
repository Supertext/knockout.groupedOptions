function buildNonObservable(demoGroups) {
	
	return new vmMain_NonObservable(demoGroups);
}

var vmMain_NonObservable = function(groups) {

	var self = this;

	// This is the outermost collection which is bound to the <select> element.
	// This must always be stated in the 'data-bind' declaration.
	self.Groups = [];
	
	// This property holds the selected item from the options list
	self.SelectedOption = null;
	
	if (typeof(groups) !== "undefined" && groups) {
	
		for (var i = 0, iMax = groups.length; i < iMax; i++) {
			self.Groups.push(new vmGroup_NonObservable(groups[i]));
		}		
	}
	
	self.display = function() {
		if (!self.SelectedOption) {
			alert("No selection has been made");
		} else {
			alert("You selected \"" + self.SelectedOption.Text + "\"");
		}
	}
}

// a view-model to represent an <optgroup> element
var vmGroup_NonObservable = function(group) {

	var self = this;

	// This is the text which appears inside each <optgroup> element, using the element's 'label' attribute.
	// This property uses the conventional name and consquently may be omitted in the 'data-bind' declaration.
	self.Label = null;
	
	// This is the collection which represents the <option> elements for the context <optgroup>.
	// This property uses the conventional name and consquently may be omitted in the 'data-bind' declaration.
	self.Options = [];
	
	if (typeof(group) !== "undefined" && group) {
	
		self.Label = group.Label;
		for (var i = 0, iMax = group.Options.length; i < iMax; i++) {
			self.Options.push(new vmOption_NonObservable(group.Options[i]));
		}
	
	}
}

// a view-model to represent an <option> element
var vmOption_NonObservable = function(option) {

	var self = this;

	// This is the text which appears inside each <option> element.
	// This property uses the conventional name and consquently may be omitted in the 'data-bind' declaration.
	self.Text = null;
	
	// This is the value associated with each <option> element, using the element's 'value' attribute.
	// This property uses the conventional name and consquently may be omitted in the 'data-bind' declaration.
	self.Value = null;
	
	if (typeof(option) !== "undefined" && option) {
	
		self.Text = option.Text;
		self.Value = option.Value;
	
	}
}
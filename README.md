knockout.groupedSelect
======================

Custom binding for knockoutjs which permits <select> elements containing <optgroup>s.


data-bind="groupedSelect: { 
							groups: { 
										coll: [groups collection  |  required; no default],
        								label: [name of textual property  |  default: 'Label'],
	        							options: {
        											coll: [name of the collection containing the <option> elements  |  default: 'Options']
        											text: [name of the textual property  |  default: 'Text'],
        											val: [name of the value property  |  default: 'Value']
										},
							}, 
							defaultOpt: {
										text: [text to be displayed for the default <option>, i.e., "Please select"  |  default: <option> not rendered],
										val: [value to be displayed for the default <option>  |  default: empty string (only if "text" has been specified]
							}
			}"

eg, data-bind="groupedSelect: { groups: { coll: TextTypes, label: 'Label', options: { coll: 'Options', text: 'Text', val: 'Value' } }, defaultOpt: { text: '- Please select -', val: '' }"

If using the conventions then this example may be shortened to
eg, data-bind="groupedSelect: { groups: { coll: TextTypes }, defaultOpt: { text: '- Please select -' } }"

export class CarbonCopy{

    constructor(parent_div, email, id){
        this.parent_div = parent_div;
        this.email = email;
        this.id = id;
        this.target_div = "";
        this.predefined = false;
    }

    createCcDiv(){
        /***
         * This function create cc div
         */

        // Create the element
        var cc_div = document.createElement('div');

        // Add attributes
        cc_div.id = "cc_div_" + this.id;
        cc_div.className = "add_border_bottom";
        this.parent_div.children['cc_section'].append(cc_div);

        // Append to parent
        this.target_div = cc_div;
    }

    createCcLabelField(){
        /***
         * This function will add cc label field
         */

        // Create label for recipient
        var label = document.createElement('h3');

        // Add attributes
        label.className = "recipient_label";
        label.innerHTML = "CC";

        // Append to parent
        this.target_div.append(label);
    }

    createCcInputField(){
        /***
         * This function adds recipients input field
         */

        // Create the element
        var input = document.createElement("input");

        // Add Attributes
        input.type = "text";
        input.id = 'cc_123' + this.id;
        input.name = 'cc_' + this.id;
        input.className = 'recipient_form_input';
        input.placeholder = "Enter Cc's Email";

        // Add predefine tags
        if( typeof this.email !== "undefined"){
            input.value = this.email;
            input.className = input.className + " predefined_input";
            this.predefined = true;
        }

        // Add on change event to update user email
        input.onchange = function(){
            this.email = input.value;
        }.bind(this)

        // Append to parent
        this.target_div.append(input);
    }
}

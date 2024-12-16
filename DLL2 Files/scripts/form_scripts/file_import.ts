export namespace cmpp.cmpp_importfile {
    let formContext;
 
    /** configure this event handler to be called in form OnLoad */
    export function OnLoad(executionContext: Xrm.Events.EventContext) {
       formContext = executionContext.getFormContext();
       
       //install other event handlers here
        
 
    }
 
    /** configure this event handler to be called in form OnSave */
    export function OnSave(executionContext: Xrm.Events.EventContext) {
       formContext = executionContext.getFormContext();
       updateImportId(executionContext);
    }

    function updateImportId(executionContext) {
        var formContext = executionContext.getFormContext();
        
        // Check if the form type is "create"
        var formType = formContext.ui.getFormType();
        if (formType !== 1) { // 1 indicates the Create form type
            return; // Exit if not in create mode
        }
    
        // Get the current value of the file name attribute
        var fileName = formContext.getAttribute("cmpp_name").getValue();
        
        if (fileName === null || fileName.trim() === "") {
            const now = new Date();
    
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const day = String(now.getDate()).padStart(2, '0');
    
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
    
            const currentDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
    
            formContext.getAttribute("cmpp_name").setValue(currentDateTime);
            formContext.data.save();
        }
    }
    

}

/*************************************************************
 * Email Consent Ribbon Script.
 * Last update 12/06/2024
 ************************************************************/

export function OnClick(primaryControl: Xrm.FormContext) {
    runConsentEmail(primaryControl);

}


function runConsentEmail(primaryControl) {
    let formContext = primaryControl;

    // Get the GUID of the entity record
    var guid = formContext.data.entity.getId();

    if (!guid) {
        Xrm.Navigation.openAlertDialog({
            text: "The record must first be saved",
            title: "Record Not Saved",
            confirmButtonLabel: "OK"
        });
        return; // Exit the function if the record is not saved
    }

    
     // Name of the action (workflow)
    var actionName = "ExecuteWorkflow"; 

    var executeWorkflowRequest = {
        entity: {
            id: "34e84019-64b2-ef11-b8e9-001dd83058e3", 
            entityType: "workflow"  
        },
        EntityId: {guid}, 
        getMetadata: function () {
            return {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "mscrm.workflow",  
                        "structuralProperty": 5
                    },
                    "EntityId": {
                        "typeName": "Edm.Guid",  
                        "structuralProperty": 1
                    }
                },
                operationType: 0,  
                operationName: actionName  
            };
        }
    };
    
    // Display a progress indicator while processing
    Xrm.Utility.showProgressIndicator("Processing Email...");

    // Execute the workflow using Xrm.WebApi
    Xrm.WebApi.online.execute(executeWorkflowRequest).then(
        function success(result) {
            if (result.ok) {  
             
                console.log("Workflow executed successfully.:");
            }
            Xrm.Utility.closeProgressIndicator(); 
        },
        function (error) {
            // Handle error if the workflow execution fails
            Xrm.Navigation.openErrorDialog({ message: "Error: " + error.message, details: error.message });
            Xrm.Utility.closeProgressIndicator(); 
        }
    );
}
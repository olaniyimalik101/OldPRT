

/*************************************************************
 * File Import Ribbon Script.
 * Last update 12/06/2024
 ************************************************************/

export function OnClick(primaryControl: Xrm.FormContext) {
    BeginFileImport(primaryControl);

}

function BeginFileImport(primaryControl) {
    let formContext = primaryControl;
    let duplicateOption = formContext.getAttribute("cmpp_duplicatehandling").getValue();
    let pluginCalled = false;

    // Check if duplicateOption is null or undefined
    if (duplicateOption == null) {
        var mesgTitle = "Duplicate Handling Is Empty";
        var details = "Duplicate Handling Field is Mandatory. Please select an option.";
        Xrm.Navigation.openErrorDialog({ message: mesgTitle, details: details });
        return;
    }
    if (!pluginCalled) {
        var objActionCallRequest = null;
        let actionName = "cmpp_FileValidationandImport";

        var parameters = {};
        var entity = {};
        entity.id = formContext.data.entity.getId().replace("{", "").replace("}", "");
        entity.entityType = "cmpp_importfile";
        parameters.entity = entity;
        parameters.DuplicateHandlingOption = duplicateOption;

        try {
            objActionCallRequest = {
                entity: parameters.entity,
                DuplicateHandlingOption: parameters.DuplicateHandlingOption,
                getMetadata: function () {
                    return {
                        boundParameter: "entity",
                        parameterTypes: {
                            "entity": {
                                "typeName": "mscrm.cmpp_importfile",
                                "structuralProperty": 5
                            },
                            "DuplicateHandlingOption": {
                                "typeName": "Edm.Int32",
                                "structuralProperty": 1
                            }
                        },
                        operationType: 0,
                        operationName: actionName
                    };
                }
            };

            Xrm.Utility.showProgressIndicator("Processing File Validation and Import...");
            
            Xrm.WebApi.online.execute(objActionCallRequest).then(
                function success(result) {
                    if (result.status === 200) {  // Checking for success status
                        result.json().then(function (response) {
                            
                            if (response) {
                                console.log("Respons: " + response.Response);
                                
                                showValidationandImportUpdate(response.Response);
                            }
                        });
                    } else {
                        Xrm.Navigation.openErrorDialog({ message: "Issue in File Import", details: "Import execution failed" });
                    }
                    Xrm.Utility.closeProgressIndicator();
                },
                function (ex) {
                    Xrm.Navigation.openErrorDialog({ message: "Error: " + ex.message, details: ex.message });
                    Xrm.Utility.closeProgressIndicator();
                }
            );
        } catch (ex) {
            Xrm.Navigation.openErrorDialog({ message: ex.message, details: ex.message });
            Xrm.Utility.closeProgressIndicator();
        }
    }
}

function showValidationandImportUpdate(validationResponse) {
    
    // Close the progress indicator before displaying the result
    Xrm.Utility.closeProgressIndicator();

    // If validation is not successful
    if (!validationResponse.IsSuccess) {
        // Parse the JSON response if it's a string
        var parsedResponse;
        if (typeof validationResponse === "string") {
            try {
                parsedResponse = JSON.parse(validationResponse);  // Parsing the JSON response string
            } catch (e) {
                console.error("Error parsing JSON response:", e);
                parsedResponse = validationResponse; // In case parsing fails, use the original response
            }
        } else {
            parsedResponse = validationResponse; // If already an object, use it as is
        }

        // Ensure failureReason exists and is an array, otherwise handle it as a string or empty array
        var errorMessages = "";
        if (Array.isArray(parsedResponse.failureReason)) {
            errorMessages = parsedResponse.failureReason.join("\n");
        } else if (typeof parsedResponse.failureReason === "string") {
            errorMessages = parsedResponse.failureReason;
        } else {
            errorMessages = "Unknown error occurred."; // In case failureReason is undefined or not valid
        }
      
        var message = "Validation Failed:\n" + errorMessages;
        var alertStrings = {
            confirmButtonLabel: "OK",
            text: message,
            title: "Validation Errors"
        };

        var alertOptions = { height: 300, width: 450 };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
    }
    // If validation is successful
    else {
        var successMessage = "File validation is successful. Import will run in the background. Please check the Import Record tab for import details.";
        var successAlertStrings = {
            confirmButtonLabel: "OK",
            text: successMessage,
            title: "Validation Successful"
        };
        
        var successAlertOptions = { height: 150, width: 450 };
        Xrm.Navigation.openAlertDialog(successAlertStrings, successAlertOptions);
    }
}



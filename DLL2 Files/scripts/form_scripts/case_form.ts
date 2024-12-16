
/*************************************************************
 * Enrollment Case Form Script.
 * Last update 11/12/2024
 ************************************************************/

export namespace cmpp.cmpp_case {
   let formContext;

   /** configure this event handler to be called in form OnLoad */
   export function OnLoad(executionContext: Xrm.Events.EventContext) {
      formContext = executionContext.getFormContext();
      
      //install other event handlers here
      let dobAttr = formContext.getAttribute("cmpp_dob");
      dobAttr && dobAttr.addOnChange(validateDayOfBirth);

   }

   /** configure this event handler to be called in form OnSave */
   export function OnSave(executionContext: Xrm.Events.EventContext) {
      formContext = executionContext.getFormContext();

      populateCaseNameOnSave(executionContext);
   }

   /** enfore cmpp_dob not in future */
   function validateDayOfBirth(execCtx: Xrm.Events.EventContext) {
      let formCtx = execCtx.getFormContext();

      let dobAttr = formCtx.getAttribute("cmpp_dob")
      let dobAttrValue = dobAttr? dobAttr.getValue() : null;
      if (dobAttrValue==null) return;

		let currentDate = new Date();

		let failed = false;
		let errorMessage = "";

		if (dobAttrValue >= currentDate) {
			failed = true;
			errorMessage = "date value cannot be in the future";
		}

      let dobCtr = formCtx.getControl("cmpp_dob");
		if (failed) {
			(dobCtr as any).setNotification(errorMessage, "cmpp_dob_unique_notification_id");
		} else {
			(dobCtr as any).clearNotification("cmpp_dob_unique_notification_id");
		}
		return failed;
	}

   /**Populate case number using ANumber and Location */
   function populateCaseNameOnSave(execCtx: Xrm.Events.EventContext){
      let formCtx = execCtx.getFormContext();
      var formType = formContext.ui.getFormType();
      if (formType !== 1 && formType !== 2) {
         return; // Record is NOT editable (Create or Update mode)
      }

      let nameAttr = formCtx.getAttribute("cmpp_name");
      let aNumberAttr = formCtx.getAttribute("cmpp_anumber");
      let locationAttr = formCtx.getAttribute("cmpp_location");

      //if cmpp_name, a# or location is not on form, do nothing
      if (!nameAttr || !aNumberAttr || !locationAttr) return;

      let aNumberValue = aNumberAttr && aNumberAttr.getValue()!=null? aNumberAttr.getValue() : "";
      let locAttrValue = locationAttr && locationAttr.getValue()!=null? locationAttr.getValue()[0].name : "";
      
      if (aNumberValue!=="" || locAttrValue!=="") {
         nameAttr.setValue(aNumberValue+"-"+locAttrValue);
         //refresh the form so the populated value of case name can be see
         //formCtx.data.refresh(false);  
      }

   }
}

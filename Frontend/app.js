console.log("Dearme is running");
 function predictNextPeriod(startDateString){
    let startDate=new Date(startDateString);
    let nextDate=new Date(startDate);
    nextDate.setDate(startDate.getDate()+28);
    return nextDate.toDateString();
    }

    function updatePredictionText(message){
        let predictionText=document.getElementById("predictionText");
        predictionText.textContent = message;
    }
let button=document.getElementById("logButton");
button.addEventListener("click",function(){
    let dateInput=document.getElementById("periodDate");
    let selectedDate=dateInput.value;

    if(selectedDate === ""){
        updatePredictionText("Please select a date first!");
        return;
    }
   
    let result=predictNextPeriod(selectedDate);
    updatePredictionText("Your next period is predicted on: "  + result);
});
console.log("Dearme is running");
 function predictNextPeriod(startDateString){
    let startDate=new Date(startDateString);
    let nextDate=new Date(startDate);
    nextDate.setDate(startDate.getDate()+28);
    return nextDate.toDateString();
    }
let button=document.getElementById("logButton");
button.addEventListener("click",function(){
    let dateInput=document.getElementById("periodDate");
    let selectedDate=dateInput.value;
    let predictionText=document.getElementById("predictionText");
    if(selectedDate === ""){
        let predictionText=document.getElementById("predictionText");
        predictionText.textContent="Please select a date first!";
        return;
    }
   
    let result=predictNextPeriod(selectedDate);
    predictionText.textContent= "Your next period is predicted on: "  + result;
});
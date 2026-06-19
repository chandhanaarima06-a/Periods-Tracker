console.log("Dearme is running");
let button=document.getElementById("logButton");
button.addEventListener("click",function(){
    let dateInput=document.getElementById("periodDate");
    let selectedDate=dateInput.value;
    let startDate=new Date(selectedDate);
    let nextDate=new Date(startDate);
    nextDate.setDate(startDate.getDate()+28);
    let predictionText=document.getElementById("predictionText");
    predictionText.textContent= "Your next period is predicted on: "  + nextDate.toDateString();
});
import { useState } from "react";
function CycleTracker(){
    const[selectedDate,setSelectedDate]=useState('');
    const[prediction,setPrediction]=useState('Log your period date to see your prediction here.');

    function handleDateChange(event){
        setSelectedDate(event.target.value);
    }
    function handlelogPeriod(){
        if(selectedDate===''){
            setPrediction('Please select a date first!');
            return;
        }

        let startDate =new Date(selectedDate);
        let nextDate =new Date(startDate);
        nextDate.setDate(startDate.getDate()+28);
        setPrediction('Your next period is predicted on: ' +nextDate.toDateString());
    }

    return(
        <main>
            <h1>Welcome to DearMe</h1>
            <p>Your personel tracker and comforter. </p>
            <label>Period start Date</label>
            <input type="date" onChange={handleDateChange}/>
            <button onClick={handlelogPeriod}>Log Period</button>
            <section>
                <h3>Your next Predicted Period</h3>
                <p> {prediction} </p>
            </section>
        </main>
    );
}
export default CycleTracker;
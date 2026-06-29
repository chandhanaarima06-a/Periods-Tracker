import {useState} from 'react';

function Signup(){
    const[name,setName]=useState('');
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    function handleSignup(){
        if(name === ''||email=== ''||password===''){
            alert('Please fill in all the fields');
            return;
        }
        console.log('Signing up with:',name,email);
    }
    return(
        <main>
            <h1>Create Your Account</h1>
            <p>Join DearMe and start tracking your Cycle.</p>
            <label>Name</label>
            <input type="text" placeholder="Enter your Name" onChange={(e)=>setName(e.target.value)} />
            <label>Email</label>
            <input type="email" placeholder="Enter your Email" onChange={(e)=>setEmail(e.target.value)} />
            <label>Password</label>
            <input type="password" placeholder="Create a Password" onChange={(e)=>setPassword(e.target.value)} />
            <button onClick={handleSignup}>Sign Up</button>
        </main>
    );
}
export default Signup;
import {useState} from 'react';
function Login(){
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    function handleLogin(){
        if(email===''||password==='')
        {
            alert('Please fill in all the fields');
            return;
        }
        console.log('Logging in with: ',email);
    }
    return(
        <main>
            <h1>Welcome Back</h1>
            <p>Log in to your DearMe account.</p>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)}/>
            <label>Password</label>
            <input type="Password" placeholder="Create a Password" onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Login</button>


        </main>
    );
}
export default Login;
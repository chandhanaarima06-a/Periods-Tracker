import {SignIn} from '@clerk/clerk-react';
function Login(){
    return(
        <main>
            <h1>Welcome Back</h1>
            <SignIn
                routing="path"
                path="/login"
                signUpUrl="/signup"
                fallbackRedirectUrl="/"
            />
        </main>
    );
}
export default Login;
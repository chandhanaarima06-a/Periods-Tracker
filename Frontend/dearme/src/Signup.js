import { SignUp } from '@clerk/clerk-react';

function Signup() {
    return (
        <main>
            <h1>Create Your Account</h1>
            <p>Join DearMe and start tracking your Cycle.</p>
            <SignUp
                routing="path"
                path="/signup"
                signInUrl="/login"
                fallbackRedirectUrl="/"
            />
        </main>
    );
}
export default Signup;
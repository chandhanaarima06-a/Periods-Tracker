 import { Link } from 'react-router-dom';
 import { useUser,SignOutButton } from '@clerk/clerk-react';
 function NavBar(){
    const{isSignedIn,user}=useUser();
    return(
        <nav>
            <h2>DearMe</h2>
            <div>
                <Link to="/">Home</Link>
                {isSignedIn ?(
                  <>
                  <span>Hi,{user.firstName}!</span>
                  <SignOutButton/>
                  </>  
                ):(
                    <> 
                    <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
                </>
                )
                }
                
            </div>
        </nav>
    );

}
export default NavBar;
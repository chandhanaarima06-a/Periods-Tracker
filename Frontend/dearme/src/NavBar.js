 import { Link } from 'react-router-dom';
 function NavBar(){
    return(
        <nav>
            <h2>DearMe</h2>
            <div>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </div>
        </nav>
    );

}
export default NavBar;
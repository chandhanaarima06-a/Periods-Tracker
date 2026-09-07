import { useUser, SignOutButton } from '@clerk/clerk-react';

function NavBar() {
    const { isSignedIn, user } = useUser();
    return (
        <nav className="topbar">
            <h2>DearMe</h2>
            {isSignedIn && (
                <div className="topbar-right">
                    <span>Hi, {user.firstName}!</span>
                    <SignOutButton />
                </div>
            )}
        </nav>
    );
}

export default NavBar;

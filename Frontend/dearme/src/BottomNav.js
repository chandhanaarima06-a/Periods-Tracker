import { NavLink } from 'react-router-dom';

function BottomNav() {
    return (
        <nav className="bottom-nav">
            <NavLink
                to="/"
                end
                className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}
            >
                <span className="bottom-nav-icon">🏠</span>
                <span className="bottom-nav-label">Home</span>
            </NavLink>
            <NavLink
                to="/calendar"
                className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}
            >
                <span className="bottom-nav-icon">📅</span>
                <span className="bottom-nav-label">Calendar</span>
            </NavLink>
            <NavLink
                to="/diary"
                className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}
            >
                <span className="bottom-nav-icon">📓</span>
                <span className="bottom-nav-label">Diary</span>
            </NavLink>
            <NavLink
                to="/reminders"
                className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}
            >
                <span className="bottom-nav-icon">⏰</span>
                <span className="bottom-nav-label">Reminders</span>
            </NavLink>

            <style>{`
                .bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    border-top: 1px solid #e6d5d5;
                    box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 8px 0;
                    z-index: 100;
                }
                .bottom-nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-decoration: none;
                    color: #999;
                    font-size: 11px;
                    gap: 2px;
                    padding: 4px 10px;
                    border-radius: 8px;
                    transition: color 0.2s;
                }
                .bottom-nav-item.active {
                    color: var(--rose-deep, #c0606a);
                    font-weight: 600;
                }
                .bottom-nav-icon {
                    font-size: 20px;
                    line-height: 1;
                }
                .bottom-nav-label {
                    font-size: 10px;
                    font-weight: 500;
                }
            `}</style>
        </nav>
    );
}

export default BottomNav;

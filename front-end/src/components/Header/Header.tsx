import './styles/index.css';

interface HeaderProps {
    status: 'connecting' | 'connected' | 'disconnected';
    onLogout: () => void;
}

const STATUS_COLORS: Record<HeaderProps['status'], string> = {
    connected: '#22c55e',
    connecting: '#f59e0b',
    disconnected: '#ef4444',
};

const STATUS_LABELS: Record<HeaderProps['status'], string> = {
    connected: 'Connected',
    connecting: 'Connecting…',
    disconnected: 'Disconnected',
};
export const Header = ({ status, onLogout }: HeaderProps) => {
    return (
        <div className="app-header">
            <span className="header-title">
                Trading Dashboard
            </span>
            <span className="header-status">
                <span
                    className="status-dot"
                    style={{ backgroundColor: STATUS_COLORS[status] }}
                />
                {STATUS_LABELS[status]}
            </span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
    );
}
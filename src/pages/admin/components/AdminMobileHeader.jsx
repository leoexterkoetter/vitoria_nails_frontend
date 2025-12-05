import { Menu, Bell } from 'lucide-react';

export default function AdminMobileHeader({ onMenuClick, pendingCount = 0 }) {
  return (
    <header className="mobile-header">
      <button className="mobile-menu-btn" onClick={onMenuClick}>
        <Menu size={24} />
      </button>
      
      <span className="mobile-brand">💅 Vitoria Nail</span>
      
      <button className="mobile-menu-btn" style={{ position: 'relative' }}>
        <Bell size={20} />
        {pendingCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '18px',
            height: '18px',
            background: '#EF4444',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: '700',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </button>
    </header>
  );
}

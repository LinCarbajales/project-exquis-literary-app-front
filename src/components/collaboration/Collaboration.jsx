import React from 'react';
import './Collaboration.css';

const Collaboration = ({ 
  username, 
  text, 
  isPrevious = false,
  showSeparator = true 
}) => {
  return (
    <>
      <div className={`collaboration ${isPrevious ? 'collaboration-previous' : ''}`}>
        <div className="collaboration-left">
          <div className="collaboration-avatar">
            <span className="avatar-icon">🖋️</span>
          </div>
          <span className="collaboration-username">@{username}</span>
        </div>
        <div className="collaboration-content">
          <div className="collaboration-text">
            {text}
          </div>
        </div>
      </div>
      {showSeparator && <div className="collaboration-separator"></div>}
    </>
  );
};

export default Collaboration;
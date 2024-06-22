import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Inbox.css';


function Navigation({    }) {
  const location = useLocation();
  return (
    <div className="container">

        <div className="topnav">
  <ul>
    <li>
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Inbox</Link>
    </li>
    <li>
      <Link to="/sent" className={location.pathname === '/sent' ? 'active' : ''}>Sent Messages</Link>
    </li>
    <li>
      <Link to="/drafts" className={location.pathname === '/drafts' ? 'active' : ''}>Drafts</Link>
    </li>
  </ul>
</div>


      
          <Outlet /> 
      
    
    </div>
  );
}


export default Navigation;

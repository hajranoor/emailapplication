import './App.css';
// import MyComponent from './Mycomponent';
import Navigation from './myComponents/navigation';
import React from 'react';

import { useState } from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import MessageDetail from './message';
import SentBox from './myComponents/SentBox';
import Inbox from './myComponents/Inbox'
import DraftBox from './myComponents/DraftBox'
import InboxDetails from './myComponents/InboxDetails'
import SentBoxDetails from './myComponents/SentBoxDetails'


function App() {




  
  return (
    <div className="App">
      <Router>
        <Navigation  />
        <Routes>
          <Route path="/" element={<Inbox />} />
          <Route path="/sent" element={<SentBox />} />
          <Route path="/drafts" element={<DraftBox />} />
          {/* <Route path="/message/:UID" element={<MessageDetail />} /> */}
          <Route path="/InboxDetails" element={<InboxDetails />} />
          <Route path="/SentBoxDetails" element={<SentBoxDetails />} />


        </Routes>
      </Router>
      
       {/* <Navigation contentComponent={getContentComponent(selectedOption)} setSelectedOption={setSelectedOption} /> */}
    </div>
  );

  
  
}

export default App;

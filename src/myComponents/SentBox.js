import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../myComponents/Inbox.css'

function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}



export default function SentBox() {

  
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);

  function handleCardClick(selectedMessage) {
    setSelectedMessage(selectedMessage);

    navigate("/SentBoxDetails", {
      state: { subject: selectedMessage.subject, body: selectedMessage.body, attachment: selectedMessage.attachment, fromAddress: selectedMessage.fromAddress, fromName: selectedMessage.fromName,  },
    });
  }

  function handleAttachmentClick(item) {
  if (item.attachment) {
    if (item.attachment.content && item.attachment.contentType) {
      const contentType = item.attachment.contentType;
      const base64Content = item.attachment.content;
      // const base64Content = Buffer.from(item.attachment.content, "base64").toString();

      // Handle common content types
      if (contentType.startsWith("image/")) {
        // For images, display in a new window/tab
        // const imageSrc = `data:${contentType};base64,${base64Content}`;
        const imageSrc = `data:image/png;base64,${base64Content}`;
        const newWindow = window.open();
        newWindow.document.write(`<img src="${imageSrc}" alt="Attachment" />`);
      } else if (contentType === "application/pdf") {
        // For PDFs, display in a new window/tab
        const pdfSrc = `data:${contentType};base64,${base64Content}`;
        const newWindow = window.open();
        newWindow.document.write(`<embed src="${pdfSrc}" type="${contentType}" />`);
      } else {
        // For other content types, open as a download link
        const blob = b64toBlob(base64Content, contentType);
        const blobUrl = window.URL.createObjectURL(blob);
        const newWindow = window.open(blobUrl);
        newWindow.document.write(`<a href="${blobUrl}" download="attachment.${contentType.split('/')[1]}">Download Attachment</a>`);
      }
    }
  }
}

  

function handleAttachment(item) {

}








  function handlePreviousClick(currentPage) {
    setCurrentPage(currentPage - 1);

    var haha = currentPage - 1;
    const url = `http://localhost:3001/getSentMsgs?page=${haha}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log("data from backend inside function", data);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  }

  function handleNextClick(currentPage) {
    setCurrentPage(currentPage + 1);

    var haha = currentPage + 1;
    const url = `http://localhost:3001/getSentMsgs?page=${haha}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log("data from backend inside function", data);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  }

  const initialPage = 1;
  const url = `http://localhost:3001/getSentMsgs?page=${initialPage}`;

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log("this is inital data from backend", data);
      })
      .catch((error) => {
        console.error("Error:  ", error);
      });
  }, []);

  return (
    <div class="email-container">
  <div class="email-header">
    <h1>This is data from the backend</h1>
  </div>
  <ul class="email-list">
    {data.map((item, index) => (
      <li key={index} onClick={() => handleCardClick(item)} class="email-card">
        <div class="email-sender">{item.fromName}</div>
        <div class="email-content">
          <strong class="email-subject">{item.subject ? item.subject : "No Subject"}</strong>
          <span class="email-date">({item.date})</span>
        </div>
      </li>
    ))}
  </ul>
  <div class="email-pagination">
    <button onClick={() => handlePreviousClick(currentPage)}>Previous</button>
    <button onClick={() => handleNextClick(currentPage)}>Next</button>
  </div>
</div>
  );
}
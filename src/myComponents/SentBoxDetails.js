import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import '../myComponents/InboxDetails.css'

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

export default function SentBoxDetails() {
  const location = useLocation();
  const { state } = useLocation();
  const navigate = useNavigate();

  function handleClick(event) {
    navigate("/sent");
  }

  function handleAttachmentClick(item) {
    

      if (item.content && item.contentType) {
        const contentType = item.contentType;
        const base64Content = item.content;
        // const base64Content = Buffer.from(item.attachment.content, "base64").toString();
  
        // Handle common content types
        if (contentType.startsWith("image/")) {
          // For images, display in a new window/tab
          // const imageSrc = `data:${contentType};base64,${base64Content}`;
          const imageSrc =  `data:${contentType};base64,${base64Content}`;
        //   `data:image/png;base64,${base64Content}`;
          const newWindow = window.open();
          newWindow.document.write(`<img src="${imageSrc}" alt="Attachment" />`);
        } else if (contentType === "application/pdf") {
          // For PDFs, display in a new window/tab
          const pdfSrc = `data:${contentType};base64,${base64Content}`;
          const newWindow = window.open();
          newWindow.document.write(`<embed src="${pdfSrc}" type="${contentType}" />`);
        } else {
        //     const MediaSrc = `data:${contentType};base64,${base64Content}`;
        //   const newWindow = window.open();
        //   newWindow.document.write(`<embed src="${MediaSrc}" type="${contentType}" />`);



          // For other content types, open as a download link
          const blob = b64toBlob(base64Content, contentType);
          const blobUrl = window.URL.createObjectURL(blob);
          const newWindow = window.open(blobUrl);
          newWindow.document.write(`<a href="${blobUrl}" download="attachment.${contentType.split('/')[1]}">Download Attachment</a>`);
        }
      }
    // }
  }
  

  return (

<div className="inbox-details-container"> {/* Add the class name */}
      <button type="button" onClick={handleClick}>
        Go Back
      </button>
      <p>hello, this is a test component</p>
      <p className="subject"> {/* Add a class for the subject */}
        {location.state.subject}
      </p>
      <div className="from-details"> {/* Container for From Name and From Address */}
        <p>{location.state.fromName}</p>
        <p>{location.state.fromAddress}</p>
      </div>
      <p>{location.state.body}</p>
      {location.state.attachment && (
        <div>
          {/* Attachment information */}
          <p>Attachment: {location.state.attachment.contentType}</p>
          <button onClick={() => handleAttachmentClick(location.state.attachment)}>
            View Attachment
          </button>
        </div>
      )}
    </div>

















//     <div>
//       <button type="button" onClick={handleClick}>
//         Go Back
//       </button>
//       <p>hello this is test component</p>
//       <p>{location.state.subject}</p>
//       <p>{location.state.fromName}</p>
//       <p>{location.state.fromAddress}</p>
//       <p>{location.state.body}</p>
//       {location.state.attachment && (
//         <div>
// //     <p>Attachment: {location.state.attachment.contentType}</p>
// //     <button onClick = {() => handleAttachmentClick(location.state.attachment)}>
// //     View Attachment 
// //     </button>
// //   </div>

//       )}
//     </div>
  );
}

// {item.attachment && (
//   <div>
//     <p>Attachment: {item.attachment.content}</p>
//     <button onClick = {() => handleAttachmentClick(item)}>
//     View/Download Attachment 
//     </button>
//   </div>
// )}

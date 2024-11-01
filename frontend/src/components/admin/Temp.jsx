import React from 'react'
import { jsPDF } from "jspdf";
import { useState ,useEffect } from 'react';

// Default export is a4 paper, portrait, using millimeters for units
export default function Temp() {
    const [startups, setStartups] = useState([]);
    const downloadPdf = () => {
        const doc = new jsPDF();
      
        startups.forEach((startup, index) => {
          const { kyc, progress } = startup;
      
          // Add a light purple background color to the page
          doc.setFillColor(240, 240, 255); // Light purple background (RGB)
          doc.rect(0, 0, 210, 297, 'F'); // 'F' for filled, covering the entire page
      
          // Set font style for headings
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.setTextColor(75, 0, 130); // Dark purple color for headings
      
          // Company Name (as a heading)
          doc.text(`${kyc.company_name} Details`, 10, 10 + index * 130);
      
          // Set up two-column layout by adjusting X coordinates for the details
          const leftColumnX = 10;
          const rightColumnX = 110;
      
          // Add background color for the detail blocks
          doc.setFillColor(220, 220, 250); // Slightly darker purple for the details
          doc.rect(10, 15 + index * 130, 90, 50, 'F'); // Left block
          doc.rect(110, 15 + index * 130, 90, 50, 'F'); // Right block
      
          // Left Column Details
          doc.setFontSize(12);
          doc.setTextColor(128, 0, 128); // Purple color for labels
          doc.setFont("helvetica", "bold");
          doc.text("Industry:", leftColumnX, 20 + index * 130);
          doc.text("Website:", leftColumnX, 30 + index * 130);
          doc.text("Contact Email:", leftColumnX, 40 + index * 130);
          doc.text("Created At:", leftColumnX, 50 + index * 130);
      
          // Right Column Details
          doc.text("Incorporation Date:", rightColumnX, 20 + index * 130);
          doc.text("Contact Person:", rightColumnX, 30 + index * 130);
          doc.text("Contact Phone:", rightColumnX, 40 + index * 130);
          doc.text("Progress", rightColumnX, 50 + index * 130);
      
          // Insert the actual values in normal text style
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
      
          // Left Column Values
          doc.text(kyc.company_details.industry, leftColumnX + 40, 20 + index * 130);
          doc.text(kyc.company_details.website, leftColumnX + 40, 30 + index * 130);
          doc.text(kyc.contact_person.email, leftColumnX + 40, 40 + index * 130);
          doc.text(
            kyc.created_at ? new Date(kyc.created_at).toLocaleDateString() : "N/A",
            leftColumnX + 40,
            50 + index * 130
          );
      
          // Right Column Values
          doc.text(
            new Date(kyc.company_details.incorporation_date).toLocaleDateString(),
            rightColumnX + 50,
            20 + index * 130
          );
          doc.text(kyc.contact_person.name, rightColumnX + 50, 30 + index * 130);
          doc.text(kyc.contact_person.phone, rightColumnX + 50, 40 + index * 130);
      
          // Progress Section (can be handled separately as a list if needed)
          let progressY = 60 + index * 130;
          progress.forEach((item, idx) => {
            const offset = idx * 10;
            doc.text(`- Milestones: ${item.milestones}`, leftColumnX, progressY + offset);
            doc.text(`  Revenue: ${item.financials.revenue}`, leftColumnX, progressY + offset + 5);
            doc.text(`  Expenses: ${item.financials.expenses}`, leftColumnX, progressY + offset + 10);
          });
      
          if (index < startups.length - 1) {
            doc.addPage();
          }
        });
      
        doc.save("styled_startups_report.pdf");
      };
      
    
    useEffect(() => {
        fetch('admin/startups')
          .then((response) => response.json())
          .then((data) => setStartups(data))
          .catch((error) => console.error('Error fetching startups:', error))
      }, [])
    return (
    <div>
      <button onClick={downloadPdf}>
        Download PDf
      </button>
    </div>
  )
}

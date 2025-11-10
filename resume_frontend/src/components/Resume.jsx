import React from "react";
import "daisyui/dist/full.css";
import { FaGithub, FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { useRef } from "react"; // Removed unused useState
import { useReactToPrint } from "react-to-print";

const Resume = ({ data }) => {
  const resumeRef = useRef(null);

  const handleDownloadPdf = async () => {
    const element = resumeRef.current;

    // ✅ Clone the element to avoid modifying the visible one
    const clone = element.cloneNode(true);
    const newStyle = document.createElement('style');
    newStyle.textContent = `
      #pdf-clone {
        max-width: none !important;
        width: 794px !important; /* A4 width in px */
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box;
      }
      #pdf-clone > * {
        max-width: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      #pdf-clone .mx-auto {
        margin-left: auto !important;
        margin-right: auto !important;
        width: 100% !important;
      }
    `;
    clone.id = 'pdf-clone';
    clone.appendChild(newStyle);
    document.body.appendChild(clone); // Temporarily add to DOM for capture

    const a4WidthPx = 794;

    const dataUrl = await toPng(clone, {
      quality: 1.0,
      backgroundColor: "#ffffff",
      pixelRatio: 2,
      width: a4WidthPx,
    });

    // Clean up clone
    document.body.removeChild(clone);

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // ✅ NEW: 10mm padding (left/right margins) in PDF
    const margin = 5; // mm
    const contentWidth = pdfWidth - 2 * margin;

    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // ✅ Calculate px height per page (adjusted for content width scaling)
        const pxPerPage = (pdfHeight * img.width) / contentWidth;

        let yPosition = 0;

        // ✅ Multi-page loop: Slice image into page-sized chunks
        while (yPosition < img.height) {
          if (yPosition > 0) {
            pdf.addPage();
          }

          const sliceHeightPx = Math.min(img.height - yPosition, pxPerPage);

          // Create temporary canvas to slice the image
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = img.width;
          tempCanvas.height = sliceHeightPx;
          const ctx = tempCanvas.getContext('2d');
          ctx.drawImage(
            img,
            0, yPosition,      // Source x, y
            img.width, sliceHeightPx, // Source width, height
            0, 0,              // Dest x, y
            img.width, sliceHeightPx // Dest width, height
          );

          const sliceDataUrl = tempCanvas.toDataURL('image/png');

          // Calculate scaled height for this slice in mm
          const sliceScaledHeight = (sliceHeightPx / img.width) * contentWidth;

          // Add slice with margins, full content width
          pdf.addImage(
            sliceDataUrl,
            'PNG',
            margin, 0,         // Position with left margin, top=0
            contentWidth, sliceScaledHeight
          );

          yPosition += sliceHeightPx;
        }

        resolve();
      };
      img.onerror = reject;
      img.src = dataUrl;
    });

    pdf.save(`${data.personalInformation.fullName}.pdf`);
  };

  return (
    <>
      <div
        ref={resumeRef}
        className="max-w-2xl mx-auto shadow-2xl rounded-lg p-8 space-y-6 bg-base-100 text-base-content "
      >
        {/* Header Section */}
        <div className="text-center space-y-2">
          {data.personalInformation.profileImage && (
            <div className="flex justify-center mb-4">
              <img
                src={data.personalInformation.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md"
              />
            </div>
          )}

          <h1 className="text-4xl font-bold text-primary">
            {data.personalInformation.fullName}
          </h1>
          <p className="text-lg text-gray-500">
            {data.personalInformation.location}
          </p>

          <div className="flex justify-center space-x-4 mt-2">
            {data.personalInformation.email && (
              <a
                href={`mailto:${data.personalInformation.email}`}
                className="flex items-center text-secondary hover:underline"
              >
                <FaEnvelope className="mr-2" /> {data.personalInformation.email}
              </a>
            )}
            {data.personalInformation.phoneNumber && (
              <p className="flex items-center text-gray-500">
                <FaPhone className="mr-2" />{" "}
                {data.personalInformation.phoneNumber}
              </p>
            )}
          </div>

          <div className="flex justify-center space-x-4 mt-2">
            {data.personalInformation.gitHub && (
              <a
                href={data.personalInformation.gitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <FaGithub className="mr-2" /> GitHub
              </a>
            )}
            {data.personalInformation.linkedIn && (
              <a
                href={data.personalInformation.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <FaLinkedin className="mr-2" /> LinkedIn
              </a>
            )}
          </div>
        </div>

        <div className="divider"></div>

        {/* Summary Section */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary">Summary</h2>
          <p className="text-gray-700 dark:text-gray-300">{data.summary}</p>
        </section>

        <div className="divider"></div>

        {/* Skills Section */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary">Skills</h2>

          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3"
            style={{
              pageBreakInside: "avoid",
            }}
          >
            {data.skills?.map((skill, index) => (
              <div
                key={index}
                className="p-3 rounded-md bg-base-200 border border-gray-300 dark:border-gray-700 text-sm"
                style={{
                  wordBreak: "break-word",
                  pageBreakInside: "avoid",
                }}
              >
                <span className="font-semibold">{skill.title}</span>
                {skill.level && (
                  <span className="block text-gray-500 text-xs">
                    Level: {skill.level}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="divider"></div>

        {/* Experience Section */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary">Experience</h2>
          {data.experience.map((exp, index) => (
            <div
              key={index}
              className="mb-4 p-4 rounded-lg shadow-md bg-base-200 border border-gray-300 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold">{exp.jobTitle}</h3>
              <p className="text-gray-500">
                {exp.company} | {exp.location}
              </p>
              <p className="text-gray-400">{exp.duration}</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {exp.responsibility}
              </p>
            </div>
          ))}
        </section>

        <div className="divider"></div>

        {/* Education Section */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary">Education</h2>
          {data.education.map((edu, index) => (
            <div
              key={index}
              className="mb-4 p-4 rounded-lg shadow-md bg-base-200 border border-gray-300 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold">{edu.degree}</h3>
              <p className="text-gray-500">
                {edu.university}, {edu.location}
              </p>
              <p className="text-gray-400">
                🎓 Graduation Year: {edu.graduationYear}
              </p>
            </div>
          ))}
        </section>

        <div className="divider"></div>

        {/* Certifications Section */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary">
            Certifications
          </h2>
          {data.certifications.map((cert, index) => (
            <div
              key={index}
              className="mb-4 p-4 rounded-lg shadow-md bg-base-200 border border-gray-300 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold">{cert.title}</h3>
              <p className="text-gray-500">
                {cert.issuingOrganization} - {cert.year}
              </p>
            </div>
          ))}
        </section>

        <div className="divider"></div>

        {/* Projects Section */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary">Projects</h2>
          {data.projects.map((proj, index) => (
            <div
              key={index}
              className="mb-4 p-4 rounded-lg shadow-md bg-base-200 border border-gray-300 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold">{proj.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {proj.description}
              </p>
              <p className="text-gray-500">
                🛠 Technologies: {proj.technologiesUsed.join(", ")}
              </p>
              {proj.githubLink && (
                <a
                  href={proj.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  🔗 GitHub Link
                </a>
              )}
            </div>
          ))}
        </section>

        <div className="divider"></div>

        {/* Achievements Section */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary">
            Achievements
          </h2>
          {data.achievements.map((ach, index) => (
            <div
              key={index}
              className="mb-4 p-4 rounded-lg shadow-md bg-base-200 border border-gray-300 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold">{ach.title}</h3>
              <p className="text-gray-500">{ach.year}</p>
              <p className="text-gray-600 dark:text-gray-300">
                {ach.extraInformation}
              </p>
            </div>
          ))}
        </section>

        <div className="divider"></div>

        {/* Languages Section */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary">Languages</h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            {data.languages.map((lang, index) => (
              <li key={index}>{lang.name}</li>
            ))}
          </ul>
        </section>

        <div className="divider"></div>

        {/* Interests Section */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary">Interests</h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            {data.interests.map((interest, index) => (
              <li key={index}>{interest.name}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="flex justify-center mt-4 ">
        <div onClick={handleDownloadPdf} className="btn btn-primary">
          Download PDF
        </div>
      </section>
    </>
  );
};

export default Resume;
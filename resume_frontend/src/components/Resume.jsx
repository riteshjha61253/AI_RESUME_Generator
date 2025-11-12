import React from "react";
import "daisyui/dist/full.css";
import { FaGithub, FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const Resume = ({ data }) => {
  const resumeRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    removeAfterPrint: true,
    pageStyle: `
      @page { margin: 2mm; size: A4; } /* Ultra-tight margins */
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .no-print { display: none !important; }
        #resume-print {
          max-width: none !important;
          width: 100% !important;
          box-shadow: none !important;
          padding: 0 !important; /* No padding */
          font-size: 0.8em !important; /* Tiny base font */
          line-height: 1.1 !important; /* Ultra-tight lines */
        }
        #resume-print .space-y-6 > * + * { margin-top: 0.125rem !important; } /* Minimal sections */
        #resume-print .mb-4 { margin-bottom: 0.125rem !important; }
        #resume-print .p-8 { padding: 0 !important; }
        #resume-print .p-4 { padding: 0.125rem !important; } /* Bare minimum */
        #resume-print .p-3 { padding: 0 !important; }
        #resume-print .gap-3 { gap: 0 !important; }
        #resume-print .mt-3 { margin-top: 0 !important; }
        #resume-print .mt-2 { margin-top: 0 !important; }
        #resume-print .divider { 
          margin: 0.125rem 0 !important; 
          height: 0.5px !important; 
          background: #e5e7eb !important; /* Thin, light divider */
        }
        #resume-print h1 { 
          font-size: 1.5rem !important; /* Compact name */
          margin: 0 0 0.125rem 0 !important;
          line-height: 1.1 !important;
        }
        #resume-print h2 { 
          font-size: 0.95rem !important; /* Small headings */
          margin: 0 0 0.125rem 0 !important;
          line-height: 1.1 !important;
        }
        #resume-print h3 { 
          font-size: 0.9rem !important; 
          margin: 0 0 0.125rem 0 !important;
          line-height: 1.1 !important;
        }
        #resume-print p { 
          margin: 0 0 0.125rem 0 !important;
          font-size: 0.8em !important;
          line-height: 1.1 !important;
        }
        #resume-print .w-32, #resume-print .h-32 { 
          width: 2.5rem !important; 
          height: 2.5rem !important; /* Micro pic */
          margin-bottom: 0.125rem !important;
        }
        #resume-print .text-lg { font-size: 0.8em !important; margin-bottom: 0.125rem !important; }
        #resume-print ul { 
          padding-left: 0.5rem !important; 
          margin: 0 0 0.125rem 0 !important; 
        }
        #resume-print li { 
          margin: 0 0 0.125rem 0 !important;
          font-size: 0.8em !important;
          line-height: 1.1 !important;
        }
        #resume-print .space-y-2 > * + * { margin-top: 0.125rem !important; }
        #resume-print .space-x-4 { gap: 0.25rem !important; } /* Crammed contacts */
        #resume-print .grid-cols-2 { grid-template-columns: repeat(6, 1fr) !important; } /* Max-dense skills */
        #resume-print .shadow-md { box-shadow: none !important; }
        #resume-print .rounded-lg, #resume-print .rounded-md { border-radius: 0 !important; } /* No curves */
        #resume-print .border { border: 0.5px solid #e5e7eb !important; }
        #resume-print a { 
          color: #3b82f6 !important; 
          text-decoration: none !important; 
          font-size: 0.8em !important;
          line-height: 1.1 !important;
        }
        #resume-print .text-primary { color: #3b82f6 !important; }
        #resume-print .text-secondary { color: #6b7280 !important; }
        #resume-print .bg-base-200 { background: transparent !important; } /* No bg color */
        #resume-print .text-gray-500, #resume-print .text-gray-400, #resume-print .text-gray-700 { color: #6b7280 !important; }
        /* Force breaks only after dividers */
        #resume-print section { page-break-inside: avoid !important; orphans: 1; widows: 1; }
        #resume-print .divider { page-break-after: auto !important; }
        /* Compress experience/project descriptions if long */
        #resume-print [class*="text-gray-600"] { font-size: 0.75em !important; line-height: 1.05 !important; }
      }
    `,
  });

  return (
    <>
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
          }
        `}
      </style>
      <div
        ref={resumeRef}
        id="resume-print"
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

          <div className="flex justify-center space-x-4 mt-2 flex-wrap justify-center gap-1">
            {data.personalInformation.email && (
              <a
                href={`mailto:${data.personalInformation.email}`}
                className="flex items-center text-secondary hover:underline text-xs"
              >
                <FaEnvelope className="mr-1 text-xs" /> {data.personalInformation.email}
              </a>
            )}
            {data.personalInformation.phoneNumber && (
              <p className="flex items-center text-gray-500 text-xs">
                <FaPhone className="mr-1 text-xs" />{" "}
                {data.personalInformation.phoneNumber}
              </p>
            )}
          </div>

          <div className="flex justify-center space-x-4 mt-2 flex-wrap justify-center gap-1">
            {data.personalInformation.gitHub && (
              <a
                href={data.personalInformation.gitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 flex items-center text-xs"
              >
                <FaGithub className="mr-1 text-xs" /> GitHub
              </a>
            )}
            {data.personalInformation.linkedIn && (
              <a
                href={data.personalInformation.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 flex items-center text-xs"
              >
                <FaLinkedin className="mr-1 text-xs" /> LinkedIn
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

      <section className="flex justify-center mt-4 no-print">
        <button onClick={handlePrint} className="btn btn-primary">
          Download PDF (Print to PDF)
        </button>
      </section>
    </>
  );
};

export default Resume;
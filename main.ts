declare const html2pdf: any; // Declare html2pdf globally

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
    const resumeForm = document.getElementById('resume-form') as HTMLDivElement;
    const resumeOutput = document.getElementById('resume-output') as HTMLDivElement;
    const welcomeScreen = document.getElementById('welcome-screen') as HTMLDivElement;
    const form = document.getElementById('form') as HTMLFormElement;
    const resumeContent = document.getElementById('resume-content') as HTMLDivElement;
    const editBtn = document.getElementById('edit-btn') as HTMLButtonElement;
    const generateLinkBtn = document.getElementById('generate-link-btn') as HTMLButtonElement;
    const downloadPdfBtn = document.getElementById('download-pdf-btn') as HTMLButtonElement;
    const uploadInput = document.getElementById('upload') as HTMLInputElement;
    const profilePicture = document.getElementById('profile-picture') as HTMLImageElement;
    const addSkillBtn = document.getElementById('add-skill-btn') as HTMLButtonElement;
    const skillsContainer = document.getElementById('skills-container') as HTMLDivElement;

    let uploadedImageSrc: string | null = null;

    // Show the form when "Create Your Resume" button is clicked
    startBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        resumeForm.classList.remove('hidden');
    });

    // Handle file upload for profile picture
    uploadInput.addEventListener('change', function () {
        const file = uploadInput.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedImageSrc = e.target?.result as string;
                profilePicture.src = uploadedImageSrc;
                profilePicture.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Add Another Skill functionality
    addSkillBtn.addEventListener('click', () => {
        const skillGroup = document.createElement('div');
        skillGroup.className = 'skill-group';
        skillGroup.innerHTML = `
            <label for="skill">Skill:</label>
            <input type="text" class="skill-input" required>
            <label for="proficiency">Proficiency (%):</label>
            <input type="number" class="proficiency-input" min="0" max="100" placeholder="e.g., 90" required>
        `;
        skillsContainer.appendChild(skillGroup);
    });

     // Handle form submission and generate resume content
     form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Collect user input
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const field = (document.getElementById('field') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const contact_no = (document.getElementById('contact_no') as HTMLInputElement).value;
        const address = (document.getElementById('address') as HTMLInputElement).value;
        const institution = (document.getElementById('institution') as HTMLInputElement).value;
        const degree = (document.getElementById('degree') as HTMLInputElement).value;
        const gradYear = (document.getElementById('grad-year') as HTMLInputElement).value;
        const company = (document.getElementById('company') as HTMLInputElement).value;
        const role = (document.getElementById('role') as HTMLInputElement).value;
        const experience = (document.getElementById('experience') as HTMLTextAreaElement).value;

        // Collect skills
        const skillInputs = document.querySelectorAll('.skill-input') as NodeListOf<HTMLInputElement>;
        const proficiencyInputs = document.querySelectorAll('.proficiency-input') as NodeListOf<HTMLInputElement>;

        let skillsHtml = '';
        skillInputs.forEach((skillInput, index) => {
            const proficiency = proficiencyInputs[index].value || '0';
            skillsHtml += `<p>${skillInput.value.trim()} - ${proficiency}%</p>`;
        });

        // Generate resume content
        resumeContent.innerHTML = `
        <img src="${uploadedImageSrc || ''}" alt="Profile Picture" style="width: 150px; height: 150px; border-radius: 50%; border: 2px solid #ddd;" />
            <h2>${name}</h2>
            <p>${field}</p>

            <h3>Skills</h3>
            ${skillsHtml}
            
            <h3>Education</h3>
            <p><strong>Institution:</strong> ${institution}</p>
            <p><strong>Degree:</strong> ${degree}</p>
            <p><strong>Graduation Year:</strong> ${gradYear}</p>

            <h3>Experience</h3>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Role:</strong> ${role}</p>
            <p><strong>Description:</strong>${experience}</p>

            <h3>Contact</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Contact_no:</strong> ${contact_no}</p>
            <p><strong>Address:</strong> ${address}</p>
        `;

        // Show resume and hide form
        resumeForm.classList.add('hidden');
        resumeOutput.classList.remove('hidden');
    });

    // Allow editing of the resume
    editBtn.addEventListener('click', () => {
        resumeOutput.classList.add('hidden');
        resumeForm.classList.remove('hidden');
    });
    
    // Generate shareable link
    generateLinkBtn.addEventListener('click', () => {
        const name = (document.getElementById('name') as HTMLInputElement).value.trim();
        if (!name) {
            alert('Please enter a valid name to generate the link.');
            return;
        }

        // Format the link as http://Name-resume
        const currentUrl = window.location.href.split('?')[0];
        const shareableLink = `${currentUrl}?resume=${encodeURIComponent(name)}`;
        alert(`Your shareable link: ${shareableLink}`);
        navigator.clipboard.writeText(shareableLink).then(() => {
            alert('Link copied to clipboard!');
        });
    });
    
    downloadPdfBtn.addEventListener('click', () => {
        const resumeElement = document.getElementById('resume-content') as HTMLDivElement;
    
        if (!resumeElement) {
            alert('No resume content found to download.');
            return;
        }
    
        const opt = {
            margin: 1,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };
    
        // Using html2pdf to generate PDF
        html2pdf()
            .from(resumeElement)
            .set(opt)
            .save()
            .catch((err: any) => {
                console.error('Error generating PDF:', err);
            });


    
            html2pdf.json().from(resumeContent).set(opt).save();

    });

    // Handle URL to display only the resume
    const url = window.location.href;
    if (url.includes('-resume')) {
        const name = url.split('-resume')[0].split('//')[1].replace(/-/g, ' ');
        resumeForm.classList.add('hidden');
        resumeOutput.classList.remove('hidden');
        resumeContent.innerHTML = `<h2>${decodeURIComponent(name)}</h2>`;
    }
});


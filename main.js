document.addEventListener('DOMContentLoaded', function () {
    var startBtn = document.getElementById('start-btn');
    var resumeForm = document.getElementById('resume-form');
    var resumeOutput = document.getElementById('resume-output');
    var welcomeScreen = document.getElementById('welcome-screen');
    var form = document.getElementById('form');
    var resumeContent = document.getElementById('resume-content');
    var editBtn = document.getElementById('edit-btn');
    var generateLinkBtn = document.getElementById('generate-link-btn');
    var downloadPdfBtn = document.getElementById('download-pdf-btn');
    var uploadInput = document.getElementById('upload');
    var profilePicture = document.getElementById('profile-picture');
    var addSkillBtn = document.getElementById('add-skill-btn');
    var skillsContainer = document.getElementById('skills-container');
    var uploadedImageSrc = null;
    // Show the form when "Create Your Resume" button is clicked
    startBtn.addEventListener('click', function () {
        welcomeScreen.classList.add('hidden');
        resumeForm.classList.remove('hidden');
    });
    // Handle file upload for profile picture
    uploadInput.addEventListener('change', function () {
        var _a;
        var file = (_a = uploadInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                uploadedImageSrc = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                profilePicture.src = uploadedImageSrc;
                profilePicture.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    // Add Another Skill functionality
    addSkillBtn.addEventListener('click', function () {
        var skillGroup = document.createElement('div');
        skillGroup.className = 'skill-group';
        skillGroup.innerHTML = "\n            <label for=\"skill\">Skill:</label>\n            <input type=\"text\" class=\"skill-input\" required>\n            <label for=\"proficiency\">Proficiency (%):</label>\n            <input type=\"number\" class=\"proficiency-input\" min=\"0\" max=\"100\" placeholder=\"e.g., 90\" required>\n        ";
        skillsContainer.appendChild(skillGroup);
    });
    // Handle form submission and generate resume content
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        // Collect user input
        var name = document.getElementById('name').value;
        var field = document.getElementById('field').value;
        var email = document.getElementById('email').value;
        var contact_no = document.getElementById('contact_no').value;
        var address = document.getElementById('address').value;
        var institution = document.getElementById('institution').value;
        var degree = document.getElementById('degree').value;
        var gradYear = document.getElementById('grad-year').value;
        var company = document.getElementById('company').value;
        var role = document.getElementById('role').value;
        var experience = document.getElementById('experience').value;
        // Collect skills
        var skillInputs = document.querySelectorAll('.skill-input');
        var proficiencyInputs = document.querySelectorAll('.proficiency-input');
        var skillsHtml = '';
        skillInputs.forEach(function (skillInput, index) {
            var proficiency = proficiencyInputs[index].value || '0';
            skillsHtml += "<p>".concat(skillInput.value.trim(), " - ").concat(proficiency, "%</p>");
        });
        // Generate resume content
        resumeContent.innerHTML = "\n        <img src=\"".concat(uploadedImageSrc || '', "\" alt=\"Profile Picture\" style=\"width: 150px; height: 150px; border-radius: 50%; border: 2px solid #ddd;\" />\n            <h2>").concat(name, "</h2>\n            <p>").concat(field, "</p>\n\n            <h3>Skills</h3>\n            ").concat(skillsHtml, "\n            \n            <h3>Education</h3>\n            <p><strong>Institution:</strong> ").concat(institution, "</p>\n            <p><strong>Degree:</strong> ").concat(degree, "</p>\n            <p><strong>Graduation Year:</strong> ").concat(gradYear, "</p>\n\n            <h3>Experience</h3>\n            <p><strong>Company:</strong> ").concat(company, "</p>\n            <p><strong>Role:</strong> ").concat(role, "</p>\n            <p><strong>Description:</strong>").concat(experience, "</p>\n\n            <h3>Contact</h3>\n            <p><strong>Email:</strong> ").concat(email, "</p>\n            <p><strong>Contact_no:</strong> ").concat(contact_no, "</p>\n            <p><strong>Address:</strong> ").concat(address, "</p>\n        ");
        // Show resume and hide form
        resumeForm.classList.add('hidden');
        resumeOutput.classList.remove('hidden');
    });
    // Allow editing of the resume
    editBtn.addEventListener('click', function () {
        resumeOutput.classList.add('hidden');
        resumeForm.classList.remove('hidden');
    });
    // Generate shareable link
    generateLinkBtn.addEventListener('click', function () {
        var name = document.getElementById('name').value.trim();
        if (!name) {
            alert('Please enter a valid name to generate the link.');
            return;
        }
        // Format the link as http://Name-resume
        var currentUrl = window.location.href.split('?')[0];
        var shareableLink = "".concat(currentUrl, "?resume=").concat(encodeURIComponent(name));
        alert("Your shareable link: ".concat(shareableLink));
        navigator.clipboard.writeText(shareableLink).then(function () {
            alert('Link copied to clipboard!');
        });
    });
    downloadPdfBtn.addEventListener('click', function () {
        var resumeElement = document.getElementById('resume-content');
        if (!resumeElement) {
            alert('No resume content found to download.');
            return;
        }
        var opt = {
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
            .catch(function (err) {
            console.error('Error generating PDF:', err);
        });
        html2pdf.json().from(resumeContent).set(opt).save();
    });
    // Handle URL to display only the resume
    var url = window.location.href;
    if (url.includes('-resume')) {
        var name_1 = url.split('-resume')[0].split('//')[1].replace(/-/g, ' ');
        resumeForm.classList.add('hidden');
        resumeOutput.classList.remove('hidden');
        resumeContent.innerHTML = "<h2>".concat(decodeURIComponent(name_1), "</h2>");
    }
});

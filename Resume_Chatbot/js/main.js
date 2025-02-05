const HF_TOKEN = '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';
let resumeData = null;
let conversationHistory = [];

async function initialize() {
    try {
        console.log('Starting to load resume data...');
        const response = await fetch('data/resume.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        resumeData = await response.json();
        console.log('Resume data loaded:', resumeData);
    } catch (error) {
        console.error('Failed to load resume data:', error);
    }
}

async function generateResponse(message) {
    console.log('Processing message:', message);

    if (!resumeData) {
        console.error('Resume data not loaded!');
        return "I'm having trouble accessing my information. Please refresh the page.";
    }

    const lowerMessage = message.toLowerCase();

    // Experience section
    if (lowerMessage.includes('experience')) {
        if (resumeData.experience && resumeData.experience.length > 0) {
            const experiences = resumeData.experience.map(exp => {
                let expText = `Here's my professional experience:\n\n`;
                expText += `📍 ${exp.position} at ${exp.company}\n`;
                expText += `📅 ${exp.duration} | ${exp.location}\n`;
                expText += `${exp.description}\n\n`;

                if (exp.achievements?.length > 0) {
                    expText += `🏆 Key Achievements:\n`;
                    // Add each achievement on a new line with proper indentation
                    exp.achievements.forEach(achievement => {
                        expText += `• ${achievement}\n`;
                    });
                    expText += '\n';
                }

                if (exp.technologies_used?.length > 0) {
                    expText += `💻 Technologies:\n`;
                    // Add each technology on a new line
                    exp.technologies_used.forEach(tech => {
                        expText += `• ${tech}\n`;
                    });
                }
                return expText;
            }).join('\n');
            return experiences;
        }
    }

    // Skills section
if (lowerMessage.includes('skill') || lowerMessage.includes('technique') || lowerMessage.includes('ability')) {
    if (resumeData.skills) {
        let skillsText = '';

        if (resumeData.skills.technical?.length > 0) {
            skillsText += `🔧 Technical Skills:\n\n`; // Added extra line break
            skillsText += `Programming Languages:\n• ${resumeData.skills.technical.find(cat => cat.category === "Programming Languages")?.items.join('\n• ')}\n\n`; // Changed format
            skillsText += `Frameworks:\n• ${resumeData.skills.technical.find(cat => cat.category === "Frameworks")?.items.join('\n• ')}\n\n`; // Changed format
            skillsText += `Tools:\n• ${resumeData.skills.technical.find(cat => cat.category === "Tools")?.items.join('\n• ')}\n\n`; // Changed format
        }

        if (resumeData.skills.soft_skills?.length > 0) {
            skillsText += `👥 Soft Skills:\n• ${resumeData.skills.soft_skills.join('\n• ')}\n\n`; // Changed format
        }

        if (resumeData.skills.methodologies?.length > 0) {
            skillsText += `📈 Methodologies:\n• ${resumeData.skills.methodologies.join('\n• ')}`; // Changed format
        }

        return skillsText;
    }
}

// Education section
if (lowerMessage.includes('education') || lowerMessage.includes('background')) {
    if (resumeData.education && resumeData.education.length > 0) {
        const edu = resumeData.education[0];
        let eduText = `🎓 ${edu.degree}\n`;  // Split into multiple lines
        eduText += `${edu.school} (${edu.year})\n`;
        eduText += `${edu.location}\n\n`;

        if (edu.achievements?.length > 0) {
            eduText += `📊 Achievements:\n`;
            eduText += edu.achievements.map(a => `• ${a}`).join('\n');
            eduText += '\n\n';
        }

        if (edu.relevant_coursework?.length > 0) {
            eduText += `📚 Relevant Coursework:\n`;
            eduText += edu.relevant_coursework.map(c => `• ${c}`).join('\n');
        }

        return eduText;
    }
}

    // Projects section
    if (lowerMessage.includes('project')) {
        if (resumeData.projects && resumeData.projects.length > 0) {
            const projects = resumeData.projects.map(p => {
                let projText = `🚀 ${p.name}\n`;
                projText += `   Duration: ${p.duration}\n`;
                projText += `   Role: ${p.role}\n`;
                projText += `\n   ${p.description}\n`;

                if (p.technologies?.length > 0) {
                    projText += '\n   💻 Technologies:\n';
                    projText += `   • ${p.technologies.join('\n   • ')}`;
                }

                if (p.outcomes?.length > 0) {
                    projText += '\n\n   ✨ Outcomes:\n';
                    projText += p.outcomes.map(o => `   • ${o}`).join('\n');
                }

                if (p.links?.github || p.links?.live) {
                    projText += '\n\n   🔗 Links:\n';
                    if (p.links.github) projText += `   • GitHub: ${p.links.github}\n`;
                    if (p.links.live) projText += `   • Live: ${p.links.live}`;
                }
                return projText;
            }).join('\n\n');
            return `Here are my recent projects:\n\n${projects}`;
        }
    }

    // Personality and Work Style
if (lowerMessage.includes('personality') || lowerMessage.includes('work style') || lowerMessage.includes('about you')) {
    const personality = resumeData.basics.personality;
    let personalityText = `👤 Let me tell you about myself:\n\n`;
    
    // Traits with bullet points
    personalityText += `✨ Personal Traits:\n`;
    personalityText += personality.traits.map(trait => `• ${trait}`).join('\n');
    personalityText += '\n\n';
    
    // Communication style
    personalityText += `💬 Communication Style:\n`;
    personalityText += `• ${personality.communication_style}\n\n`;
    
    // Work Style
    personalityText += `💼 Work Style:\n`;
    personalityText += `• Preferred Environment:\n  ${personality.work_style.preferred_environment}\n\n`;
    personalityText += `• Problem Solving Approach:\n  ${personality.work_style.problem_solving_approach}\n\n`;
    personalityText += `• Learning Method:\n  ${personality.work_style.learning_method}`;
    
    return personalityText;
}

// Certifications
if (lowerMessage.includes('certification') || lowerMessage.includes('certificate')) {
    if (resumeData.certifications?.length > 0) {
        let certText = `🏅 Certifications:\n\n`;
        certText += resumeData.certifications.map(cert => {
            let certDetails = `• ${cert.name}\n`;
            certDetails += `  Issuer: ${cert.issuer}\n`;
            certDetails += `  Date: ${cert.date}`;
            if (cert.expires) {
                certDetails += `\n  Expires: ${cert.expires}`;
            }
            if (cert.credentials) {
                certDetails += `\n  Credential ID: ${cert.credentials}`;
            }
            return certDetails;
        }).join('\n\n');
        return certText;
    }
}

// Greeting
if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
    let greetingText = `👋 Hello! I'm ${resumeData.basics.name}'s AI assistant.\n\n`;
    greetingText += `I can tell you about:\n`;
    greetingText += `• Professional Experience\n`;
    greetingText += `• Technical Skills\n`;
    greetingText += `• Educational Background\n`;
    greetingText += `• Project Portfolio\n`;
    greetingText += `• Work Style & Approach\n`;
    greetingText += `• Certifications\n\n`;
    greetingText += `What would you like to know?`;
    return greetingText;
}
    // Context-aware responses
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    if (lastMessage) {
        if (lastMessage.message.includes('experience') && lowerMessage.includes('what else')) {
            return `I can tell you about my skills, education, projects, certifications, or work style. What interests you?`;
        }
    }

    return "I can tell you about my experience, skills, education, projects, certifications, or work style. What would you like to know?";
}

function addMessage(type, text) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Replace \n with <br> for HTML line breaks
    contentDiv.innerHTML = text.replace(/\n/g, '<br>');

    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLastMessage() {
    const chatBox = document.getElementById('chatBox');
    chatBox.removeChild(chatBox.lastChild);
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();

    if (!message) return;

    try {
        addMessage('user', message);
        addMessage('bot', '...thinking...');

        const response = await generateResponse(message);
        removeLastMessage();
        addMessage('bot', response);

        // Add to conversation history
        conversationHistory.push({ message, response, timestamp: new Date() });
        if (conversationHistory.length > 5) conversationHistory.shift();

    } catch (error) {
        console.error('Error:', error);
        removeLastMessage();
        addMessage('bot', "I'm here to help! Please ask me about my experience, skills, or projects.");
    }

    input.value = '';
}

function sendQuickMessage(message) {
    document.getElementById('userInput').value = message;
    sendMessage();
}

// Initialize when page loads
initialize();

// Add enter key support
document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
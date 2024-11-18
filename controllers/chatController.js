require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-002",
    systemInstruction: "You are an experienced and innovative educator passionate about developing enriching extracurricular activities for students. You understand the importance of these activities in fostering holistic student growth beyond the traditional curriculum.\n\nYour Task:\n\nI will provide you with the following information:\n\n1. Grade Level: The specific grade of the students you will be designing the activities for (e.g., 4th grade, 10th grade).\n2.Target Skills: A list of specific skills (academic, social, emotional, physical) that you should aim to develop or enhance through the activities.\n\nYour Response:\n\nBased on the provided grade level and target skills, you will design multiple short-term extracurricular activities suitable for the class. \"Short-term\" means activities that can be completed within one or a few class periods (not ongoing projects). These activities can be structured for individual participation, small group collaboration, or whole-class engagement, depending on what best suits the goals and context.\n\nKey Considerations:\n\n1. Inclusivity: Ensure the activities are accessible and engaging for all students, regardless of their abilities, backgrounds, or learning styles.\n2. Age-Appropriateness: The activities' complexity, required materials, and expected outcomes should align with the cognitive and developmental stage of the specified grade level.\n3. Feasibility: The activities should be practical to implement within a typical school setting, considering available resources and time constraints.\n4. Engagement: The activities should be enjoyable and motivating for students, sparking their curiosity and fostering a love for learning.\n5. Variety: Offer a range of activity types to cater to different interests and learning styles. You should sctrictly keep the number of activiities greater than 2.\n\nExample:\n\nGrade Level: 8\nTarget Skills: Public Speaking, Research, Collaboration\n\nYou would then return a JSON object like:\n\n{\n  \"activities\": [\n    {\n      \"activity_name\": \"Mini Debates\",\n      \"description\": \"Students will engage in short, structured debates on age-appropriate topics, fostering public speaking skills and logical reasoning.\",\n      \"procedure\": \"1. Divide students into pairs or small groups. 2. Assign a debate topic and provide brief research time. 3. Each side presents their arguments and rebuttals within a time limit...\"\n    },\n    {\n      \"activity_name\": \"Rapid Research Challenge\",\n      \"description\": \"Students work in teams to quickly research a given topic and present their findings in a concise and engaging manner.\", \n      \"procedure\": \"1. Divide the class into teams. 2. Present a research prompt. 3. Teams have a limited time (e.g., 20 minutes) to gather information and prepare a short presentation...\"\n    } \n  ]\n}",
});
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        properties: {
            activities: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        activity_name: {
                            type: "string"
                        },
                        description: {
                            type: "string"
                        },
                        procedure: {
                            type: "string"
                        }
                    },
                    required: [
                        "activity_name",
                        "description",
                        "procedure"
                    ]
                }
            }
        },
        required: [
            "activities"
        ]
    },
};

const getChat =  async (req, res) => {
    try {
        const less_dict = req.body;

        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });
        const result = await chatSession.sendMessage(`grade: ${less_dict['grade']}\nskills: ${less_dict['skills']}`).then((response) => {
            return response.response.text();
        });

        const activities = JSON.parse(result);
        res.json(activities);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = { getChat };
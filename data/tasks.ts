import { Task } from '../types';

export const CELPIP_TASKS: Task[] = [
  {
    id: 1,
    title: "Giving Advice",
    description: "Provide advice to a friend or family member regarding a common situation.",
    prepTime: 30,
    speakTime: 90,
    requiresImage: false,
    samples: [
      "Your friend is thinking about buying a second-hand car. Give him advice on what he should look for and how to negotiate the price.",
      "A family member wants to start a new exercise routine but doesn't know where to begin. Advise them on how to start safely and stay motivated.",
      "Your colleague is planning a first-time trip to a foreign country. Advise them on how to prepare for cultural differences and stay safe."
    ],
    helper: {
      title: "Structure Advice",
      points: ["Friendly Greeting", "Acknowledge Situation", "Direct Advice", "Reasons/Explanations", "Encouraging Closing"]
    }
  },
  {
    id: 2,
    title: "Personal Experience",
    description: "Describe a personal memory or event from your past.",
    prepTime: 30,
    speakTime: 60,
    requiresImage: false,
    samples: [
      "Talk about a time you visited a place that left a strong impression on you. What was the place and why was it memorable?",
      "Describe a celebration or festival you attended recently. Who was there and what happened?",
      "Tell a story about a challenge you faced and how you overcame it. What did you learn from the experience?"
    ],
    helper: {
      title: "Storytelling Tips",
      points: ["Set the Scene (Who/Where/When)", "Key Events (Chronological)", "Climax/Challenge", "Outcome", "Personal Reflection"]
    }
  },
  {
    id: 3,
    title: "Describe a Scene",
    description: "Describe a detailed illustration or photograph.",
    prepTime: 30,
    speakTime: 60,
    requiresImage: true,
    samples: [
      "Describe everything that is happening in this picture. What are the people doing?",
      "Explain the environment and the interactions between the individuals in this scene.",
      "Describe the visual details of this scene including foreground, background, and actions."
    ],
    helper: {
      title: "Scanning Technique",
      points: ["General Overview", "Foreground Actions", "Background Details", "Interactions", "Atmosphere"]
    }
  },
  {
    id: 4,
    title: "Make Predictions",
    description: "Predict what will happen next in the image provided.",
    prepTime: 30,
    speakTime: 60,
    requiresImage: true,
    samples: [
      "Look at the picture and predict what will happen in the next 1-2 minutes.",
      "Based on the current actions, what do you think the characters will do next?",
      "Forecast the outcome of the situation shown in the image."
    ],
    helper: {
      title: "Prediction Formula",
      points: ["Identify Current Clue", "Logical Outcome", "Speculate Variations", "Future Tense Usage", "Specific Actions"]
    }
  },
  {
    id: 5,
    title: "Comparing & Persuading",
    description: "Choose between two options and persuade someone to agree with your choice.",
    prepTime: 60,
    speakTime: 60,
    requiresImage: false,
    samples: [
      "You have two options for a weekend retreat: a quiet cabin in the woods or a luxury hotel in the city. Persuade your partner to choose your preference.",
      "Compare two different gyms in your neighborhood. Convince your friend why the more expensive one is worth the extra cost.",
      "Your office is choosing a new coffee machine. Compare a high-end espresso maker vs a standard drip machine and argue for your choice."
    ],
    helper: {
      title: "Persuasion Flow",
      points: ["State Preference", "Compare Key Features", "Highlight Benefits", "Address Counter-arguments", "Final Call to Action"]
    }
  },
  {
    id: 6,
    title: "Difficult Situation",
    description: "Explain a decision or situation to someone who may be disappointed or concerned.",
    prepTime: 60,
    speakTime: 60,
    requiresImage: false,
    samples: [
      "You promised to help a friend move, but you have a family emergency. Call your friend and explain why you can't come.",
      "You need to tell your boss that a major project will be delayed by one week. Explain the reasons and offer a solution.",
      "You accidentally broke an expensive item borrowed from a neighbor. Explain what happened and how you plan to fix it."
    ],
    helper: {
      title: "Handling Conflict",
      points: ["Empathetic Opening", "Direct Explanation", "Give Context/Reason", "Propose Solution/Alternative", "Express Sincerity"]
    }
  },
  {
    id: 7,
    title: "Expressing Opinions",
    description: "Answer a challenging question by stating and supporting your opinion.",
    prepTime: 30,
    speakTime: 90,
    requiresImage: false,
    samples: [
      "Do you think social media has a positive or negative impact on the mental health of teenagers? Explain your reasons.",
      "Should companies be required to provide a 4-day work week? Why or why not?",
      "Is it better for children to grow up in a big city or a small town? Support your opinion with examples."
    ],
    helper: {
      title: "Opinion Structure",
      points: ["Clear Thesis Statement", "Reason 1 + Example", "Reason 2 + Example", "Summary of Main Points", "Strong Conclusion"]
    }
  },
  {
    id: 8,
    title: "Unusual Situation",
    description: "Describe an unusual or strange object or scene to someone who cannot see it.",
    prepTime: 30,
    speakTime: 60,
    requiresImage: false,
    samples: [
      "You are at a modern art gallery and see a very strange sculpture. Describe it in detail to a friend over the phone.",
      "You found a bizarre-looking tool in your grandfather's attic. Describe its shape, material, and possible function.",
      "Describe a futuristic gadget you saw in a movie to someone who hasn't seen it yet."
    ],
    helper: {
      title: "Descriptive Strategy",
      points: ["General Shape/Size", "Color & Material", "Specific Details", "Hypothesized Function", "Context/Location"]
    }
  }
];

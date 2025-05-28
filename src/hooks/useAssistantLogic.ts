
import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'command' | 'reminder';
}

interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'ac' | 'tv';
  isOn: boolean;
  value?: number;
  room: string;
}

interface Reminder {
  id: string;
  text: string;
  time: string;
  isActive: boolean;
}

export const useAssistantLogic = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI voice assistant. I can help you with questions on any topic, control smart devices, set reminders, and much more. Try saying 'turn on the lights' or ask me anything!",
      isUser: false,
      timestamp: new Date(),
    }
  ]);

  const [smartDevices, setSmartDevices] = useState<SmartDevice[]>([
    { id: '1', name: 'Living Room Lights', type: 'light', isOn: false, value: 80, room: 'Living Room' },
    { id: '2', name: 'Bedroom Fan', type: 'fan', isOn: false, value: 60, room: 'Bedroom' },
    { id: '3', name: 'Kitchen AC', type: 'ac', isOn: false, value: 22, room: 'Kitchen' },
    { id: '4', name: 'TV', type: 'tv', isOn: false, room: 'Living Room' },
  ]);

  const [reminders, setReminders] = useState<Reminder[]>([]);

  const processCommand = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Smart home commands
    if (lowerText.includes('turn on') || lowerText.includes('turn off')) {
      const isOn = lowerText.includes('turn on');
      let deviceName = '';
      
      if (lowerText.includes('light')) deviceName = 'lights';
      if (lowerText.includes('fan')) deviceName = 'fan';
      if (lowerText.includes('ac') || lowerText.includes('air')) deviceName = 'ac';
      if (lowerText.includes('tv') || lowerText.includes('television')) deviceName = 'tv';
      
      if (deviceName) {
        setSmartDevices(prev => prev.map(device => 
          device.name.toLowerCase().includes(deviceName) 
            ? { ...device, isOn }
            : device
        ));
        return `${isOn ? 'Turned on' : 'Turned off'} the ${deviceName}.`;
      }
    }
    
    // Reminder commands
    if (lowerText.includes('remind me') || lowerText.includes('set reminder')) {
      const reminderText = text.replace(/remind me to|set reminder to|remind me|set reminder/gi, '').trim();
      if (reminderText) {
        const newReminder: Reminder = {
          id: Date.now().toString(),
          text: reminderText,
          time: new Date(Date.now() + 5 * 60000).toLocaleTimeString(),
          isActive: true
        };
        setReminders(prev => [...prev, newReminder]);
        return `I'll remind you to ${reminderText} in 5 minutes.`;
      }
    }
    
    // Enhanced general knowledge responses
    return getAIResponse(text);
  };

  const getAIResponse = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Programming Languages & Technologies
    if (lowerText.includes('javascript') || lowerText.includes('js')) {
      return "JavaScript is a versatile, high-level programming language primarily used for web development. It's dynamic, interpreted, and supports multiple programming paradigms including object-oriented, functional, and procedural programming. Key features include closures, prototypal inheritance, first-class functions, and event-driven programming. Modern JavaScript (ES6+) includes features like arrow functions, destructuring, modules, async/await, and classes.";
    }

    if (lowerText.includes('python')) {
      return "Python is a high-level, interpreted programming language known for its clear syntax and readability. Created by Guido van Rossum in 1991, it follows the philosophy of 'simple is better than complex.' Python is widely used for web development (Django, Flask), data science (pandas, NumPy), machine learning (TensorFlow, PyTorch), automation, scientific computing, and more. Its extensive standard library and package ecosystem make it incredibly versatile.";
    }

    if (lowerText.includes('react')) {
      return "React is a JavaScript library for building user interfaces, created by Facebook. It uses a component-based architecture where UIs are broken down into reusable components. Key concepts include JSX (JavaScript XML), virtual DOM for efficient rendering, one-way data flow, hooks for state management, and the component lifecycle. React's declarative approach makes it easier to build complex, interactive UIs while maintaining predictable behavior.";
    }

    if (lowerText.includes('node') && lowerText.includes('js')) {
      return "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine that allows you to run JavaScript on the server side. It's event-driven, non-blocking I/O model makes it lightweight and efficient for data-intensive real-time applications. Node.js is commonly used for building web servers, APIs, microservices, and real-time applications like chat applications or collaborative tools.";
    }

    if (lowerText.includes('java') && !lowerText.includes('javascript')) {
      return "Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible. It follows the principle of 'write once, run anywhere' (WORA) through the Java Virtual Machine (JVM). Java is widely used for enterprise applications, Android app development, web backends, and large-scale systems. Key features include strong memory management, platform independence, and robust security features.";
    }

    if (lowerText.includes('c++')) {
      return "C++ is a general-purpose programming language created as an extension of C. It supports both procedural and object-oriented programming paradigms. C++ is known for its performance, giving programmers fine control over system resources and memory. It's widely used in system/OS development, game development, embedded systems, high-performance applications, and competitive programming.";
    }

    if (lowerText.includes('html')) {
      return "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure and content of web pages using elements and tags. HTML5, the latest version, includes semantic elements (header, nav, article, section), multimedia support (audio, video), canvas for graphics, and APIs for geolocation, storage, and more.";
    }

    if (lowerText.includes('css')) {
      return "CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of HTML documents. It controls layout, colors, fonts, spacing, animations, and responsive design. Modern CSS includes features like Flexbox and Grid for layout, CSS variables, animations, transitions, and media queries for responsive design.";
    }

    if (lowerText.includes('sql')) {
      return "SQL (Structured Query Language) is a domain-specific language for managing and manipulating relational databases. It includes commands for querying data (SELECT), modifying data (INSERT, UPDATE, DELETE), defining database structure (CREATE, ALTER, DROP), and controlling access (GRANT, REVOKE). SQL is essential for working with databases like MySQL, PostgreSQL, SQLite, and SQL Server.";
    }

    // Science & Mathematics
    if (lowerText.includes('physics')) {
      return "Physics is the fundamental science that studies matter, energy, and their interactions in the universe. Major branches include mechanics (motion and forces), thermodynamics (heat and energy), electromagnetism (electric and magnetic phenomena), quantum mechanics (behavior at atomic scale), and relativity (space, time, and gravity). Physics principles underlie all other sciences and drive technological advancement.";
    }

    if (lowerText.includes('chemistry')) {
      return "Chemistry is the scientific study of matter, its properties, composition, structure, and the changes it undergoes during chemical reactions. Major branches include organic chemistry (carbon compounds), inorganic chemistry (all other elements), physical chemistry (chemical phenomena through physics), analytical chemistry (composition analysis), and biochemistry (chemical processes in living organisms).";
    }

    if (lowerText.includes('biology')) {
      return "Biology is the study of living organisms and their interactions with each other and their environment. Major fields include molecular biology (biological processes at molecular level), genetics (heredity and genes), ecology (organisms and environment), evolution (change in species over time), anatomy (structure), physiology (function), and microbiology (microscopic organisms).";
    }

    if (lowerText.includes('mathematics') || lowerText.includes('math')) {
      return "Mathematics is the study of numbers, shapes, patterns, and logical relationships. Major branches include arithmetic (basic operations), algebra (symbols and equations), geometry (shapes and space), calculus (change and motion), statistics (data analysis), and discrete mathematics (distinct objects). Mathematics is the language of science and essential for problem-solving in virtually every field.";
    }

    if (lowerText.includes('artificial intelligence') || lowerText.includes('ai')) {
      return "Artificial Intelligence (AI) is the simulation of human intelligence in machines programmed to think and learn. Major areas include machine learning (algorithms that improve through experience), deep learning (neural networks), natural language processing (understanding human language), computer vision (interpreting visual information), and robotics (intelligent machines that can perform tasks).";
    }

    if (lowerText.includes('machine learning') || lowerText.includes('ml')) {
      return "Machine Learning is a subset of AI that enables computers to learn and make decisions from data without explicit programming. Types include supervised learning (labeled data), unsupervised learning (finding patterns), reinforcement learning (learning through rewards), and deep learning (neural networks). Common algorithms include linear regression, decision trees, random forests, support vector machines, and neural networks.";
    }

    // History & Geography
    if (lowerText.includes('world war') || lowerText.includes('wwii') || lowerText.includes('ww2')) {
      return "World War II (1939-1945) was the largest conflict in human history, involving most of the world's nations. Key events included the German invasion of Poland, Pearl Harbor attack, D-Day landings, Holocaust, and atomic bombings of Hiroshima and Nagasaki. The war reshaped global politics, led to the United Nations' formation, and marked the beginning of the Cold War era.";
    }

    if (lowerText.includes('ancient rome') || lowerText.includes('roman empire')) {
      return "The Roman Empire was one of history's largest and most influential civilizations, lasting from 27 BC to 476 AD in the West. Romans made significant contributions to law, engineering (aqueducts, roads), architecture (Colosseum, Pantheon), military strategy, and governance. Latin, the Roman language, forms the basis of Romance languages and legal terminology.";
    }

    if (lowerText.includes('egypt') || lowerText.includes('pyramids') || lowerText.includes('pharaoh')) {
      return "Ancient Egypt was a civilization along the Nile River known for pyramids, pharaohs, hieroglyphics, and mummification. The Great Pyramid of Giza is one of the Seven Wonders of the Ancient World. Egyptian achievements include advanced medicine, mathematics, astronomy, and engineering. The civilization lasted over 3,000 years, with famous rulers like Tutankhamun, Cleopatra, and Ramesses II.";
    }

    if (lowerText.includes('geography') || lowerText.includes('continent') || lowerText.includes('countries')) {
      return "Geography is the study of Earth's physical features, climate, and human activities. Earth has seven continents: Asia (largest by area and population), Africa, North America, South America, Antarctica, Europe, and Australia/Oceania. The study includes physical geography (landforms, climate, ecosystems) and human geography (populations, cultures, economics).";
    }

    // Literature & Philosophy
    if (lowerText.includes('shakespeare')) {
      return "William Shakespeare (1564-1616) was an English playwright and poet, widely regarded as the greatest writer in the English language. He wrote 39 plays and 154 sonnets, including tragedies (Hamlet, Macbeth, King Lear, Othello), comedies (A Midsummer Night's Dream, Much Ado About Nothing), and histories (Henry V, Richard III). His works explore universal themes of love, power, betrayal, and human nature.";
    }

    if (lowerText.includes('philosophy')) {
      return "Philosophy is the study of fundamental questions about existence, knowledge, values, reason, mind, and language. Major branches include metaphysics (nature of reality), epistemology (nature of knowledge), ethics (moral principles), logic (reasoning), and aesthetics (beauty and art). Famous philosophers include Socrates, Plato, Aristotle, Kant, Nietzsche, and many others who shaped human thought.";
    }

    // Current Events & Technology
    if (lowerText.includes('climate change') || lowerText.includes('global warming')) {
      return "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, human activities since the 1800s have been the main driver of climate change, primarily through burning fossil fuels. Effects include rising temperatures, melting ice caps, sea level rise, extreme weather events, and ecosystem disruption. Solutions include renewable energy, energy efficiency, and sustainable practices.";
    }

    if (lowerText.includes('renewable energy')) {
      return "Renewable energy comes from naturally replenishing sources that don't deplete when used. Types include solar power (photovoltaic and thermal), wind power, hydroelectric power, geothermal energy, and biomass. These clean energy sources are crucial for reducing greenhouse gas emissions, combating climate change, and achieving energy independence. Technology advances are making renewables increasingly cost-competitive with fossil fuels.";
    }

    if (lowerText.includes('blockchain') || lowerText.includes('cryptocurrency')) {
      return "Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, linked and secured using cryptography. It's the technology behind cryptocurrencies like Bitcoin and Ethereum. Blockchain offers transparency, security, and decentralization, with applications in finance, supply chain management, healthcare, voting systems, and digital identity verification.";
    }

    // Health & Medicine
    if (lowerText.includes('nutrition') || lowerText.includes('diet') || lowerText.includes('healthy eating')) {
      return "Good nutrition involves eating a balanced diet with adequate amounts of essential nutrients. Key principles include eating plenty of fruits and vegetables, choosing whole grains over refined ones, including lean proteins, consuming healthy fats (omega-3s), limiting processed foods and added sugars, staying hydrated, and maintaining appropriate portion sizes. Proper nutrition supports immune function, energy levels, mental health, and disease prevention.";
    }

    if (lowerText.includes('exercise') || lowerText.includes('fitness') || lowerText.includes('workout')) {
      return "Regular exercise is crucial for physical and mental health. Benefits include improved cardiovascular health, stronger muscles and bones, better mood and mental health, enhanced immune function, and reduced risk of chronic diseases. Types include aerobic exercise (cardio), strength training, flexibility exercises, and balance training. The WHO recommends at least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity aerobic activity weekly.";
    }

    // Economics & Business
    if (lowerText.includes('economics') || lowerText.includes('economy')) {
      return "Economics is the study of how societies allocate scarce resources to satisfy unlimited wants. It's divided into microeconomics (individual and firm behavior) and macroeconomics (entire economies). Key concepts include supply and demand, market equilibrium, inflation, unemployment, GDP, monetary and fiscal policy, and international trade. Economic systems range from free market capitalism to command economies, with most modern economies being mixed systems.";
    }

    if (lowerText.includes('business') || lowerText.includes('entrepreneurship') || lowerText.includes('startup')) {
      return "Business involves creating value through the production and exchange of goods or services. Entrepreneurship is the process of starting and running new businesses, often involving innovation and risk-taking. Key aspects include identifying market opportunities, developing business models, securing funding, marketing, operations management, and building customer relationships. Successful businesses solve problems and meet customer needs profitably.";
    }

    // Arts & Culture
    if (lowerText.includes('art') || lowerText.includes('painting') || lowerText.includes('sculpture')) {
      return "Art is a diverse range of human activities involving creative expression and aesthetic beauty. Visual arts include painting, sculpture, drawing, photography, and digital art. Major art movements include Renaissance (rebirth of classical ideals), Impressionism (light and color), Cubism (geometric forms), Abstract Expressionism (emotion through abstraction), and Contemporary art (diverse modern expressions). Art reflects culture, challenges society, and explores human experience.";
    }

    if (lowerText.includes('music')) {
      return "Music is an art form that combines sounds, rhythms, melodies, and harmonies to create emotional and aesthetic experiences. Elements include pitch, rhythm, dynamics, timbre, and form. Music spans genres from classical (orchestral, chamber music) to popular (rock, pop, hip-hop, electronic), jazz, folk, and world music. Music serves many functions: entertainment, cultural expression, emotional release, social bonding, and spiritual practice.";
    }

    // Specific Knowledge Areas
    if (lowerText.includes('space') || lowerText.includes('astronomy') || lowerText.includes('universe')) {
      return "Astronomy is the study of celestial objects and phenomena beyond Earth's atmosphere. The universe contains billions of galaxies, each with billions of stars. Our solar system includes eight planets, with Earth being the only known planet supporting life. Key discoveries include the Big Bang theory (universe's origin), black holes, exoplanets, and the expanding universe. Space exploration has led to satellite technology, GPS, weather forecasting, and scientific breakthroughs.";
    }

    if (lowerText.includes('psychology')) {
      return "Psychology is the scientific study of mind and behavior. Major areas include cognitive psychology (thinking and memory), developmental psychology (human development across lifespan), social psychology (group behavior), clinical psychology (mental health), and neuroscience (brain and behavior). Psychology helps us understand learning, motivation, personality, emotions, relationships, and mental health, with applications in therapy, education, business, and research.";
    }

    // General conversational responses
    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      return "Hello! I'm your AI assistant, ready to help with any questions or topics you'd like to explore. Whether you're curious about science, technology, history, arts, or need help with smart home controls and reminders, I'm here to assist. What would you like to know about today?";
    }

    if (lowerText.includes('how are you') || lowerText.includes('how do you feel')) {
      return "I'm doing excellent, thank you for asking! I'm functioning optimally and ready to help you with any questions or tasks. I find great satisfaction in learning about new topics and helping people explore knowledge. Is there something specific you'd like to discuss or learn about today?";
    }

    if (lowerText.includes('your name') || lowerText.includes('who are you')) {
      return "I'm your AI voice assistant, designed to be a comprehensive knowledge companion and smart home controller. Think of me as your personal digital assistant that can discuss virtually any topic, answer questions across all fields of knowledge, help control your smart devices, manage reminders, and engage in meaningful conversations. I'm here to make your life easier and more informed!";
    }

    // Help and capabilities
    if (lowerText.includes('help') || lowerText.includes('what can you do') || lowerText.includes('capabilities')) {
      return "I'm a comprehensive AI assistant with extensive knowledge across all fields! I can help you with: Programming & Technology (JavaScript, Python, React, AI, etc.), Science & Mathematics (physics, chemistry, biology, calculus), History & Geography (world events, civilizations, countries), Literature & Philosophy (classic works, philosophical concepts), Current Events & Climate, Health & Fitness advice, Business & Economics, Arts & Culture, Space & Astronomy, Psychology, and much more! I can also control smart devices, set reminders, do calculations, tell jokes, share fun facts, and have natural conversations on any topic. Just ask me anything!";
    }

    // Time and calculations
    if (lowerText.includes('time') || lowerText.includes('what time')) {
      return `It's currently ${new Date().toLocaleTimeString()}. Is there anything specific you'd like to schedule or any time-related questions I can help you with?`;
    }
    
    if (lowerText.includes('date') || lowerText.includes('what day') || lowerText.includes('today')) {
      return `Today is ${new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}. How can I help you plan your day or explore any topics you're curious about?`;
    }

    // Math calculations
    if (lowerText.includes('calculate') || lowerText.includes('math') || /\d+\s*[\+\-\*\/]\s*\d+/.test(lowerText)) {
      const mathMatch = text.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/);
      if (mathMatch) {
        const [, num1, operator, num2] = mathMatch;
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        let result;
        switch (operator) {
          case '+': result = a + b; break;
          case '-': result = a - b; break;
          case '*': result = a * b; break;
          case '/': result = b !== 0 ? a / b : 'Cannot divide by zero'; break;
          default: result = 'Invalid operation';
        }
        return `${a} ${operator} ${b} = ${result}`;
      }
      return "I can help with mathematical calculations! Try asking me something like '10 + 5', 'what is 15 * 3?', or more complex mathematical concepts. I can also explain mathematical principles, formulas, and solve various types of problems.";
    }

    // Fun responses
    if (lowerText.includes('joke') || lowerText.includes('funny') || lowerText.includes('make me laugh')) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the scarecrow win an award? He was outstanding in his field!",
        "I told my wife she was drawing her eyebrows too high. She looked surprised!",
        "Why don't eggs tell jokes? They'd crack each other up!",
        "What do you call a fake noodle? An impasta!",
        "Why did the math book look so sad? Because it was full of problems!",
        "What do you call a bear with no teeth? A gummy bear!",
        "Why don't programmers like nature? It has too many bugs!"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (lowerText.includes('fun fact') || lowerText.includes('interesting fact') || lowerText.includes('tell me something')) {
      const facts = [
        "The human brain contains approximately 86 billion neurons, each connected to thousands of others, creating more possible neural connections than there are stars in the observable universe!",
        "Honey never spoils! Archaeologists have found edible honey in ancient Egyptian tombs that's over 3,000 years old.",
        "A single cloud can weigh more than a million pounds, but the water droplets are so tiny and spread out that they float in the air.",
        "Octopuses have three hearts and blue blood! Two hearts pump blood to their gills, while the third pumps blood to the rest of their body.",
        "The shortest war in history lasted only 38-45 minutes between Britain and Zanzibar in 1896.",
        "Bananas are berries, but strawberries aren't! Botanically speaking, berries must have seeds inside their flesh.",
        "There are more possible games of chess than atoms in the observable universe!",
        "Dolphins have names for each other! They use unique whistles to identify and call specific individuals.",
        "The Great Wall of China isn't visible from space with the naked eye, contrary to popular belief.",
        "A group of flamingos is called a 'flamboyance', and they get their pink color from the shrimp and algae they eat!"
      ];
      return facts[Math.floor(Math.random() * facts.length)];
    }

    // Weather (mock response)
    if (lowerText.includes('weather') || lowerText.includes('temperature') || lowerText.includes('forecast')) {
      return "I don't have access to real-time weather data, but I can tell you that weather is caused by the complex interactions of atmospheric pressure, temperature, humidity, and wind patterns. For current weather information, I'd recommend checking a weather app or website like Weather.com or AccuWeather. Is there anything about meteorology or climate science you'd like to learn about?";
    }

    // Default comprehensive response for any unmatched query
    const responses = [
      "That's a fascinating question! I'd be happy to explore that topic with you. Could you provide a bit more context or specify what aspect you're most interested in? I have knowledge spanning science, technology, history, arts, philosophy, and many other fields.",
      "Interesting topic! I love discussing all kinds of subjects. To give you the most helpful response, could you tell me more specifically what you'd like to know? Whether it's technical details, historical context, practical applications, or general overview - I'm here to help!",
      "Great question! I'm equipped to discuss virtually any topic in depth. To provide you with the most relevant and detailed information, could you clarify what particular angle or aspect you're curious about? I can cover everything from basic concepts to advanced details.",
      "That's a wonderful area to explore! I have comprehensive knowledge across all major fields of study. Could you be more specific about what you'd like to learn? I can explain concepts, provide examples, discuss history, or dive into technical details depending on your interest.",
      "Excellent question! I'm designed to be helpful with any topic you can think of. To give you the best possible answer, could you elaborate on what specific information you're looking for? I can adapt my response to your level of interest and background knowledge."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = (text: string, onSpeak: (text: string) => void) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const response = processCommand(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      onSpeak(response);
    }, 500);
  };

  return {
    messages,
    smartDevices,
    reminders,
    setSmartDevices,
    setReminders,
    handleSendMessage
  };
};

# Craveo ~ Challenges and Lessons Learned

This document captures the **real challenges I encountered** building  the Craveo Food Social Media App.  
It reflects decision-making, uncertainty, iteration, and learning — not finished outcomes. This document will be updated as development continues.

### **1. Defining the Problem Craveo Solves**

### Challenge
At the beginning, it was difficult to clearly define **what problem Craveo solves** beyond being “social media app.” There was a real risk of building a generic platform where content would be **overshadowed by dominant topics** - which is a common issue on existing social networks.

### Lesson Learned
Clarifying the problem early became foundational:
- Craveo exists to **give food content a dedicated space**.
- The platform prioritizes food discovery, food culture, and culinary expression.
- This clarity directly shaped feature scope, UX decisions, and backend data modeling.

Defining this problem prevented unnecessary scope drift.


### **2. Visualizing Architecture & System Flow**

### Challenge
Explaining how the frontend, backend, GraphQL layer, and database interact using text alone was limiting. It was difficult to mentally model data flow and responsibilities across layers.

### Lesson Learned
Using **Mermaid diagrams** to visualize system architecture:
- Made data flow and component responsibilities clearer
- Improved confidence in frontend–backend integration
- Created documentation that is easier to review and explain
- Clearer understanding on file and folder positioning and hierrachy.

Architecture visualization reduced ambiguity early in the project.


### **3. Choosing the Technology Stack**

### Challenge
There was initial uncertainty about which technologies were essential versus optional, especially given user needs and problem i want to solve.

### Lesson Learned
The stack was chosen intentionally based on project needs:
- **Next.js (App Router):** Clear routing and scalable structure
- **TypeScript:** Improved reliability and maintainability
- **GraphQL:** Flexible data fetching for a dynamic feed
- **MongoDB:** Well-suited for post-based, flexible schemas
- **TailwindCSS:** Faster UI iteration with consistent styling

Technology choices were driven by **product requirements and security purpose**, not trends.

### **4. Visual Identity, Typography & Color Decisions**

### Challenge
Choosing colors and visual identity required restraint. There was a risk of over-designing too early or introducing unnecessary complexity.

### Lesson Learned
Design decisions were purpose-driven:
- Healthy, food-inspired colors were selected to evoke healthy,  appetite and community.
- Typography was kept clean and readable
- Visual elements were limited to what supports the MVP

This reinforced the importance of **design simplicity**.

### **5. UX & Figma Design Challenges**

### Challenge
Designing the UI in Figma revealed several difficulties:
- Determining placement of interactions (like, comment, share)
- Designing a feed that feels engaging without clutter
- Ensuring layouts translate well across screen sizes

### Lesson Learned
UX decisions improved once focus shifted to the **core user journey**:
- Starting with the feed as the primary experience simplified design
- Mobile-first thinking clarified layout priorities
- Iterating wireframes before high-fidelity designs reduced rework

UX became about flow and intent, not decoration.

### 6. **Breaking the Project into Manageable Sizes**

### Challenge
The overall scope of Craveo initially felt overwhelming, especially with a compressed timeline.

### Lesson Learned
Breaking the project into **small, manageable units** made progress achievable:
- GitHub Issues were created for each clear task
- Each issue maps to a feature, document, or setup step
- This improved focus and reduced cognitive overload

Task decomposition became essential to momentum.


### **7. Using Documentation as a Planning Tool**

### Challenge
Early on, it was unclear how PRD, User Stories, Architecture, and Timeline documents differed. They initially felt overlapping.

### Lesson Learned
Understanding the purpose of each document brought clarity:
- **PRD:** Defines the problem and goals
- **User Stories:** Describe user needs and interactions
- **Architecture:** Explains system structure
- **Timeline & Challenges:** Capture execution and learning

Documentation evolved into a **thinking and alignment tool**, not just a requirement.


### **Current Status**

- Product problem is clearly defined
- Architecture is documented and visualized
- Technology stack is finalized
- Visual identity decisions are established
- UX direction is validated in Figma
- Work is broken into manageable GitHub issues
- Documentation structure is stable


---
*This document reflects challenges encountered so far and will evolve as Craveo moves into full implementation.*

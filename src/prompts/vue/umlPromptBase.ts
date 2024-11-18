export const baseUmlPrompt = `

# Requirement
- Must include component names
- Express sequential, iterative, and branching processes
- Emphasize iteration and branching within function processing
- Represent component mounting processes as initialization steps
- Detail the processes during component mounting
- Clearly indicate asynchronous functions as asynchronous
- Ignore CSS
- Ignore JSX rendering order
- Separate processing for each component
- The process flow for Vue components should be as follows:
  - created > mounted > render > event handler > updated > destroyed
- Explicit event firing conditions
  - Event types such as @click, @change, etc.
  - Event handler processing flow
- Identification of TypeScript/Vue specific syntax
  - Determine Vue code by the presence of template syntax
  - Identification of type definitions and interfaces
  - Identification of Composition API patterns (ref, reactive, computed, watch, etc.)

# important instructions
- Ensure your PlantUML code is free of syntax errors.
- Output what Japanese can read. However, if something should be in English, such as a function name, there is no problem in English.

# output
Only output PlantUML code. **No code blocks are required.**
Do not enclose in three backticks.

---

# Input code
{{CODE}}

---
`;

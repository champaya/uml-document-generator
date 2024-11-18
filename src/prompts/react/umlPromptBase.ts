export const baseUmlPrompt = `

# Requirement
- Must include component names
- To express sequential, iterative, and branching
- Iteration and branching should be expressed with special emphasis on iteration and branching in the processing within a function.
- The process at component mounting should be expressed as an initialization process.
- The process at component mount should be expressed in detail.
- Asynchronous functions should be expressed in such a way that it is clear that they are asynchronous.
- Ignore CSS.
- Ignore JSX rendering order.
- Separate processing for each component
- The process flow for React components should be as follows: mount > render > event handler > re-render > unmount
- Explicit event firing conditions
  - Event types such as onClick, onChange, etc.
  - Event handler processing flow
- Identification of TypeScript/React specific syntax
  - Determination of React code by existence of JSX
  - Identification of type definitions and interfaces
  - Identification of Hooks patterns (useState, useEffect, etc.)

# important instructions
- Make sure your PlantUML code is free of syntax errors.
- Output what Japanese can read. However, if something should be in English, such as a function name, there is no problem in English.

# output
Output only PlantUML code. **No code blocks are required.**
Do not enclose backquotation 3 code blocks

---

# Input code
{{CODE}}

---
`; 
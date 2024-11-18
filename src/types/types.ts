export interface UmlGeneratorConfig {
  inputPath: string;
  outputPath: string;
  promptPath: string;
} 

export interface Prompts {
  markdownPrompt: string;
  stateUmlPrompt: string;
  activityUmlPrompt: string;
  sequenceUmlPrompt: string;
}
import { Prompts } from '../../types/types';
import { markdownPrompt } from './markdownPrompt';
import { stateUmlPrompt } from './stateUmlPrompt';
import { activityUmlPrompt } from './activityUmlPrompt';
import { sequenceUmlPrompt } from './sequenceUmlPrompt';

export const reactPrompts: Prompts = {
    markdownPrompt,
    stateUmlPrompt,
    activityUmlPrompt,
    sequenceUmlPrompt,
  };
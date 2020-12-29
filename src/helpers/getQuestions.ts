import { CzEmojiConfig } from "../config";
import defaultQuestions, { Question } from "./defaultQuestion";

/**
 * Check if workspace config specifies a set of questions, otherwise use the default ones.
 *
 * @param czConfig CzEmojiConfig
 */
export const getQuestions = (czConfig: CzEmojiConfig): Question[] => {
  const questions: Question[] = !czConfig.questions
    ? defaultQuestions
    : czConfig.questions;

  return questions;
};

export default getQuestions;

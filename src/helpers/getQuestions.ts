import { CommitPromptCodeConfig, CommitPromptConfig } from "../config"
import defaultQuestions, { Question } from "./defaultQuestion"

/**
 * Check if workspace config specifies a set of questions, otherwise use the default ones.
 *
 * @param cpConfig CommitPromptConfig
 */
export const getQuestions = (
  cpConfig: CommitPromptConfig,
  cpCodeConfig: CommitPromptCodeConfig
): Question[] => {
  const questions: Question[] = !cpConfig.questions
    ? defaultQuestions(cpConfig, cpCodeConfig)
    : cpConfig.questions

  // Set subject maxLength from config
  if (cpCodeConfig.subjectLength) {
    const subjectIndex = questions.findIndex(
      (question: Question) => question.name === "subject"
    )

    if (subjectIndex > -1) {
      questions[subjectIndex].maxLength = cpCodeConfig.subjectLength
    }
  }

  return questions
}

export default getQuestions

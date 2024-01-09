import type { CommitPromptExtensionContext } from '../extension'
import type { Question } from './defaultCommitQuestions'
import defaultCommitQuestions from './defaultCommitQuestions'
import { getOrderedIssues } from './getOrderedIssues'

/**
 * Check if workspace config specifies a set of questions, otherwise use the default ones.
 */
export async function getCommitQuestions(
  extensionContext: CommitPromptExtensionContext,
): Promise<Question[]> {
  const { cpCodeConfig, cpConfig } = extensionContext

  const questions: Question[] = cpConfig?.commitQuestions || cpCodeConfig?.commitQuestions || defaultCommitQuestions(cpConfig, cpCodeConfig)

  // Set subject maxLength from config
  if (cpCodeConfig.subjectLength) {
    const subjectIndex = questions.findIndex(
      (question: Question) => question.name === 'subject',
    )

    if (subjectIndex > -1) {
      questions[subjectIndex].maxLength = cpCodeConfig.subjectLength
    }
  }

  return questions
}

export default getCommitQuestions

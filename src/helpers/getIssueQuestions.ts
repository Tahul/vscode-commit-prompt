import type { CommitPromptExtensionContext } from '../extension'
import type { Question } from './defaultCommitQuestions'
import defaultIssueQuestions from './defaultIssueQuestions'

/**
 * Check if workspace config specifies a set of questions, otherwise use the default ones.
 */
export function getIssueQuestions(extensionContext: CommitPromptExtensionContext): Question[] {
  const { cpCodeConfig, cpConfig } = extensionContext

  const questions: Question[] = !cpConfig.issueQuestions
    ? defaultIssueQuestions(cpConfig, cpCodeConfig)
    : cpConfig.issueQuestions

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

export default getIssueQuestions

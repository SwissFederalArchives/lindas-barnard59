import { pathToFileURL } from 'url'
import { template } from '../utils.js'
import Issue from '../issue.js'

export default {
  ruleId: 14,
  ruleDescription: 'Operation defined in manifest can be imported',
  messageSuccessTemplate: template`${'filename'} can be imported for operation ${'op'}`,
  messageFailureTemplate: template`Cannot import ${'filename'} for operation ${'op'}`,
  async validate({ op, filename }) {
    let issue = Issue.error({ rule: this, templateData: { op, filename } })

    try {
      const fileUrl = pathToFileURL(filename).href
      await import(fileUrl)
      issue = Issue.info({ rule: this, templateData: { op, filename } })
    } catch (err) { }

    return issue
  },
  describeRule() {
    return {
      ruleId: this.ruleId,
      ruleDescription: this.ruleDescription,
      messageSuccess: this.messageSuccessTemplate(),
      messageFailure: this.messageFailureTemplate(),
    }
  },
}

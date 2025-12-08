import Environment from '@lindas/env-core'
import parent from 'lindas-barnard59-env'

class TestDataFactory {
  quad(...args) {
    const node = parent.quad(...args)
    node.extended = true
    return node
  }

  static exports = ['quad']
}

export default new Environment([TestDataFactory], { parent })

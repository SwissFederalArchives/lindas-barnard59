import rdf from 'lindas-barnard59-env'
import { fromRdf } from 'rdf-literal'
import { RangeConstraintBuilder } from '../../../lib/cube/buildCubeShape/constraintBuilder/RangeConstraintBuilder.js'
import { prepareValidator, buildShape, conforms } from './support.js'

const { xsd } = rdf.ns

describe('RangeConstraintBuilder', () => {
  const [one, two, three, four, five, six, seven, eight] = [1, 2, 3, 4, 5, 6, 7, 8].map(x => rdf.literal(`${x}`, xsd.integer))
  const wrong = rdf.literal('wrong', xsd.integer)
  const string = rdf.literal('foo', xsd.string)
  const namedNode = rdf.namedNode('http://example.org/namedNode')

  context('built from integers between 2 and 7', () => {
    before(prepareValidator(new RangeConstraintBuilder(rdf, fromRdf), four, two, three, seven))

    it('integers in range conform', function () { this.assertConforms(five, six) })
    it('integers outside range do not conform', function () { this.assertNotConforms(one, eight) })
  })
  it('should create an unconstrained shape due to wrong datatype', () => {
    const builder = new RangeConstraintBuilder(rdf, fromRdf)
    const validator = buildShape(builder, one, string, seven)
    conforms(validator, one, two, three, four, five, six, seven, eight, wrong, string, namedNode)
  })
  it('should create an unconstrained shape due to missing datatype', () => {
    const builder = new RangeConstraintBuilder(rdf, fromRdf)
    const validator = buildShape(builder, one, namedNode, seven)
    conforms(validator, one, two, three, four, five, six, seven, eight, wrong, string, namedNode)
  })
  it('should create an unconstrained shape due to unexpected value', () => {
    const builder = new RangeConstraintBuilder(rdf, fromRdf)
    const validator = buildShape(builder, one, wrong, seven)
    conforms(validator, one, two, three, four, five, six, seven, eight, wrong, string, namedNode)
  })
  it('should create an unconstrained shape due to parsing issue of initial value', () => {
    const builder = new RangeConstraintBuilder(rdf, fromRdf)
    const validator = buildShape(builder, wrong)
    conforms(validator, one, two, three, four, five, six, seven, eight, wrong, string, namedNode)
  })
})

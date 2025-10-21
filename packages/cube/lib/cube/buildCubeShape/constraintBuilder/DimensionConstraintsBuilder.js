import { DatatypeConstraintBuilder } from './DatatypeConstraintBuilder.js';
import { CompositeConstraintBuilder } from './CompositeConstraintBuilder.js';
import { RangeConstraintBuilder } from './RangeConstraintBuilder.js';
import { ValuesConstraintBuilder } from './ValuesConstraintBuilder.js';
import { NodeKindConstraintBuilder } from './NodeKindConstraintBuilder.js';
const getValuesBuilder = (compositeBuilder) => compositeBuilder.builders.find((builder) => builder instanceof ValuesConstraintBuilder);
export class DimensionConstraintsBuilder {
    constructor({ rdf, datatypeParsers, inListMaxSize }) {
        this.rdf = rdf;
        this.datatypeParsers = datatypeParsers;
        this.inListMaxSize = inListMaxSize;
        this.builders = rdf.termMap();
    }
    #createBuilder(datatype) {
        if (this.datatypeParsers.has(datatype)) {
            return new CompositeConstraintBuilder(new DatatypeConstraintBuilder(this.rdf, datatype), new RangeConstraintBuilder(this.rdf, this.datatypeParsers.get(datatype)));
        }
        else {
            return new CompositeConstraintBuilder(new DatatypeConstraintBuilder(this.rdf, datatype), new ValuesConstraintBuilder(this.rdf, this.inListMaxSize));
        }
    }
    #addDatatype(object) {
        if (!('datatype' in object))
            return;
        const builder = this.builders.get(object.datatype);
        if (builder) {
            builder.add(object);
        }
        else {
            const builder = this.#createBuilder(object.datatype);
            builder.add(object);
            this.builders.set(object.datatype, builder);
        }
    }
    #addOther(object) {
        if (this.valuesBuilder) {
            this.valuesBuilder.add(object);
        }
        else {
            this.valuesBuilder = new CompositeConstraintBuilder(new ValuesConstraintBuilder(this.rdf, this.inListMaxSize), new NodeKindConstraintBuilder(this.rdf));
            this.valuesBuilder.add(object);
        }
    }
    add(object) {
        if ('datatype' in object) {
            this.#addDatatype(object);
        }
        else {
            this.#addOther(object);
        }
    }
    build(ptr) {
        const builders = [...this.builders.values()];
        if (this.valuesBuilder) {
            builders.push(this.valuesBuilder);
        }
        if (builders.length === 1) {
            builders[0].build(ptr);
        }
        if (builders.length > 1) {
            // if all builders have sh:in, then merge them
            const valuesBuilders = builders.map(getValuesBuilder).filter(Boolean);
            if (valuesBuilders.length === builders.length && valuesBuilders.every(builder => builder.enabled)) {
                const merged = new ValuesConstraintBuilder(this.rdf);
                const allValues = valuesBuilders.flatMap(builder => Array.from(builder.values));
                allValues.forEach(value => merged.add(value));
                valuesBuilders.forEach(builder => { builder.enabled = false; });
                merged.build(ptr);
            }
            ptr.addList(this.rdf.ns.sh.or, builders.map(builder => {
                const blankNode = ptr.blankNode();
                builder.build(blankNode);
                return blankNode;
            }));
        }
    }
}

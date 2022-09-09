import { QueryEditorExpressionType } from 'components/LegacyQueryEditor/editor/expressions';
import { QueryEditorOperator, QueryEditorPropertyType } from 'schema/types';
import {
  getOperatorExpressionOptions,
  getOperatorExpressionValue,
  sanitizeOperator,
  setOperatorExpressionName,
  setOperatorExpressionProperty,
  setOperatorExpressionValue,
} from './utils';

describe('setOperatorExpressionProperty', () => {
  it('should set a property from an empty expression', () => {
    expect(setOperatorExpressionProperty({}, 'ActivityName', QueryEditorPropertyType.String)).toEqual({
      type: QueryEditorExpressionType.Operator,
      property: { name: 'ActivityName', type: QueryEditorPropertyType.String },
      operator: { name: '==', value: '' },
    });
  });

  it('should keep the operator name if defined', () => {
    expect(
      setOperatorExpressionProperty(
        { operator: { name: '!=', value: 'c' } },
        'ActivityName',
        QueryEditorPropertyType.String
      )
    ).toEqual({
      type: QueryEditorExpressionType.Operator,
      property: { name: 'ActivityName', type: QueryEditorPropertyType.String },
      operator: { name: '!=', value: '' },
    });
  });

  it('change the operator name if the new type does not support it', () => {
    expect(
      setOperatorExpressionProperty(
        { operator: { name: 'startswith', value: 'c' } },
        'ID',
        QueryEditorPropertyType.Number
      )
    ).toEqual({
      type: QueryEditorExpressionType.Operator,
      property: { name: 'ID', type: QueryEditorPropertyType.Number },
      operator: { name: '==', value: 0 },
    });
  });
});

describe('setOperatorExpressionName', () => {
  it('should set a expression name (operator)', () => {
    expect(setOperatorExpressionName({}, '!=')).toEqual({
      type: QueryEditorExpressionType.Operator,
      property: { name: '', type: QueryEditorPropertyType.String },
      operator: { name: '!=', value: '' },
    });
  });

  it('should keep the current comparison value', () => {
    expect(setOperatorExpressionName({ operator: { name: '==', value: 'foo' } }, '!=')).toEqual({
      type: QueryEditorExpressionType.Operator,
      property: { name: '', type: QueryEditorPropertyType.String },
      operator: { name: '!=', value: 'foo' },
    });
  });

  it('should convert a value to an array', () => {
    expect(setOperatorExpressionName({ operator: { name: '==', value: 'foo' } }, 'in')).toEqual({
      type: QueryEditorExpressionType.Operator,
      property: { name: '', type: QueryEditorPropertyType.String },
      operator: { name: 'in', value: ['foo'] },
    });
  });

  it('should convert an array to a string', () => {
    expect(setOperatorExpressionName({ operator: { name: 'in', value: ['foo'] } }, '!=')).toEqual({
      type: QueryEditorExpressionType.Operator,
      property: { name: '', type: QueryEditorPropertyType.String },
      operator: { name: '!=', value: 'foo' },
    });
  });
});

describe('setOperatorExpressionValue', () => {
  it('should set a single value', () => {
    expect(
      setOperatorExpressionValue(
        { property: { type: QueryEditorPropertyType.String, name: 'ActivityName' } },
        { value: 'foo' }
      )
    ).toEqual({
      type: QueryEditorExpressionType.Operator,
      property: { type: QueryEditorPropertyType.String, name: 'ActivityName' },
      operator: { name: '==', value: 'foo' },
    });
  });

  it('should keep the operator name', () => {
    expect(
      setOperatorExpressionValue(
        {
          property: { type: QueryEditorPropertyType.String, name: 'ActivityName' },
          operator: { name: '!=', value: 'bar' },
        },
        { value: 'foo' }
      )
    ).toEqual({
      type: QueryEditorExpressionType.Operator,
      property: { type: QueryEditorPropertyType.String, name: 'ActivityName' },
      operator: { name: '!=', value: 'foo' },
    });
  });

  it('should set an array of values', () => {
    expect(
      setOperatorExpressionValue({ property: { type: QueryEditorPropertyType.String, name: 'ActivityName' } }, [
        { value: 'foo' },
        { value: 'bar' },
      ])
    ).toEqual({
      type: QueryEditorExpressionType.Operator,
      property: { type: QueryEditorPropertyType.String, name: 'ActivityName' },
      operator: { name: '==', value: ['foo', 'bar'] },
    });
  });
});

describe('getOperatorExpressionValue', () => {
  it('get the current value', () => {
    expect(getOperatorExpressionValue('foo')).toEqual({ label: 'foo', value: 'foo' });
  });

  it('get the current value', () => {
    const value = [
      { label: 'foo', value: 'foo' },
      { label: 'bar', value: 'bar' },
    ];
    expect(getOperatorExpressionValue(value)).toEqual(value);
  });

  it('remove quotes for single values', () => {
    expect(getOperatorExpressionValue("'$foo'")).toEqual({ label: '$foo', value: '$foo' });
  });
});

describe('getOperatorExpressionOptions', () => {
  const value = [{ label: 'foo', value: 'foo' }];
  it('get the current value', () => {
    expect(getOperatorExpressionOptions(value)).toEqual(value);
  });

  it('parse the current single value as options', () => {
    expect(getOperatorExpressionOptions(undefined, 'foo')).toEqual(value);
  });

  it('parse the current array value as options', () => {
    expect(getOperatorExpressionOptions(undefined, ['foo'])).toEqual(value);
  });
});

describe('sanitizeOperator', () => {
  it('ignores an expression with a missing property name', () => {
    expect(
      sanitizeOperator({
        operator: { name: '==', value: 'foo' },
      })
    ).toBeUndefined();
  });

  it('ignores an expression with a missing operator name', () => {
    expect(
      sanitizeOperator({
        property: { name: 'ID', type: QueryEditorPropertyType.Number },
        operator: { name: '', value: 'foo' },
      })
    ).toBeUndefined();
  });

  it('ignores an expression with a missing operator value', () => {
    expect(
      sanitizeOperator({
        property: { name: 'ID', type: QueryEditorPropertyType.Number },
        operator: { name: '==' } as QueryEditorOperator,
      })
    ).toBeUndefined();
  });

  it('returns a valid operator', () => {
    const op = {
      property: { name: 'ID', type: QueryEditorPropertyType.Number },
      operator: { name: '==', value: 123 },
    };
    expect(sanitizeOperator(op)).toEqual({ type: QueryEditorExpressionType.Operator, ...op });
  });

  it('returns a valid operator (boolean)', () => {
    const op = {
      property: { name: 'ID', type: QueryEditorPropertyType.Boolean },
      operator: { name: '==', value: false },
    };
    expect(sanitizeOperator(op)).toEqual({ type: QueryEditorExpressionType.Operator, ...op });
  });
});

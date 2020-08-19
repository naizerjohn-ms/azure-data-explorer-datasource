import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { QueryEditorPropertyExpression, QueryEditorArrayExpression } from './editor/expressions';

export interface QueryExpression {
  from?: QueryEditorPropertyExpression;
  where: QueryEditorArrayExpression;
  reduce: QueryEditorArrayExpression;
  groupBy: QueryEditorArrayExpression;
}

export interface KustoQuery extends DataQuery {
  query: string;
  database: string;
  alias?: string;
  resultFormat: string;
  expression?: QueryExpression;
  rawMode?: boolean;
}

export const defaultQuery: Partial<KustoQuery> = {
  query: '',
};

export interface AdxDataSourceOptions extends DataSourceJsonData {
  defaultDatabase: string;
  minimalCache: number;
}

export interface AdxSchema {
  Databases: Record<string, AdxDatabaseSchema>;
}

export interface AdxDatabaseSchema {
  Name: string;
  Tables: Record<string, AdxTableSchema>;
  ExternalTables: Record<string, AdxTableSchema>;
}

export interface AdxTableSchema {
  Name: string;
  OrderedColumns: AdxColumnSchema[];
}

export interface AdxColumnSchema {
  Name: string;
  CslType: string;
}

/** Typings for the useAsync hook from react-use */
export interface AsyncState<T = {}> {
  value?: T;
  loading: boolean;
  error?: Error;
}

import { Request, Response } from 'express';

export interface Pagination {
  page: number;
  limit: number;
  next: string;
}

export interface FetchResponse extends Response {
  advancedResults: AdvancedResults;
}

export interface PopulateOptions {
  path?: any;
  select?: any;
  model?: any;
  match?: any;
  options?: any;
}

interface AdvancedResults {
  success: boolean;
  count?: number;
  pagination?: Pagination;
  data: any | any[];
}

interface Json {
  success: boolean;
  data?: any | any[];
}

type Send<T = Response> = (body?: Json) => T;

export interface JsonResponse extends Response {
  json: Send<this>;
}

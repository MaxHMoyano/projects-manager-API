import { Request, Response } from 'express';

export interface FileRequest extends Request {
  files: File[];
}


export interface Pagination {
  page: number
  limit: number
  next: string
}

export interface ServerResponse extends Response {
  advancedResults: AdvancedResults
}

export interface PopulateOptions {
  path?: any;
  select?: any;
  model?: any
  match?: any;
  options?: any
}

interface AdvancedResults {
  success: boolean
  count?: number
  pagination?: Pagination
  data:   any | any[]
}


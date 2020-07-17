import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Local imports
import { ServerResponse, PopulateOptions } from '../utils/models';
import asyncHandler from './async';

const advancedResults = (
  model: mongoose.Model<any>,
  populate: PopulateOptions,
) =>
  asyncHandler(
    async (req: Request, res: ServerResponse, next: NextFunction) => {
      console.log('advanced results');
      let queryParams, fields, sortBy;
      // Make a copy of the query parameters
      const reqQuery = { ...req.query };
      const params: any = req.query as any;
      // Fields to exclude
      const removeFields = ['select', 'sort', 'page', 'limit'];

      // Loop on removeFields and delete them from query
      removeFields.forEach((param) => delete reqQuery[param]);

      let queryParamsStr = JSON.stringify(reqQuery);

      if (params.select) {
        fields = params.select.split(',').join(' ');
      }

      //sorting
      if (params.sort) {
        sortBy = params.sort.split(',').join(' ');
      } else {
        sortBy = 'createdAt';
      }

      // This is for looking fields with operators
      queryParamsStr = queryParamsStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`,
      );
      queryParams = JSON.parse(queryParamsStr);

      // pagination
      const page = parseInt(params.page, 10) || 1;
      const limit = parseInt(params.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await model.countDocuments();

      // Pagination result
      const pagination: any = {};
      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit,
        };
      }

      if (startIndex > 0) {
        pagination.previous = {
          page: page - 1,
          limit,
        };
      }

      // create database query
      let query = model
        .find(queryParams)
        .select(fields)
        .sort(sortBy)
        .skip(startIndex)
        .limit(limit);

      if (populate) {
        query = query.populate(populate);
      }

      // Finding resources
      const results = await query;
      res.advancedResults = {
        success: true,
        count: total,
        pagination,
        data: results,
      };
      next();
    },
  );

export default advancedResults;

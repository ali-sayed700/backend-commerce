const asyncHandler = require("express-async-handler");
const ApiError = require("../utility/ApiError");
const ApiFeature = require("../utility/ApiFeatures");

exports.DeleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await model.findByIdAndDelete(id);
    if (!document) {
      // res.status(404).json({ msg: `no brand for this ${id}` });
      return next(new ApiError(`no ${document} for this ${id}`, 404));
    }
    // traigger  "remove" event ot update document
    document.deleteOne();
    res.status(204).send();
  });

exports.UpdateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // to back category after update not before
    );
    if (!document) {
      // res.status(404).json({ msg: `no category for this ${id}` });
      return next(
        new ApiError(`no ${document} for this ${req.params.id}`, 404)
      );
    }
    // traigger  "save" event ot update document
    document.save();
    res.status(200).json({ data: document });
  });

exports.CreateOne = (model) =>
  asyncHandler(async (req, res) => {
    const document = await model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.GetOne = (model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    let query = model.findById(req.params.id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    const document = await query;
    if (!document) {
      // res.status(404).json({ msg: `no brand for this ${id}` });
      return next(new ApiError(`no product for this ${document}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.GetAll = (model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const countDocument = await model.countDocuments();
    const ApiFeatures = new ApiFeature(model.find(filter), req.query)
      .filter()
      .search(modelName)
      .paginate(countDocument, modelName)
      .sort()
      .limitFields();

    const { mongooseQuery, paginationResult } = ApiFeatures;
    const document = await mongooseQuery;
    res
      .status(200)
      .json({ results: document.length, paginationResult, data: document });
  });

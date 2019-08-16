const Item = require('../models/Item');
const ItemService = require('../services/itemService');
const paging = require('../services/paging');
const json_error = require('../services/json_error');

const add = async (req, res, next) => {
    console.log(req.file, "file1");
    let addRequestPromise= ItemService.checkAddRequest(req, res);
    addRequestPromise.then((reqItem) => {
        var item = new Item(reqItem);
        console.log(item);
        item.save()
            .then(newItem => {
                console.log(newItem, "where is it struck");
                res.json(paging.camelCase(newItem));
            })
            .catch(err => {
                res.status(400).json({error: err});
            });
    }, function(err){
        return res.status(err.code).json({error: err.error});
    });
}

const get = async (req, res, next) => {
    let {pageSize} = paging.getPageSize(req);
    console.log(req.login_user, "loginUser");
    Item.find({})
        .populate('categories', 'name')
        .populate('tags', 'name')
        .limit(pageSize)
        .exec(function (err, results) {
            if (err) return next(err);
            console.log(results.length, "res");
            return res.json(paging.pageResponse(pageSize, results));
        });
}

const getItemsByCategory = async (req, res, next) => {
    let {pageSize} = paging.getPageSize(req);

    if (!req.body.categories || req.body.categories.length == 0){
        return res.status(400).json(json_error.IsRequired('categories'));
    }

    let categories = req.body.categories;
    
    Item.find({categories: {$all: categories}})
        .limit(pageSize)
        .exec(function (err, results) {
            if(err) return next(err);
            return res.json(paging.pageResponse(pageSize, results));
        })
}

const search = async (req, res) => {
    let {pageSize} = paging.getPageSize(req);
    if (!req.query.keyword){
        return res.status(400).json(json_error.IsRequired('keyword'));
    }
    if (req.query.keyword.length < 3){
        return res.status(400).json(json_error.AtLeast('keyword',3));
    }
    let keyword = `.*${req.query.keyword}.*`;
    Item.find({$or: [{
                        "name": {
                            '$regex': keyword
                        }
                    },
                    {
                        "description": {
                            '$regex': keyword
                        }
                    }
        ]})
        .limit(pageSize)
        .exec(function (err, results) {
            if (err) return next(err);
            return res.json(paging.pageResponse(pageSize,results));
        });
}

const remove = async (req, res) => {

}

module.exports = {
    add,
    get,
    getItemsByCategory,
    search,
    remove,
}
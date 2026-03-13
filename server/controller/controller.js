const model = require('../models/model');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function create_categories(req, res) {
    try {
        const Create = new model.Categories({
            type: "Investment",
            color: "#FCBE44"
        });
        await Create.save();
        return res.json(Create);
    } catch (err) {
        return res.status(400).json({ message: `Error while creating categories ${err}` });
    }
}

async function get_categories(req, res) {
    try {
        let data = await model.Categories.find({});
        let filter = data.map(v => ({ type: v.type, color: v.color }));
        return res.json(filter);
    } catch (err) {
        return res.status(400).json({ message: `Error while getting categories ${err}` });
    }
}

async function create_transaction(req, res) {
    try {
        if (!req.body) return res.status(400).json("Post HTTP Data not Provided");
        let { name, type, amount } = req.body;
        const create = new model.Transaction({ name, type, amount, date: new Date() });
        await create.save();
        return res.json(create);
    } catch (err) {
        return res.status(400).json({ message: `Error while creating transaction ${err}` });
    }
}

async function get_transaction(req, res) {
    try {
        let data = await model.Transaction.find({});
        return res.json(data);
    } catch (err) {
        return res.status(400).json({ message: `Error while getting transactions ${err}` });
    }
}

async function delete_transaction(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "Request body not found" });
        await model.Transaction.deleteOne(req.body);
        return res.json("Record Deleted...!");
    } catch (err) {
        return res.status(400).json({ message: `Error while deleting transaction ${err}` });
    }
}

async function get_labels(req, res) {
    try {
        const result = await model.Transaction.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: 'type',
                    foreignField: "type",
                    as: "categories_info"
                }
            },
            { $unwind: "$categories_info" }
        ]);
        let data = result.map(v => ({
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            color: v.categories_info['color']
        }));
        return res.json(data);
    } catch (err) {
        return res.status(400).json("Lookup Collection Error");
    }
}

module.exports = {
    create_categories,
    get_categories,
    create_transaction,
    get_transaction,
    delete_transaction,
    get_labels
}
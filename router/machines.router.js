import express from "express";
import Joi from "joi";
import { Client } from "../index.js";

const router = express.Router();

const dataSchema = Joi.object({
  prod: Joi.number().integer().required(),
  date: Joi.required(),
  time: Joi.required(),
});

router.post("/machine", async (request, respond) => {
  const { error, value } = dataSchema.validate(request.query);
  console.log(value);
  if (error) {
    console.log(error.message);
  } else {
    // const date = request.query.date;
    // const time = request.query.time;
    //console.log(prod, date, time);
    console.log(value);
    const result = await Client.db("cnc_company")
      .collection("products")
      .insertOne(value);
    respond.status(200).send({ message: "data inserted successfully" });
  }
});

router.get("/machine", async (request, respond) => {
  const result = await Client.db("cnc_company")
    .collection("products")
    .find({})
    .toArray();
  respond.status(200).send(result);
});

export default router;

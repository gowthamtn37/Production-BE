import express from "express";
import Joi from "joi";
import { Client } from "../index.js";
import { auth } from "../middleware/auth.js";

import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "../index.js";
import { httpServer } from "../index.js";

const router = express.Router();

const dataSchema = Joi.object({
  prod: Joi.number().integer().required(),
  date: Joi.required(),
  time: Joi.required(),
});

router.post("/", async (request, respond) => {
  const { prod, date, time } = request.query;
  if (!prod || !date || !time) {
    return respond.status(400).send({ message: "missing data" });
  } else {
    const { error, value } = dataSchema.validate({ prod, date, time });

    const isoDate = value.date + "T" + value.time;
    if (error) {
      console.log(error.message);
    } else {
      const data = {
        quantity: value.prod,
        time: isoDate,
      };

      const io = new Server(httpServer, {
        cors: {
          origin: "https://exquisite-froyo-600594.netlify.app/",
        },
      });
      io.on("connection", (socket) => {
        socket.emit("send_msg", data);
      });

      const result = await Client.db("cnc_company")
        .collection("products")
        .insertOne(data);
      respond.status(200).send({ message: "data inserted successfully" });
    }
  }
});

router.get("/", auth, async (request, respond) => {
  const result = await Client.db("cnc_company")
    .collection("products")
    .find({})
    .toArray();
  respond.status(200).send(result);
});

export default router;

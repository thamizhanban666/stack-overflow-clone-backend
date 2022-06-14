const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const QuestionDB = require("../models/Question");
const authenticate = require("./authenticate")

router.post("/", authenticate ,  async (req, res) => {
  const questionData = new QuestionDB({
    title: req.body.title,
    body: req.body.body,
    tags: req.body.tags,
    user: req.body.user,
  })
  try {
    const doc = await questionData.save()
    res.status(201).send({
      status: true,
      data: doc
    })
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Question could not be added"
    })
  }
})

router.get("/", async (req, res) => {
  QuestionDB.aggregate([
    {
      $lookup: {
        from: "comments",
        let: { q_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$question_id", "$$q_id"],
              }
            }
          },
          {
            $project: {
              _id: 1,
              comment: 1,
              created_at: 1,
            }
          }
        ],
        as: "comments",
      }
    },
    {
      $lookup: {
        from: "answers",
        let: { question_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$question_id", "$$question_id"],
              }
            }
          },
          {
            $project: { 
              _id: 1,
              answer: 1,
              created_at: 1,
            }
          }
        ],
        as: "answerDetails"
      }
    },
    {
      $project: {
        __v: 0
      }
    }
  ])
    .exec()
    .then((questionDetails) => {
      res.status(200).send(questionDetails)
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send(error)
    })
});

router.get("/:id", async (req, res) => {
  try {
    QuestionDB.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.params.id) }
      },
      {
        $lookup: {
          from: "answers",
          let: { question_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$question_id", "$$question_id"],
                }
              }
            },
            {
              $project: {
                _id: 1,
                user: 1,
                answer: 1,
                question_id: 1,
                created_at: 1
              }
            }
          ],
          as: "answerDetails"
        }
      },
      {
        $lookup: {
          from: "comments",
          let: { question_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$question_id", "$$question_id"],
                }
              }
            },
            {
              $project: {
                _id: 1,
                question_id: 1,
                user: 1,
                comment: 1,
                created_at: 1,
              }
            }
          ],
          as: "comments",
        }
      },
      {
        $project: {
          __v: 0,
        }
      }
    
    ])
      .exec()
      .then((questionDetails) => {
        res.status(200).send(questionDetails)
      })
      .catch((error) => {
        console.log(error)
        res.status(400).send(error)
      });
  } catch (err) {
    res.status(400).send({message: "Question not found"})
  }
});

module.exports = router;
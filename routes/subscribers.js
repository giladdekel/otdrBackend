const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')
const axios= require('axios');
// Getting all
//http://172.50.30.222/api/v1/vesion/settings
// 'https://jsonplaceholder.typicode.com/todos?_limit=5'
// 'http://172.50.30.222/api/v1/monitoring/tests'
router.get('/', async (req, res) => {
  try {

    axios
    .get('https://jsonplaceholder.typicode.com/todos?_limit=5', {
      // Axios looks for the `auth` option, and, if it is set, formats a
      // basic auth header for you automatically.
      withCredentials: true,

      auth: {
        username: 'rtuadmin',
        password: '*10238~'
      }
    })
    .then(res => console.log("data: ",res.data[1].title))
    .catch(err => console.error(err));



    




    // const res = await axios.get('https://httpbin.org/basic-auth/foo/bar', {
    //   // Axios looks for the `auth` option, and, if it is set, formats a
    //   // basic auth header for you automatically.
    //   auth: {
    //     username: 'foo',
    //     password: 'bar'
    //   }
    // });
    // res.status; // 200







  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getSubscriber, (req, res) => {
  res.json(res.subscriber)
})

// Creating one
router.post('/', async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel
  })
  try {
    const newSubscriber = await subscriber.save()
    res.status(201).json(newSubscriber)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.patch('/:id', getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name
  }
  if (req.body.subscribedToChannel != null) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel
  }
  try {
    const updatedSubscriber = await res.subscriber.save()
    res.json(updatedSubscriber)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove()
    res.json({ message: 'Deleted Subscriber' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getSubscriber(req, res, next) {
  let subscriber
  try {
    subscriber = await Subscriber.findById(req.params.id)
    if (subscriber == null) {
      return res.status(404).json({ message: 'Cannot find subscriber' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.subscriber = subscriber
  next()
}

module.exports = router